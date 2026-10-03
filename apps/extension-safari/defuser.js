// ===== BYEADS DEFUSER & SCRIPTLET ENGINE =====
// Runs in document MAIN context before page scripts execute.
// Neutralizes YouTube player ad feeds, anti-adblock detection, popups, and click-redirection traps.

(function () {
  'use strict';

  const POPUP_AD_PATTERNS = [
    'popads', 'popcash', 'propeller', 'adsterra', 'exoclick', 'monetag', 'hilltopads',
    'adcash', 'onclickads', 'trafficjunky', 'juicyads', 'exdynsrv', 'exosrv', 'realsrv',
    'rtmark', 'doublepimp', 'traffichaus', 'clickadu', 'yllix', 'bidvertiser', 'admaven',
    'ad-maven', 'deloton', 'tsyndicate', 'zeroredirect', 'alwingulla', 'onclickperformance',
    'popunder', 'trafficstars', 'plugrush', 'popmyads', 'directrev', 'adnetworkperformance',
    'clck.ru', 'adnxs', 'criteo', 'taboola', 'outbrain', 'mgid', 'revcontent', 'doubleclick',
    'googlesyndication', 'adservice.google', 'googleadservices', 'smartadserver', 'rubiconproject',
    'pubmatic', 'openx', 'casalemedia', 'bet365', '1xbet', 'vulkan', 'parimatch', 'spinanga',
    'onclick', 'click_id=', 'camp_id=', 'aff_id=', 'direct-link', 'redirect-jump', 'adkeeper',
    'adserver', 'infolinks', 'yieldlove', 'zergnet', 'adtarget', 'adscale',
    'trafficmovers', 'propellerclick', 'terraclicks', 'linkbucks', 'adf.ly', 'ouo.io',
    'shorte.st', 'bc.vc', 'shrinkearn', 'clk.sh', 'gplinks', 'droplink',
    'twitch.tv/api/ads', 'amazon-adsystem', 'facebook.com/ads', 'twitter.com/i/ads',
    'soundcloud.com/ads', 'ads.tiktok.com', 'ads.spotify.com', 'a-ads', 'richpush',
    'adtrue', 'pushground', 'coinhive', 'coinimp', 'trafficjunky', 'clickaine',
    'adkernel', 'adreactor', 'adfox', 'adriver', 'aniview', 'vdo.ai', 'connatix',
    'playwire', 'brid.tv', 'primis', 'teads', 'clicksor', 'adcombo', 'propellerads',
    'trackvoluum', 'voluumtrk', 'redtrack', 'bemob', 'redirector', 'redirect-link',
    'clickid=', 'aff_c=', 'bonus-spin', 'free-spins', 'roulette', 'betway', 'stake.com'
  ];

  const TRUSTED_AUTH_GATEWAYS = [
    'accounts.google.com', 'appleid.apple.com', 'github.com', 'login.microsoftonline.com',
    'facebook.com', 'twitter.com', 'x.com', 'paypal.com', 'stripe.com', 'discord.com',
    'checkout.stripe.com', 'pay.google.com', 'auth0.com', 'amazon.com', 'steamcommunity.com'
  ];

  const REDIRECT_PATHS = [
    '/jump', '/go/', '/out/', '/redirect', '/click', '/link/', '/gate/',
    '/pop', '/ad/', '/banner/', '/count/', '/track', '/sponsor', '/load.php',
    '/direct.php', '/ad.php', '/pop.php', '/click.php', '/gate.php', '/jump.php',
    '/out.php', '/go.php'
  ];

  const REDIRECT_PARAMS = [
    'redirect=', 'url=', 'target=', 'dest=', 'goto=', 'link=', 'zoneid=',
    'pop=', 'campaign=', 'clickid=', 'aff_id=', 'aff_sub=', 'subid=',
    'token_hash=', 'pub_id='
  ];

  function isAdPattern(str) {
    if (!str) return false;
    const lower = String(str).toLowerCase();
    return POPUP_AD_PATTERNS.some(p => lower.includes(p));
  }

  function isTrustedAuth(hostname) {
    if (!hostname) return false;
    const h = hostname.toLowerCase().replace(/^www\./, '');
    return TRUSTED_AUTH_GATEWAYS.some(t => h === t || h.endsWith('.' + t));
  }

  function isAdOrPopup(urlStr) {
    if (!urlStr) return false;
    const s = String(urlStr).trim().toLowerCase();
    if (s === '' || s === 'about:blank' || s === 'javascript:void(0)' || s.startsWith('data:text/html') || s.startsWith('blob:')) {
      return true; // blank or synthetic popunder staging
    }
    if (isAdPattern(s)) return true;

    try {
      const parsed = new URL(urlStr, window.location.href);
      const currentHost = window.location.hostname.replace(/^www\./, '');
      const destHost = parsed.hostname.replace(/^www\./, '');
      const isSameDomain = destHost === currentHost || destHost.endsWith('.' + currentHost) || currentHost.endsWith('.' + destHost);

      const p = parsed.pathname.toLowerCase();
      const q = parsed.search.toLowerCase();
      if (REDIRECT_PATHS.some(part => p.includes(part)) || REDIRECT_PARAMS.some(param => q.includes(param))) {
        return true;
      }

      // If cross-origin: allow ONLY recognized OAuth or checkout providers
      if (!isSameDomain && !isTrustedAuth(destHost)) {
        return true;
      }
    } catch {
      return true; // Malformed URL
    }

    return false;
  }

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

  // Hook window.fetch for dynamic player calls & adware dynamic fetches
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';

      // Block YouTube ad telemetry endpoints directly at the JS API boundary
      if (
        url.includes('/api/stats/ads') ||
        url.includes('/pagead/') ||
        url.includes('/ptracking') ||
        url.includes('/get_midroll_info') ||
        isAdPattern(url) // God-Level Block: prevent dynamic popups/adware from fetching payloads
      ) {
        console.warn('[BYEADS Defuser] Blocked dynamic ad/telemetry fetch payload:', url);
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      }

      // Block pure ad telemetry trackers & ad audio asset CDNs (NEVER block audio-fa.scdn.co or legit streams)
      if (
        url.includes('adeventtracker.spotify.com') ||
        url.includes('ads-fa.spotify.com') ||
        url.includes('adstudio-assets.scdn.co') ||
        url.includes('adstudio-assets.spotifycdn.com') ||
        url.includes('/mp3-ad/')
      ) {
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      }

      // Neutralize Spotify ad-logic and desktop-omni-ads by returning clean empty roster (prevents ad queuing)
      if (
        url.includes('spclient.wg.spotify.com/ad-logic') ||
        url.includes('spclient.wg.spotify.com/desktop-omni-ads') ||
        url.includes('spclient.wg.spotify.com/ad-experiences')
      ) {
        return new Response(JSON.stringify({ ads: [], breaks: [], payload: {}, mappings: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
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
          u.includes('adeventtracker.spotify.com') ||
          u.includes('ads-fa.spotify.com') ||
          u.includes('adstudio-assets.scdn.co') ||
          u.includes('adstudio-assets.spotifycdn.com') ||
          u.includes('/mp3-ad/') ||
          u.includes('spclient.wg.spotify.com/ad-logic') ||
          u.includes('spclient.wg.spotify.com/desktop-omni-ads') ||
          u.includes('spclient.wg.spotify.com/ad-experiences') ||
          isAdPattern(u) // God-Level Block: XHR ad patterns
        ) {
          console.warn('[BYEADS Defuser] Blocked background XHR ad request:', u);
          const emptyBody = u.includes('spotify') ? '{"ads":[],"breaks":[],"payload":{}}' : '{}';
          Object.defineProperty(this, 'status', { value: 200, writable: false });
          Object.defineProperty(this, 'responseText', { value: emptyBody, writable: false });
          Object.defineProperty(this, 'response', { value: emptyBody, writable: false });
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

  // Defuse spam notification prompts (blocks fake robot verifications / browser push popups)
  try {
    if (window.Notification && typeof window.Notification.requestPermission === 'function') {
      window.Notification.requestPermission = () => Promise.resolve('denied');
    }
  } catch {}

  // A. Hook window.open & Window.prototype.open (God-Level Popup & Popunder Defuser)
  try {
    const originalWindowOpen = window.open;

    function safeWindowOpen(url, target, features) {
      const urlStr = String(url || '').trim();

      if (isAdOrPopup(urlStr)) {
        console.warn('[BYEADS Defuser] Neutralized popup window.open attempt to:', urlStr);
        return createDummyWindow();
      }

      return originalWindowOpen.apply(this, arguments);
    }

    try {
      Object.defineProperty(window, 'open', {
        value: safeWindowOpen,
        writable: false,
        configurable: false
      });
    } catch {
      window.open = safeWindowOpen;
    }

    try {
      Object.defineProperty(Window.prototype, 'open', {
        value: safeWindowOpen,
        writable: false,
        configurable: false
      });
    } catch {
      Window.prototype.open = safeWindowOpen;
    }

    if (typeof window.openDialog === 'function') {
      window.openDialog = safeWindowOpen;
    }
    if (typeof window.showModalDialog === 'function') {
      window.showModalDialog = safeWindowOpen;
    }

    // Dynamic iframe hook: prevent ad scripts from accessing unhooked contentWindow.open
    const origContentWindowDesc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
    if (origContentWindowDesc && origContentWindowDesc.get) {
      Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
        get: function () {
          const cw = origContentWindowDesc.get.call(this);
          if (cw) {
            try {
              if (cw.open !== safeWindowOpen) {
                cw.open = safeWindowOpen;
              }
            } catch {}
          }
          return cw;
        },
        configurable: true
      });
    }
  } catch {}

  // B. Hook HTMLAnchorElement.prototype.click & dispatchEvent (blocks synthetic <a> ad clicks)
  try {
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      const href = String(this.href || '').trim();
      if (isAdOrPopup(href) || (!this.isConnected && href) || (this.target === '_blank' && isAdOrPopup(href))) {
        console.warn('[BYEADS Defuser] Blocked synthetic anchor click ad redirect:', href);
        return;
      }
      return originalAnchorClick.apply(this, arguments);
    };

    const origDispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
      if (event && (event.type === 'click' || event.type === 'mousedown' || event.type === 'pointerdown' || event.type === 'mouseup')) {
        const anchor = (this instanceof HTMLAnchorElement) ? this : (this.closest && this.closest('a'));
        if (anchor && isAdOrPopup(anchor.href)) {
          console.warn('[BYEADS Defuser] Blocked synthetic dispatchEvent ad popup:', anchor.href);
          return false;
        }
      }
      return origDispatchEvent.apply(this, arguments);
    };
  } catch {}

  // C. Hook HTMLFormElement.prototype.submit (blocks hidden form popup submits)
  try {
    const originalFormSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      const action = String(this.action || '').trim();
      if ((this.target === '_blank' || this.style.display === 'none') && isAdOrPopup(action)) {
        console.warn('[BYEADS Defuser] Blocked synthetic form submit ad popup:', action);
        return;
      }
      return originalFormSubmit.apply(this, arguments);
    };
  } catch {}

  // D. Hook EventTarget.prototype.addEventListener (suppress adware click/popunder hijacking)
  try {
    const origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === 'click' || type === 'mousedown' || type === 'pointerdown' || type === 'mouseup' || type === 'pointerup') {
        if (typeof listener === 'function') {
          const fnStr = listener.toString();
          if (
            fnStr.includes('popunder') ||
            fnStr.includes('popads') ||
            fnStr.includes('onclickads') ||
            fnStr.includes('exoclick') ||
            fnStr.includes('adcash') ||
            fnStr.includes('propeller') ||
            fnStr.includes('adsterra') ||
            fnStr.includes('hilltop') ||
            fnStr.includes('monetag') ||
            fnStr.includes('clickadu') ||
            fnStr.includes('admaven')
          ) {
            console.warn('[BYEADS Defuser] Suppressed adware click/mousedown listener registration');
            return;
          }
        }
      }
      return origAddEventListener.apply(this, arguments);
    };
  } catch {}

  // E. Capturing Click Listener: Trap Transparent Overlays & Ad Links
  try {
    window.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;

      // 1. Transparent / fixed clickjack overlay detection (sensitive to player and button traps)
      if (target.tagName !== 'VIDEO' && target.tagName !== 'AUDIO' && target.tagName !== 'MAIN' && target.tagName !== 'BODY' && target.tagName !== 'HTML') {
        const cs = window.getComputedStyle(target);
        const isFixedOrAbs = cs.position === 'fixed' || cs.position === 'absolute';
        const opacity = parseFloat(cs.opacity);
        const bg = cs.backgroundColor || '';
        const isTransparentBg = bg === 'transparent' || bg.includes('rgba(0, 0, 0, 0)') || bg === 'rgba(0,0,0,0)' || bg.includes('rgba(255, 255, 255, 0)');
        const isTransparent = opacity <= 0.1 || isTransparentBg;
        const zIndex = parseInt(cs.zIndex, 10);
        const hasHighZ = !isNaN(zIndex) && zIndex >= 10;
        const textLen = (target.innerText || '').trim().length;
        const hasVisibleControls = target.querySelectorAll('input, button, select, textarea').length > 0;
        const rect = target.getBoundingClientRect();

        if (isFixedOrAbs && isTransparent && textLen < 15 && !hasVisibleControls && (hasHighZ || (rect.width >= 120 && rect.height >= 80))) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          target.remove();
          console.warn('[BYEADS Defuser] Neutralized and removed clickjack trap overlay');
          return false;
        }
      }

      // 2. Intercept clicks on links pointing to ad networks or untrusted external popup tabs
      const anchor = target.closest('a');
      if (anchor) {
        const href = String(anchor.href || '').trim();
        if (isAdOrPopup(href)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          anchor.remove();
          console.warn('[BYEADS Defuser] Neutralized click on ad link:', href);
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

  // 9. Spotify Web Player Audio Stream Ad Neutralizer (Main World Hook)
  try {
    if (window.location.hostname.includes('spotify.com')) {
      const origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (this.tagName === 'AUDIO') {
          const docTitle = (document.title || '').toLowerCase();
          const isAd = docTitle.includes('advertisement') ||
                       !!document.querySelector(
                         '[data-testid="track-info-advertiser"], ' +
                         '[data-testid="context-item-info-ad-title"], ' +
                         '[data-testid="context-item-info-ad-subtitle"], ' +
                         '[data-testid="ad-companion-card"], ' +
                         'a[data-context-item-type="ad"], ' +
                         'footer[data-testid*="ad-type-ad"], ' +
                         'footer[data-testadtype*="ad-type-ad"], ' +
                         '[aria-label="Advertisement"], ' +
                         '[data-testid="ad-break"]'
                       );
          if (isAd) {
            this.muted = true;
            this.volume = 0;
          }
          // NEVER unmute in play() - unmuting is safely handled by the debounced real-track verifier in content.js
        }
        return origPlay.apply(this, arguments);
      };
    }
  } catch {}
})();
