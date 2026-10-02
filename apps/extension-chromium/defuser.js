// ===== BYEADS DEFUSER & SCRIPTLET ENGINE =====
// Runs in document MAIN context before page scripts execute.
// Neutralizes YouTube player ad feeds, anti-adblock detection, popups, and click-redirection traps.

(function () {
  'use strict';

  // 1. YouTube & YouTube Music Player Response Interceptor
  let originalPlayerResponse = window.ytInitialPlayerResponse;

  function sanitizePlayerResponse(resp) {
    if (!resp || typeof resp !== 'object') return resp;
    try {
      if (resp.adPlacements) resp.adPlacements = [];
      if (resp.playerAds) resp.playerAds = [];
      if (resp.adSlots) resp.adSlots = [];
      if (resp.playbackTracking) {
        if (resp.playbackTracking.videostatsPlaybackUrl) {
          delete resp.playbackTracking.videostatsPlaybackUrl.baseUrl;
        }
      }
    } catch {}
    return resp;
  }

  // Hook ytInitialPlayerResponse getter/setter
  try {
    Object.defineProperty(window, 'ytInitialPlayerResponse', {
      configurable: true,
      enumerable: true,
      get: () => originalPlayerResponse,
      set: (val) => {
        originalPlayerResponse = sanitizePlayerResponse(val);
      }
    });
  } catch {}

  // Hook window.fetch for dynamic player calls (/youtubei/v1/player)
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';

      // Block YouTube ad telemetry endpoints directly at the JS API boundary
      if (
        url.includes('/api/stats/ads') ||
        url.includes('/pagead/') ||
        url.includes('/ptracking') ||
        url.includes('/get_midroll_info')
      ) {
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      }

      const response = await originalFetch.apply(this, args);

      // Sanitize JSON response for dynamic player streams
      if (url.includes('/youtubei/v1/player')) {
        try {
          const clone = response.clone();
          const json = await clone.json();
          const cleaned = sanitizePlayerResponse(json);
          return new Response(JSON.stringify(cleaned), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        } catch {
          return response;
        }
      }

      return response;
    };
  }

  // 2. Anti-Adblock Defuser & Bait Object Emulation
  try {
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.adblock = false;
    window.hasAdBlocker = false;
    window.google_ad_client = "ca-pub-0000000000000000";

    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
      window.adsbygoogle.push = function () { return 1; };
    }

    if (!window.Adblock) {
      window.Adblock = {
        isDetected: function () { return false; },
        active: false
      };
    }
  } catch {}

  // 3. Air-Tight Pop-Up, Pop-Under & Click-Hijack Defense
  const POPUP_AD_PATTERNS = [
    'popads', 'popcash', 'propeller', 'adsterra', 'exoclick', 'monetag', 'hilltopads',
    'adcash', 'onclickads', 'trafficjunky', 'juicyads', 'exdynsrv', 'exosrv', 'realsrv',
    'rtmark', 'doublepimp', 'traffichaus', 'clickadu', 'yllix', 'bidvertiser', 'admaven',
    'ad-maven', 'deloton', 'tsyndicate', 'zeroredirect', 'alwingulla', 'onclickperformance',
    'popunder', 'trafficstars', 'plugrush', 'popmyads', 'directrev', 'adnetworkperformance',
    'clck.ru', 'adnxs', 'criteo', 'taboola', 'outbrain', 'mgid', 'revcontent', 'doubleclick',
    'googlesyndication', 'adservice.google', 'googleadservices', 'smartadserver', 'rubiconproject',
    'pubmatic', 'openx', 'casalemedia', 'bet365', '1xbet', 'vulkan', 'parimatch', 'spinanga',
    'onclick', 'click_id=', 'camp_id=', 'aff_id=', 'direct-link', 'redirect-jump'
  ];

  function isAdPattern(str) {
    if (!str) return false;
    const lower = String(str).toLowerCase();
    return POPUP_AD_PATTERNS.some(p => lower.includes(p));
  }

  // Safe dummy window proxy that absorbs delayed popup redirection
  function createDummyWindow() {
    const dummyLoc = {
      href: 'about:blank',
      assign: () => {},
      replace: () => {},
      reload: () => {}
    };
    return {
      focus: () => {},
      blur: () => {},
      close: () => {},
      closed: true,
      document: {
        write: () => {},
        writeln: () => {},
        open: () => {},
        close: () => {},
        createElement: () => document.createElement('div')
      },
      location: new Proxy(dummyLoc, {
        get: (t, prop) => t[prop] || '',
        set: (t, prop, val) => {
          console.warn('[BYEADS Defuser] Blocked delayed popup location hijack to:', val);
          return true;
        }
      })
    };
  }

  // A. Hook window.open
  try {
    const originalWindowOpen = window.open;

    window.open = function (url, target, features) {
      const urlStr = String(url || '').toLowerCase();
      const currentHost = window.location.hostname.replace(/^www\./, '');

      // Check if URL matches ad patterns
      if (isAdPattern(urlStr)) {
        console.warn('[BYEADS Defuser] Blocked ad popup window.open:', url);
        return createDummyWindow();
      }

      // Check for blank window opening with intent to redirect later
      if (!url || url === '' || url === 'about:blank') {
        // If features contain popunder characteristics (dimensions off-screen or small)
        const featStr = String(features || '').toLowerCase();
        if (featStr.includes('top=') || featStr.includes('left=') || featStr.includes('width=1')) {
          console.warn('[BYEADS Defuser] Blocked popunder window.open features:', features);
          return createDummyWindow();
        }
      }

      // If URL has a different domain that is not related to current domain
      if (urlStr.startsWith('http')) {
        try {
          const parsed = new URL(urlStr);
          const destHost = parsed.hostname.replace(/^www\./, '');
          const isSameDomain = destHost === currentHost || destHost.endsWith('.' + currentHost);

          if (!isSameDomain && isAdPattern(destHost)) {
            console.warn('[BYEADS Defuser] Blocked cross-domain ad redirect window.open:', url);
            return createDummyWindow();
          }
        } catch {}
      }

      return originalWindowOpen.apply(this, arguments);
    };
  } catch {}

  // B. Hook HTMLAnchorElement.prototype.click (blocks synthetic <a> ad clicks)
  try {
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      const href = String(this.href || '').toLowerCase();
      const isAd = isAdPattern(href);

      // Check if element is invisible, detached, or synthetic popup trigger
      const isDetached = !this.isConnected;
      const isHidden = this.style.display === 'none' ||
                       this.style.visibility === 'hidden' ||
                       this.style.opacity === '0' ||
                       (this.offsetWidth === 0 && this.offsetHeight === 0);

      if (isAd || (this.target === '_blank' && (isDetached || isHidden))) {
        console.warn('[BYEADS Defuser] Blocked synthetic anchor click ad redirect:', this.href);
        return;
      }

      return originalAnchorClick.apply(this, arguments);
    };
  } catch {}

  // C. Hook HTMLFormElement.prototype.submit (blocks hidden form popup submits)
  try {
    const originalFormSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      const action = String(this.action || '').toLowerCase();
      if (isAdPattern(action) || (this.target === '_blank' && this.style.display === 'none')) {
        console.warn('[BYEADS Defuser] Blocked synthetic form submit ad popup:', this.action);
        return;
      }
      return originalFormSubmit.apply(this, arguments);
    };
  } catch {}

  // D. Capturing Click Listener: Trap Transparent Overlays & Ad Links
  try {
    window.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;

      // 1. Check if user clicked an ad link
      const anchor = target.closest('a');
      if (anchor) {
        const href = String(anchor.href || '').toLowerCase();
        if (isAdPattern(href)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          anchor.remove();
          console.warn('[BYEADS Defuser] Neutralized click on ad link:', href);
          return false;
        }
      }

      // 2. Check if target is a full-screen transparent clickjack overlay
      const rect = target.getBoundingClientRect();
      const isFullWidth = rect.width >= window.innerWidth * 0.65;
      const isFullHeight = rect.height >= window.innerHeight * 0.65;

      if (isFullWidth && isFullHeight && target.tagName !== 'VIDEO') {
        const cs = window.getComputedStyle(target);
        const isFixedOrAbs = cs.position === 'fixed' || cs.position === 'absolute';
        const isTransparent = parseFloat(cs.opacity) <= 0.1 ||
                              cs.backgroundColor === 'transparent' ||
                              cs.backgroundColor.includes('rgba(0, 0, 0, 0)') ||
                              cs.backgroundColor === 'rgba(0,0,0,0)';

        const textLen = (target.innerText || '').trim().length;
        if (isFixedOrAbs && isTransparent && textLen < 15) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          target.remove();
          console.warn('[BYEADS Defuser] Neutralized and removed full-screen clickjack overlay');
          return false;
        }
      }
    }, true);
  } catch {}

  // 4. Prevent Anti-Adblock & Nag-Wall Overlays from Locking Body Scroll
  const unfreezeScroll = () => {
    try {
      if (document.body) {
        const style = window.getComputedStyle(document.body);
        if (style.overflow === 'hidden') {
          const hasBlocker = document.querySelector(
            '[class*="adblock"], [id*="adblock"], [class*="paywall"], [class*="signup_wall"], [class*="AppPrompt"], [data-testid="bottom_sheet"]'
          );
          if (hasBlocker) {
            document.body.style.setProperty('overflow', 'auto', 'important');
            if (document.documentElement) {
              document.documentElement.style.setProperty('overflow', 'auto', 'important');
            }
          }
        }
      }
    } catch {}
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unfreezeScroll);
  } else {
    unfreezeScroll();
  }
})();
