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
    'click_id=', 'camp_id=', 'aff_id=', 'direct-link', 'redirect-jump', 'adkeeper',
    'adserver', 'infolinks', 'yieldlove', 'zergnet', 'adtarget', 'adscale',
    'trafficmovers', 'propellerclick', 'terraclicks', 'linkbucks', 'adf.ly', 'ouo.io',
    'shorte.st', 'bc.vc', 'shrinkearn', 'clk.sh', 'gplinks', 'droplink',
    'twitch.tv/api/ads', 'amazon-adsystem', 'facebook.com/ads', 'twitter.com/i/ads',
    'soundcloud.com/ads', 'ads.tiktok.com', 'ads.spotify.com', 'a-ads', 'richpush',
    'adtrue', 'pushground', 'coinhive', 'coinimp', 'trafficjunky', 'clickaine',
    'adkernel', 'adreactor', 'adfox', 'adriver', 'aniview', 'vdo.ai', 'connatix',
    'playwire', 'brid.tv', 'primis', 'teads', 'clicksor', 'adcombo', 'propellerads',
    'trackvoluum', 'voluumtrk', 'redtrack', 'bemob', 'redirector', 'redirect-link',
    'clickid=', 'aff_c=', 'bonus-spin', 'free-spins', 'roulette', 'betway', 'stake.com',
    'hiibel', 'gpcasla', 'applejr.xyz', 'open-download', 'histats', 'puclc', 'purs?',
    'transplayer', 'transplink', 'antiadblockcore', 'compiledonatevanity', 'adition',
    'kameleoon', '3lift', 'adpushup', 'npttech', 'trafficfactory', 'sovrn', 'lijit'
  ];

  const TRUSTED_AUTH_GATEWAYS = [
    'accounts.google.com', 'appleid.apple.com', 'github.com', 'login.microsoftonline.com',
    'facebook.com', 'twitter.com', 'x.com', 'paypal.com', 'stripe.com', 'discord.com',
    'checkout.stripe.com', 'pay.google.com', 'auth0.com', 'amazon.com', 'steamcommunity.com',
    'linkedin.com', 'yahoo.com', 'reddit.com', 't.me', 'whatsapp.com', 'wa.me', 'pinterest.com'
  ];

  const SAFE_DOWNLOAD_EXTENSIONS = [
    '.zip', '.tar', '.gz', '.tgz', '.bz2', '.7z', '.rar',
    '.exe', '.msi', '.pkg', '.dmg', '.deb', '.rpm', '.apk', '.ipa',
    '.mobileconfig', '.bat', '.cmd', '.ps1', '.sh',
    '.pdf', '.txt', '.csv', '.json', '.xml', '.bin', '.iso', '.torrent',
    '.mp3', '.mp4', '.wav', '.flac', '.epub'
  ];

  const TRUSTED_DOWNLOAD_DOMAINS = [
    'github.com', 'raw.githubusercontent.com', 'objects.githubusercontent.com',
    'github-production-release-asset-2e65be.s3.amazonaws.com',
    'github-releases.githubusercontent.com',
    'gitlab.com', 'sourceforge.net', 'archive.org',
    'dns.byeads.net', 'byeads.net', 'localhost'
  ];

  const REDIRECT_PATHS = [
    '/jump', '/go/', '/out/', '/redirect', '/click', '/link/', '/gate/',
    '/pop', '/ad/', '/banner/', '/count/', '/track', '/sponsor', '/load.php',
    '/direct.php', '/ad.php', '/pop.php', '/click.php', '/gate.php', '/jump.php',
    '/out.php', '/go.php', '/pixel/puclc', '/purs', '/open-download', '/dnn2hkn8'
  ];

  const REDIRECT_PARAMS = [
    'zoneid=', 'pop=', 'clickid=', 'aff_id=', 'aff_sub=', 'subid=',
    'token_hash=', 'pub_id=', 'tmpl=', 'plk=', 'puclc', 'purs', 'psid=', 'flb=', 'ibid=', 'bv='
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

  function isSocialShare(hostname, pathname) {
    if (!hostname) return false;
    const h = hostname.toLowerCase().replace(/^www\./, '');
    const p = (pathname || '').toLowerCase();
    if (h.includes('twitter.com') || h.includes('x.com')) return p.includes('/intent') || p.includes('/share');
    if (h.includes('facebook.com')) return p.includes('/sharer');
    if (h.includes('linkedin.com')) return p.includes('/sharing') || p.includes('/share');
    if (h.includes('reddit.com')) return p.includes('/submit');
    if (h.includes('whatsapp.com') || h === 'wa.me') return true;
    if (h.includes('telegram.org') || h === 't.me') return p.includes('/share');
    if (h.includes('pinterest.com')) return p.includes('/pin');
    return false;
  }

  function isSafeDownload(urlStr, el) {
    if (!urlStr) return false;
    const s = String(urlStr).toLowerCase();
    if (s.startsWith('blob:')) return true;
    if (SAFE_DOWNLOAD_EXTENSIONS.some(ext => s.includes(ext))) return true;
    if (TRUSTED_DOWNLOAD_DOMAINS.some(d => s.includes(d))) return true;
    if (el) {
      if (el.hasAttribute && (el.hasAttribute('download') || el.download)) return true;
      const text = (el.innerText || el.textContent || '').trim().toLowerCase();
      if (/download|install|setup|get\s|save|update/i.test(text)) return true;
      const cls = (el.className || '') + ' ' + (el.id || '');
      if (/download|btn|button/i.test(cls)) return true;
    }
    return false;
  }

  function isAdOrPopup(urlStr, el) {
    if (isSafeDownload(urlStr, el)) return false;

    const currentHost = window.location.hostname.replace(/^www\./, '').toLowerCase();

    // YouTube, Spotify, and trusted platforms never have popunder ads — immune
    if (
      currentHost.includes('youtube.com') ||
      currentHost.includes('googlevideo.com') ||
      currentHost.includes('spotify.com') ||
      currentHost.includes('google.')
    ) {
      return false;
    }

    const s = String(urlStr || '').trim().toLowerCase();

    // In-page triggers, hashes, or empty anchors are NEVER ad popups
    if (s === '' || s === '#' || s.startsWith('javascript:')) {
      return false;
    }

    // Only actual blank popunder staging windows are ad popups
    if (s === 'about:blank' || s === 'about:blank#blocked' || s.startsWith('data:text/html')) {
      return true;
    }
    if (isAdPattern(s)) return true;

    try {
      const parsed = new URL(urlStr, window.location.href);
      const destHost = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const fullPath = (parsed.pathname + parsed.search).toLowerCase();

      // Same-origin internal navigation is NEVER an ad popup
      const isSameDomain = destHost === currentHost || destHost.endsWith('.' + currentHost) || currentHost.endsWith('.' + destHost);
      if (isSameDomain) {
        return false;
      }

      // Check known ad patterns on destination hostname or path
      if (isAdPattern(destHost) || isAdPattern(fullPath)) return true;

      // Check ad redirect paths combined with ad tracking params
      if (REDIRECT_PATHS.some(part => parsed.pathname.toLowerCase().includes(part)) ||
          REDIRECT_PARAMS.some(param => parsed.search.toLowerCase().includes(param))) {
        return true;
      }

      // Check cross-origin navigation with suspicious ad/affiliate params
      if (!isTrustedAuth(destHost) && !isSafeDownload(urlStr, el)) {
        if (/[\?&](aff|aff_id|affid|clickid|click_id|zoneid|camp_id|subid|token_hash|pop=|adurl|dest_ad)=/i.test(parsed.search)) {
          return true;
        }
      }
    } catch {
      return false;
    }

    return false;
  }

  // 1. Spotify Web Player Audio Protection: Prevent crashes and speed-skip ads
  if (location.hostname.includes('spotify.com')) {
    try {
      const origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) {
        const src = this.src || this.currentSrc || '';
        if (src.includes('adstudio') || src.includes('mp3-ad') || src.includes('ads-fa')) {
          this.muted = true;
          this.playbackRate = 16.0;
        }
        return origPlay.apply(this, args);
      };

      // Intercept errors on media element so an ad error NEVER halts playback
      const origAddEventListener = HTMLMediaElement.prototype.addEventListener;
      HTMLMediaElement.prototype.addEventListener = function (type, listener, options) {
        if (type === 'error') {
          const wrappedListener = function (e) {
            const src = this.src || this.currentSrc || '';
            const docTitle = (document.title || '').toLowerCase();
            if (src.includes('adstudio') || src.includes('mp3-ad') || src.includes('ads-fa') || docTitle.includes('advertisement')) {
              console.warn('[BYEADS Defuser] Neutralized Spotify ad media error; skipping to next track');
              e.preventDefault?.();
              e.stopImmediatePropagation?.();
              this.dispatchEvent(new Event('ended'));
              return;
            }
            return listener.apply(this, arguments);
          };
          return origAddEventListener.call(this, type, wrappedListener, options);
        }
        return origAddEventListener.call(this, type, listener, options);
      };
    } catch {}
  }

  // Hook window.fetch for dynamic player calls & adware dynamic fetches
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';

      // On YouTube, ensure all player, SABr chunks, and video streams pass completely untouched
      if (location.hostname.includes('youtube.com') || location.hostname.includes('googlevideo.com')) {
        if (url.includes('/api/stats/ads') || url.includes('/pagead/')) {
          return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
        }
        return originalFetch.apply(this, args);
      }

      // Block pure ad telemetry trackers (NEVER block media streams or playback)
      if (
        url.includes('adeventtracker.spotify.com') ||
        url.includes('ads-fa.spotify.com') ||
        isAdPattern(url) // God-Level Block: prevent dynamic popups/adware from fetching payloads
      ) {
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      }

      return originalFetch.apply(this, args);
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

        // On YouTube, ensure all player and video chunks pass completely untouched
        if (location.hostname.includes('youtube.com') || location.hostname.includes('googlevideo.com')) {
          if (u.includes('/api/stats/ads') || u.includes('/pagead/')) {
            const emptyBody = '{}';
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
          return origXHRSend.apply(this, args);
        }

        if (
          u.includes('adeventtracker.spotify.com') ||
          u.includes('ads-fa.spotify.com') ||
          isAdPattern(u) // God-Level Block: XHR ad patterns
        ) {
          const emptyBody = '{}';
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

  // 2. Anti-Adblock Defuser & Bait Object Emulation (Kills AntiAdBlock Core, BlockAdBlock, FuckAdBlock, Hustle)
  try {
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.adblock = false;
    window.hasAdBlocker = false;
    window.google_ad_client = "ca-pub-0000000000000000";

    const noopFn = function () { return this; };
    const noopClass = function () {
      this.setOption = noopFn;
      this.check = noopFn;
      this.clearEvent = noopFn;
      this.on = function (detected, fn) {
        if (!detected && typeof fn === 'function') setTimeout(fn, 1);
        return this;
      };
      this.onDetected = noopFn;
      this.onNotDetected = function (fn) {
        if (typeof fn === 'function') setTimeout(fn, 1);
        return this;
      };
    };

    window.FuckAdBlock = noopClass;
    window.fuckAdBlock = new noopClass();
    window.BlockAdBlock = noopClass;
    window.blockAdBlock = window.fuckAdBlock;
    window.SnackAdBlock = noopClass;
    window.snackAdBlock = window.fuckAdBlock;

    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
      window.adsbygoogle.push = function () { return 1; };
      window.adsbygoogle.loaded = true;
    }

    if (!window.Adblock) {
      window.Adblock = {
        isDetected: function () { return false; },
        active: false
      };
    }

    // A. Bait Element getComputedStyle Proxy: Ensures anti-adblock bait probes always report 'display: block'
    const origGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function (elt, pseudoElt) {
      const cs = origGetComputedStyle.apply(this, arguments);
      if (elt && (elt instanceof Element)) {
        const cls = String(elt.className || '');
        const id = String(elt.id || '');
        if (
          /adsbox|ad-banner|ad-unit|adsbygoogle|banner-ad|sponsored-ad/i.test(cls) ||
          /google_ads_|adblock-bait/i.test(id)
        ) {
          const styleAttr = elt.getAttribute('style') || '';
          const isOffscreen = styleAttr.includes('-9999') || styleAttr.includes('-10000') ||
            (elt.style && (parseInt(elt.style.left, 10) <= -1000 || parseInt(elt.style.top, 10) <= -1000));
          if (isOffscreen) {
            return new Proxy(cs, {
              get(target, prop) {
                if (prop === 'display') return 'block';
                if (prop === 'visibility') return 'visible';
                if (prop === 'opacity') return '1';
                if (prop === 'width') return '12px';
                if (prop === 'height') return '12px';
                const val = target[prop];
                return typeof val === 'function' ? val.bind(target) : val;
              }
            });
          }
        }
      }
      return cs;
    };

    // B. Defuse Preload Network Probes (e.g. AntiAdBlock Core checking if adsbygoogle/gpt scripts load)
    const origAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (child) {
      if (child && child.tagName === 'LINK' && child.as === 'script') {
        const href = String(child.href || '');
        if (href.includes('googlesyndication.com') || href.includes('doubleclick.net') || href.includes('gpt.js')) {
          setTimeout(() => {
            if (typeof child.onload === 'function') child.onload();
            child.dispatchEvent(new Event('load'));
          }, 10);
        }
      }
      return origAppendChild.apply(this, arguments);
    };

    // C. Neutralize High z-index Root Shadow Hosts (AntiAdBlock Core closed shadow popups)
    const origAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function () {
      if (this.style && (this.style.zIndex === '2147483647' || parseInt(this.style.zIndex, 10) >= 2147483640)) {
        this.style.setProperty('display', 'none', 'important');
        this.style.setProperty('visibility', 'hidden', 'important');
        this.style.setProperty('pointer-events', 'none', 'important');
      }
      return origAttachShadow.apply(this, arguments);
    };
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
      closed: false, // Keep false so scripts don't execute their "popup-blocked" fallback to hijack current page
      opener: window,
      parent: window,
      top: window,
      frames: [],
      length: 0,
      postMessage: () => {},
      print: () => {},
      document: {
        write: () => {},
        writeln: () => {},
        open: () => {},
        close: () => {},
        createElement: () => document.createElement('div'),
        body: document.createElement('body'),
        head: document.createElement('head')
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
      const curHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
      if (curHost.includes('youtube.com') || curHost.includes('googlevideo.com') || curHost.includes('spotify.com')) {
        return originalWindowOpen.apply(this, arguments);
      }

      const urlStr = String(url || '').trim();

      // Intercept if URL matches ad patterns, blank popunder staging, or untrusted cross-origin
      if (isAdOrPopup(urlStr)) {
        console.warn('[BYEADS Defuser] Neutralized popup window.open attempt to:', urlStr || '(blank popunder)');
        return createDummyWindow();
      }

      if (urlStr) {
        try {
          const parsed = new URL(urlStr, window.location.href);
          const currentHost = window.location.hostname.replace(/^www\./, '');
          const destHost = parsed.hostname.replace(/^www\./, '');
          const isSameDomain = destHost === currentHost || destHost.endsWith('.' + currentHost) || currentHost.endsWith('.' + destHost);

          // Universal cross-origin popup shield:
          // A web page script has no reason to window.open an arbitrary third-party domain unless auth/share/download
          if (!isSameDomain && !isTrustedAuth(destHost) && !isSocialShare(destHost, parsed.pathname) && !isSafeDownload(urlStr)) {
            console.warn('[BYEADS Defuser] Neutralized cross-origin third-party window.open popup attempt to:', destHost);
            return createDummyWindow();
          }
        } catch {}
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
    const curHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
    const isCleanPlatform = curHost.includes('youtube.com') || curHost.includes('googlevideo.com') || curHost.includes('spotify.com');

    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (isCleanPlatform) {
        return originalAnchorClick.apply(this, arguments);
      }
      const href = String(this.href || '').trim();
      if (this.hasAttribute('download') || this.download || isSafeDownload(href, this)) {
        return originalAnchorClick.apply(this, arguments);
      }
      if (isAdOrPopup(href, this) || (this.target === '_blank' && isAdOrPopup(href, this))) {
        console.warn('[BYEADS Defuser] Blocked synthetic anchor click ad redirect:', href);
        return;
      }
      return originalAnchorClick.apply(this, arguments);
    };

    const origDispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
      if (isCleanPlatform) {
        return origDispatchEvent.apply(this, arguments);
      }
      if (event && (event.type === 'click' || event.type === 'mousedown' || event.type === 'pointerdown' || event.type === 'mouseup')) {
        const anchor = (this instanceof HTMLAnchorElement) ? this : (this.closest && this.closest('a'));
        if (anchor && !isSafeDownload(anchor.href, anchor) && isAdOrPopup(anchor.href, anchor)) {
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
      if ((this.target === '_blank' || this.style.display === 'none') && isAdOrPopup(action, this)) {
        console.warn('[BYEADS Defuser] Blocked synthetic form submit ad popup:', action);
        return;
      }
      return originalFormSubmit.apply(this, arguments);
    };
  } catch {}

  // D. Hook EventTarget.prototype.addEventListener (suppress adware click/popunder hijacking)
  try {
    const curHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
    const isCleanPlatform = curHost.includes('youtube.com') || curHost.includes('googlevideo.com') || curHost.includes('spotify.com');

    const origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (isCleanPlatform) {
        return origAddEventListener.apply(this, arguments);
      }
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
            fnStr.includes('admaven') ||
            fnStr.includes('gpcasla') ||
            fnStr.includes('hiibel') ||
            fnStr.includes('transplayer') ||
            fnStr.includes('transplink') ||
            fnStr.includes('puclc') ||
            fnStr.includes('purs')
          ) {
            console.warn('[BYEADS Defuser] Suppressed adware click/mousedown listener registration');
            return;
          }
        }
      }
      return origAddEventListener.apply(this, arguments);
    };
  } catch {}



  // E. Capturing Click Listener: Trap Transparent Overlays & Ad Links (Safe for UI & Downloads)
  try {
    window.addEventListener('click', (e) => {
      const curHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
      if (curHost.includes('youtube.com') || curHost.includes('googlevideo.com') || curHost.includes('spotify.com')) {
        return;
      }

      const target = e.target;
      if (!target) return;

      // SAFEGUARD 1: Legitimate UI controls, buttons, forms, and downloads are ALWAYS immune
      if (
        target.closest('button, input, select, textarea, label, [role="button"], [download], [class*="download"], [id*="download"], [class*="btn"], [id*="btn"]')
      ) {
        return;
      }

      // SAFEGUARD 2: Check anchors safely (NEVER call anchor.remove() which causes buttons to disappear)
      const anchor = target.closest('a');
      if (anchor) {
        if (isSafeDownload(anchor.href, anchor)) return;
        const href = String(anchor.href || '').trim();
        if (isAdOrPopup(href, anchor)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.warn('[BYEADS Defuser] Neutralized click on ad link:', href);
          return false;
        }
        return;
      }

      // 3. Transparent / fixed full-screen clickjack overlay detection (only true blank cover sheets)
      if (target.tagName !== 'VIDEO' && target.tagName !== 'AUDIO' && target.tagName !== 'MAIN' && target.tagName !== 'BODY' && target.tagName !== 'HTML') {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = target.getBoundingClientRect();
        const isMassiveCover = rect.width >= vw * 0.7 && rect.height >= vh * 0.7;

        if (isMassiveCover) {
          const cs = window.getComputedStyle(target);
          const isFixedOrAbs = cs.position === 'fixed' || cs.position === 'absolute';
          const opacity = parseFloat(cs.opacity);
          const bg = cs.backgroundColor || '';
          const isTransparentBg = bg === 'transparent' || bg.includes('rgba(0, 0, 0, 0)') || bg === 'rgba(0,0,0,0)' || bg.includes('rgba(255, 255, 255, 0)');
          const isTransparent = opacity <= 0.05 || isTransparentBg;
          const textLen = (target.innerText || target.textContent || '').trim().length;
          const hasInteractiveControls = target.querySelector('button, a, input, select, textarea, form, h1, h2, h3, p, video, audio, img');

          if (isFixedOrAbs && isTransparent && textLen === 0 && !hasInteractiveControls) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Disable interactions safely without breaking React DOM tree
            target.style.setProperty('pointer-events', 'none', 'important');
            target.style.setProperty('display', 'none', 'important');
            console.warn('[BYEADS Defuser] Neutralized clickjack trap overlay');
            return false;
          }
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
  // SAFETY RULES:
  //   - NEVER set volume=0 (triggers Spotify's own error recovery → crash)
  //   - NEVER throw errors from play() (breaks Spotify's promise chain → crash)
  //   - Only mute; let content.js handle unmuting when the real track starts
  try {
    if (window.location.hostname.includes('spotify.com')) {
      const origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        try {
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
              // Do NOT set volume=0 — it crashes Spotify's internal player state machine
            }
          }
        } catch {
          // Never let our ad-check break Spotify's play chain
        }
        return origPlay.apply(this, arguments);
      };
    }
  } catch {}
})();
