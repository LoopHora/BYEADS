// ===== BYEADS WEB SHIELD & DECEPTION ENGINE =====
// Multi-layer in-page protection:
// 1. YouTube & YouTube Music stream ad neutralization
// 2. Universal cosmetic ad removal
// 3. Smart Cookie Banner Auto-Dismiss (GDPR/CCPA)
// 4. Visual Element Zapper & Custom Rules Engine
// 5. Deception Engine fake download button scanner

(function () {
  'use strict';

  const hostname = window.location.hostname.replace(/^www\./, '');
  let byeadsActive = true;
  let isWhitelisted = false;
  let zapperActive = false;
  let lastAdSkippedTime = 0;

  // 1. Check Whitelist & Global Status
  try {
    chrome.storage.local.get(['byeads_enabled', 'byeads_whitelist', 'byeads_custom_zaps'], (res) => {
      if (res.byeads_enabled === false) byeadsActive = false;
      const whitelist = res.byeads_whitelist || [];
      if (whitelist.includes(hostname)) {
        isWhitelisted = true;
        byeadsActive = false;
      }

      // Apply any custom zapped elements for this site
      const zaps = res.byeads_custom_zaps || {};
      const siteZaps = zaps[hostname] || [];
      if (siteZaps.length > 0) {
        applyCustomZaps(siteZaps);
      }
    });
  } catch {}

  function applyCustomZaps(selectors) {
    selectors.forEach((sel) => {
      try {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => el.remove());
      } catch {}
    });
  }

  // 2. Inject Universal, Streaming, Search Cleanser & App-Nag CSS Rules
  function injectCosmeticFilter() {
    if (!byeadsActive || isWhitelisted) return;
    if (document.getElementById('byeads-cosmetic-shield')) return;

    const style = document.createElement('style');
    style.id = 'byeads-cosmetic-shield';
    style.textContent = `
      /* Universal Web Ad Slots */
      ins.adsbygoogle,
      div[id^="google_ads_"],
      div[id^="div-gpt-ad"],
      div[class*="ad-slot"],
      div[class*="ad-banner"],
      div[class*="sponsored-post"],
      div[id*="taboola-"],
      div[class*="outbrain"],
      .ad-container,
      [data-ad-unit],
      [data-ad-slot],
      .ad-banner,
      .advertisement,
      #advertisement {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
        height: 0 !important;
      }

      /* YouTube & YouTube Music Specific Ad Removals & Anti-Adblock Defuser */
      ytd-ad-slot-renderer,
      ytd-banner-promo-renderer,
      ytd-in-feed-ad-layout-renderer,
      ytd-promoted-sparkles-web-renderer,
      ytd-statement-banner-renderer,
      #player-ads,
      .ytp-ad-overlay-container,
      .ytp-ad-overlay-slot,
      .ytp-ad-message-container,
      ytd-player-legacy-desktop-watch-ads-renderer,
      ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
      .ytd-merch-shelf-renderer,
      #masthead-ad,
      ytmusic-mealbar-promo-renderer,
      ytmusic-player-bar .advertisement,
      ytmusic-statement-banner-renderer,
      ytmusic-banner-promo-renderer,
      .ytmusic-ad-player-overlay-renderer,
      ytmusic-popup-container ytmusic-mealbar-promo-renderer,
      ytd-enforcement-message-view-model,
      tp-yt-paper-dialog:has(#feedback) {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
      }

      /* Search Engine Cleanser (Google, Bing, Yahoo Sponsored Links) */
      #tads,
      #tadsb,
      #bottomads,
      div[data-text-ad],
      .commercial-unit-desktop-top,
      .commercial-unit-desktop-rhs,
      div[aria-label="Ads"],
      div.uE20Vc,
      div.cu-container,
      #b_results .b_ad,
      li.b_ad,
      .b_adSlug,
      #b_adUnit,
      .results--ads,
      #results .ads {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
      }

      /* "Open in App" & Forced Login Nag-Wall Killer (Reddit, Twitter/X, Quora, Pinterest, Medium) */
      shreddit-async-loader[bundlename="bottom_sheet"],
      reddit-bottom-sheet,
      xpromo-nsfw-blocking-container,
      xpromo-app-selector,
      div[data-testid="bottom_sheet"],
      div[data-testid="login-bottom-sheet"],
      div[class*="AppPrompt"],
      div[data-testid="sheetDialog"],
      div[data-testid="BottomBar"],
      .signup_wall,
      .BaseSignupForm,
      .signup_modal,
      div[data-test-id="full-page-signup"],
      div[data-test-id="gift-wrap"],
      #branch-banner-iframe,
      div[class*="branch-journey"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // 3. YouTube & YouTube Music Active Stream Interceptor & Ad Skipper
  function handleMediaStreamAds() {
    if (!byeadsActive || isWhitelisted) return;

    const isYouTube = hostname.includes('youtube.com');
    if (!isYouTube) return;

    // Detect active ad indicators across YouTube and YouTube Music
    const adPlayer = document.querySelector(
      '.ad-showing, .ad-interrupting, .video-ads, ytmusic-player-bar[is-ad], ytmusic-player-bar.advertisement, .ytp-ad-player-overlay'
    );

    const video = document.querySelector('video');

    if (adPlayer || (video && video.classList.contains('ad-showing'))) {
      if (video) {
        // Mute video so audio ad is inaudible
        if (!video.muted) {
          video.muted = true;
        }

        // Fast-forward through the ad in milliseconds
        video.playbackRate = 16.0;

        if (isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration;
        }
      }

      // Automatically trigger skip buttons immediately
      const skipButtons = document.querySelectorAll(
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id*="skip-button"], button.ytmusic-ad-player-overlay-renderer, ytmusic-mealbar-promo-renderer #dismiss-button'
      );

      skipButtons.forEach((btn) => {
        try {
          btn.click();
        } catch {}
      });

      // Record stats
      const now = Date.now();
      if (now - lastAdSkippedTime > 1500) {
        lastAdSkippedTime = now;
        try {
          chrome.runtime.sendMessage({
            type: 'MEDIA_AD_BLOCKED',
            site: hostname,
            count: 1
          });
        } catch {}
      }
    } else {
      // Restore normal playback rate once ad is passed
      if (video && video.playbackRate > 2.0) {
        video.playbackRate = 1.0;
        video.muted = false;
      }
    }

    // YouTube anti-adblock enforcement dialog killer
    try {
      const enforcement = document.querySelector('ytd-enforcement-message-view-model, tp-yt-paper-dialog[dialog-type="action"]');
      if (enforcement) {
        enforcement.remove();
        const backdrop = document.querySelector('tp-yt-iron-overlay-backdrop');
        if (backdrop) backdrop.remove();
        if (video && video.paused) {
          video.play().catch(() => {});
        }
      }
    } catch {}
  }

  // 4. Smart Cookie Banner Auto-Dismiss (GDPR/CCPA)
  function handleCookieBanners() {
    if (!byeadsActive || isWhitelisted) return;

    // Auto-click Reject / Decline buttons if present
    const rejectSelectors = [
      '#onetrust-reject-all-handler',
      '.osano-cm-denyAll',
      'button[id*="reject"]',
      'button[aria-label*="reject"]',
      'button[aria-label*="decline"]',
      '.didomi-dismiss-button',
      '#didomi-notice-agree-button',
      'button[class*="cookie-reject"]',
      'button[class*="cookie-decline"]'
    ];

    for (const sel of rejectSelectors) {
      try {
        const btn = document.querySelector(sel);
        if (btn && btn.offsetParent !== null) {
          btn.click();
          return;
        }
      } catch {}
    }

    // Hide lingering modal overlays and restore scroll
    const modalSelectors = [
      '#onetrust-banner-sdk',
      '.osano-cm-window',
      '.didomi-popup-container',
      '#CybotCookiebotDialog'
    ];

    modalSelectors.forEach((sel) => {
      try {
        const modal = document.querySelector(sel);
        if (modal) {
          modal.style.display = 'none';
          document.body.style.setProperty('overflow', 'auto', 'important');
        }
      } catch {}
    });
  }

  // 5. Deception Engine: Fake Button & Deceptive Link Scanner
  function scanForDeceptiveButtons() {
    if (!byeadsActive || isWhitelisted) return;

    const currentDomain = window.location.hostname.replace(/^www\./, '');
    const buttons = document.querySelectorAll('a, button, [role="button"]');

    buttons.forEach((el) => {
      const text = (el.innerText || el.textContent || '').trim().toLowerCase();
      const href = el.getAttribute('href');

      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const isDownloadClaim = text.includes('download now') || text.includes('start download') || text.includes('direct download');

      if (isDownloadClaim) {
        try {
          const targetUrl = new URL(href, window.location.href);
          const targetDomain = targetUrl.hostname.replace(/^www\./, '');

          const isSuspiciousRedirect = targetDomain.includes('adnxs') ||
            targetDomain.includes('popads') ||
            targetDomain.includes('onclick') ||
            targetDomain.includes('propeller') ||
            targetDomain.includes('adcash') ||
            (targetDomain !== currentDomain && !targetDomain.endsWith(`.${currentDomain}`));

          if (isSuspiciousRedirect) {
            el.style.outline = '2px dashed #f59e0b';
            el.style.position = 'relative';
            el.setAttribute('title', '[BYEADS Warning]: Suspicious external destination. May be deceptive.');

            chrome.runtime.sendMessage({
              type: 'DECEPTION_DETECTED',
              targetDomain,
              claimedText: text
            });
          }
        } catch {}
      }
    });
  }

  // 6. Visual Element Zapper Controller
  function initElementZapper() {
    if (zapperActive) return;
    zapperActive = true;

    let hoveredEl = null;

    const overlay = document.createElement('div');
    overlay.id = 'byeads-zapper-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999999;
      background: #0d1117;
      color: #f0f6fc;
      border: 1px solid #f97316;
      border-radius: 8px;
      padding: 10px 16px;
      font-family: sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    overlay.innerHTML = `
      <span style="color: #f97316; font-weight: bold;">[BYEADS Zapper]</span>
      <span>Click any element to permanently zap it. Press Esc to cancel.</span>
    `;
    document.body.appendChild(overlay);

    function onMouseMove(e) {
      if (!zapperActive) return;
      if (e.target === overlay || overlay.contains(e.target)) return;

      if (hoveredEl && hoveredEl !== e.target) {
        hoveredEl.style.outline = '';
      }
      hoveredEl = e.target;
      hoveredEl.style.outline = '3px dashed #ef4444';
      hoveredEl.style.cursor = 'crosshair';
    }

    function onClick(e) {
      if (!zapperActive) return;
      if (e.target === overlay || overlay.contains(e.target)) return;

      e.preventDefault();
      e.stopPropagation();

      const el = e.target;
      const selector = generateSelector(el);
      el.remove();

      // Persist custom zap selector
      chrome.storage.local.get(['byeads_custom_zaps'], (res) => {
        const zaps = res.byeads_custom_zaps || {};
        if (!zaps[hostname]) zaps[hostname] = [];
        if (!zaps[hostname].includes(selector)) {
          zaps[hostname].push(selector);
        }
        chrome.storage.local.set({ byeads_custom_zaps: zaps });
      });

      cleanup();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') cleanup();
    }

    function cleanup() {
      zapperActive = false;
      if (hoveredEl) hoveredEl.style.outline = '';
      overlay.remove();
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
    }

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
  }

  function generateSelector(el) {
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === 'string') {
      const cls = el.className.trim().split(/\s+/)[0];
      if (cls && !cls.includes(':')) return `${el.tagName.toLowerCase()}.${cls}`;
    }
    return el.tagName.toLowerCase();
  }

  // 7. Invisible Clickjack & Popunder Trap Killer
  let lastClickjackAlertTime = 0;
  function killInvisibleClickjacks() {
    if (!byeadsActive || isWhitelisted) return;

    const elements = document.querySelectorAll('div, a, span, section');
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    elements.forEach((el) => {
      if (el === document.body || el === document.documentElement) return;
      if (el.id === 'byeads-zapper-overlay' || el.closest('#byeads-zapper-overlay')) return;

      try {
        const style = window.getComputedStyle(el);
        const pos = style.position;
        if (pos !== 'fixed' && pos !== 'absolute') return;

        const zIndex = parseInt(style.zIndex, 10);
        if (isNaN(zIndex) || zIndex < 400) return;

        const rect = el.getBoundingClientRect();
        if (rect.width >= vw * 0.65 && rect.height >= vh * 0.65) {
          const opacity = parseFloat(style.opacity);
          const bg = style.backgroundColor;
          const isTransparentBg = bg === 'transparent' || bg.includes('rgba(0, 0, 0, 0)') || bg === 'rgba(0,0,0,0)';
          const isTransparent = opacity <= 0.1 || isTransparentBg;

          const hasVisibleControls = el.querySelectorAll('input, form, button, h1, h2, h3, p, video').length > 0;
          const textLength = (el.innerText || '').trim().length;

          if ((isTransparent && textLength < 10 && !hasVisibleControls) || (opacity === 0)) {
            el.remove();

            const now = Date.now();
            if (now - lastClickjackAlertTime > 2000) {
              lastClickjackAlertTime = now;
              try {
                chrome.runtime.sendMessage({
                  type: 'CLICKJACK_NEUTRALIZED',
                  domain: hostname
                });
              } catch {}
            }
          }
        }
      } catch {}
    });
  }

  // 8. Smart Auto-Healer (Fix This Page)
  function handleFixThisPage() {
    const style = document.getElementById('byeads-cosmetic-shield');
    if (style) style.remove();

    if (document.body) {
      document.body.style.setProperty('overflow', 'auto', 'important');
      document.body.style.setProperty('pointer-events', 'auto', 'important');
    }
    if (document.documentElement) {
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
    }

    const forms = document.querySelectorAll('form, iframe[src*="stripe"], iframe[src*="paypal"], iframe[src*="checkout"]');
    forms.forEach((f) => {
      f.style.setProperty('display', 'block', 'important');
      f.style.setProperty('visibility', 'visible', 'important');
      f.style.setProperty('opacity', '1', 'important');
    });
  }

  // 9. Message Dispatcher
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'START_ZAPPER') {
      initElementZapper();
      sendResponse({ status: 'Zapper started' });
    } else if (msg.type === 'TOGGLE_WHITELIST') {
      isWhitelisted = msg.isWhitelisted;
      byeadsActive = !isWhitelisted;
      if (isWhitelisted) {
        const style = document.getElementById('byeads-cosmetic-shield');
        if (style) style.remove();
      } else {
        injectCosmeticFilter();
      }
      sendResponse({ success: true });
    } else if (msg.type === 'FIX_THIS_PAGE') {
      handleFixThisPage();
      sendResponse({ healed: true });
    }
  });

  // Run initializations
  injectCosmeticFilter();
  scanForDeceptiveButtons();
  killInvisibleClickjacks();
  setTimeout(handleCookieBanners, 800);

  // Fast loop for media streaming & clickjacks
  setInterval(handleMediaStreamAds, 250);
  setInterval(killInvisibleClickjacks, 1000);

  // Dynamic mutation observer
  const observer = new MutationObserver(() => {
    handleMediaStreamAds();
    scanForDeceptiveButtons();
    handleCookieBanners();
    killInvisibleClickjacks();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
