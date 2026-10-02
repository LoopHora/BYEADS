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

      // Block ad telemetry endpoints
      if (
        url.includes('/api/stats/ads') ||
        url.includes('/pagead/') ||
        url.includes('/ptracking') ||
        url.includes('/get_midroll_info') ||
        url.includes('adeventtracker.spotify.com')
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

  // Hook XMLHttpRequest for background ad fetches
  try {
    const origXHROpen = XMLHttpRequest.prototype.open;
    const origXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._byeads_url = String(url || '');
      return origXHROpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function (...args) {
      if (this._byeads_url) {
        const u = this._byeads_url;
        if (
          u.includes('/api/stats/ads') ||
          u.includes('adeventtracker.spotify.com')
        ) {
          Object.defineProperty(this, 'status', { value: 200, writable: false });
          Object.defineProperty(this, 'responseText', { value: '{}', writable: false });
          Object.defineProperty(this, 'response', { value: '{}', writable: false });
          Object.defineProperty(this, 'readyState', { value: 4, writable: false });
          setTimeout(() => {
            this.dispatchEvent(new Event('readystatechange'));
            this.dispatchEvent(new Event('load'));
            this.dispatchEvent(new Event('loadend'));
          }, 5);
          return;
        }
      }
      return origXHRSend.apply(this, args);
    };
  } catch {}



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

  // ===== GOD-LEVEL AGGRESSIVE SYSTEM DEFENSES =====

  // 5. Phishing Notification Prompt Trap (Auto-denies deceptive subscription spam)
  try {
    if (window.Notification && Notification.requestPermission) {
      const origReqPerm = Notification.requestPermission;
      Notification.requestPermission = function (callback) {
        console.warn('[BYEADS God-Level] Blocked deceptive web notification permission prompt');
        if (typeof callback === 'function') callback('denied');
        return Promise.resolve('denied');
      };
    }
  } catch {}

  // 6. Tab-Freeze & Scareware BeforeUnload Lock Defuser
  try {
    Object.defineProperty(window, 'onbeforeunload', {
      configurable: true,
      enumerable: true,
      get: () => null,
      set: () => {
        // Drop rogue beforeunload freeze attempts
        return true;
      }
    });

    const origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === 'beforeunload' && this === window) {
        // Intercept scareware freeze dialogs
        return;
      }
      return origAddEventListener.apply(this, arguments);
    };
  } catch {}

  // 7. Back-Button Hijack & History Flood Neutralizer
  try {
    let pushCount = 0;
    let lastPushTime = Date.now();
    const origPushState = history.pushState;

    history.pushState = function (...args) {
      const now = Date.now();
      if (now - lastPushTime < 1000) {
        pushCount++;
        if (pushCount > 3) {
          console.warn('[BYEADS God-Level] Throttled rapid history back-button hijack loop');
          return;
        }
      } else {
        pushCount = 0;
        lastPushTime = now;
      }
      return origPushState.apply(this, args);
    };
  } catch {}

  // 8. In-Browser Crypto-Mining Scriptlet Defusers
  try {
    const noopMiner = {
      start: () => {},
      stop: () => {},
      isRunning: () => false,
      getHashesPerSecond: () => 0,
      getTotalHashes: () => 0,
      on: () => {}
    };
    window.CoinHive = { Anonymous: () => noopMiner, User: () => noopMiner, Token: () => noopMiner };
    window.CoinImp = noopMiner;
    window.CryptoLoot = noopMiner;
    window.WebMinePool = noopMiner;
  } catch {}
})();

