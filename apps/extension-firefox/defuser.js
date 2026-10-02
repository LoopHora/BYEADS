// ===== BYEADS DEFUSER & SCRIPTLET ENGINE =====
// Runs in document MAIN context before page scripts execute.
// Neutralizes YouTube player ad feeds, anti-adblock detection, and modal blockers.

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

  // 3. Popunder & Unsolicited Window Trap Killer
  try {
    const originalWindowOpen = window.open;
    let lastUserClickTime = 0;
    window.addEventListener('click', () => {
      lastUserClickTime = Date.now();
    }, true);

    const POPUNDER_DOMAINS = [
      'popads', 'propeller', 'onclickads', 'adcash', 'popcash', 'adsterra',
      'affiliate', 'trafficjunky', 'exoclick', 'juicyads'
    ];

    window.open = function (url, target, features) {
      const urlStr = String(url || '').toLowerCase();
      const timeSinceClick = Date.now() - lastUserClickTime;

      const isPopunderPattern = POPUNDER_DOMAINS.some(d => urlStr.includes(d));
      const isUnsolicited = timeSinceClick > 1200;

      if (isPopunderPattern || (isUnsolicited && urlStr.startsWith('http'))) {
        console.warn('[BYEADS Defuser] Blocked popunder/unsolicited window open:', url);
        return {
          focus: () => {},
          blur: () => {},
          close: () => {},
          closed: true,
          document: {},
          location: { href: '' }
        };
      }

      return originalWindowOpen.apply(this, arguments);
    };
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
