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
  let localTabBlockedCount = 0;
  let lastReportedCosmeticCount = 0;

  // Listen for defuser events from MAIN world
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'BYEADS_SPOTIFY_AD_DEFUSED') {
      localTabBlockedCount++;
      try {
        chrome.runtime.sendMessage({
          type: 'INCREMENT_TAB_STATS',
          site: 'spotify.com',
          category: 'spotify-ad',
          count: 1
        });
      } catch {}
    }
  });

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
      div[class*="branch-journey"],

      /* Spotify Web Player Ad Slots */
      div[data-testid="ad-banner"],
      div[data-testid="in-app-ad"],
      div[data-testid="desktop-client-sponsor-container"],
      div[aria-label="Sponsored"],

      /* TeraBox Ad & Forced App Download Guide Modals */
      div[class*="GuideModal"],
      div[class*="app-download-guide"],
      div[class*="download-tip"],
      div[class*="app-guide"],
      div[class*="privilege-box"],
      div[class*="claim-vip"],
      div[class*="popup-guide"],
      div[class*="ad-box"],
      div[class*="banner-ad"],
      div[class*="cloud-ad"],
      div[class*="client-guide-modal"],

      /* X / Twitter Promoted Ads & Premium Nagging */
      div[data-testid="cellInnerDiv"]:has([data-testid="placementTracking"]),
      aside[aria-label*="Subscribe to Premium"],
      aside[aria-label*="Who to follow"],
      div[data-testid="inline-upgrade-prompt"],

      /* Reddit Promoted Posts & App Selector Modals */
      shreddit-post[is-promoted="true"],
      .promotedlink,
      [data-adclickarea="media"],
      [data-adclickarea="top"],
      div[class*="promoted-post"],

      /* Twitch & SoundCloud Stream Overlays & Promos */
      .stream-display-ad__wrapper,
      .video-player__ad-overlay,
      div[data-test-selector="ad-banner-default-text"],
      div[class*="soundBadge__sponsored"],
      .streamAds,

      /* Popups, Popunders, Sticky Floaters & Overlay Wrappers */
      div[class*="popup-ad"],
      div[id*="popup-ad"],
      div[class*="popunder"],
      div[id*="popunder"],
      div[class*="floating-ad"],
      div[class*="sticky-ad"],
      div[id*="floating-ad"],
      div[class*="interstitial"],
      div[id*="interstitial"],
      iframe[src*="adsterra"],
      iframe[src*="monetag"],
      iframe[src*="popads"],
      iframe[src*="exoclick"],
      iframe[src*="doubleclick"],
      iframe[src*="googlesyndication"],
      iframe[src*="juicyads"],
      iframe[src*="trafficjunky"],
      iframe[src*="hilltopads"],
      iframe[src*="adcash"],
      div[style*="z-index: 2147483647"]:empty,
      a[href*="popads.net"],
      a[href*="propellerads.com"],
      a[href*="adsterra.com"],
      a[href*="exoclick.com"],
      a[href*="monetag.com"],
      a[href*="bet365.com"],
      a[href*="1xbet.com"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // 3. Media Stream Ad Neutralizer (YouTube, YouTube Music & Spotify)
  let wasMutedByAd = false;
  let lastSpotifyMuteTime = 0;

  function handleMediaStreamAds() {
    if (!byeadsActive || isWhitelisted) return;

    // --- A. YouTube & YouTube Music ---
    if (hostname.includes('youtube.com')) {
      const player = document.querySelector('#movie_player, .html5-video-player, ytd-player, ytmusic-player');
      const isPlayerAdShowing = !!(player && (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')));

      // Strict ad indicator check (NEVER match static .video-ads container)
      const isAdActive = isPlayerAdShowing ||
        !!document.querySelector('ytmusic-player-bar[is-ad="true"]') ||
        !!document.querySelector('.ytp-ad-player-overlay-instream');

      const video = document.querySelector('video');

      if (isAdActive) {
        if (video) {
          if (!video.muted) {
            video.muted = true;
            wasMutedByAd = true;
          }
          video.playbackRate = 16.0;

          // Only skip ahead if explicitly inside an active ad player class
          if (isPlayerAdShowing && isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration;
          }
        }

        // Trigger skip buttons immediately
        const skipButtons = document.querySelectorAll(
          '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-slot button, .videoAdUiSkipButton, [id*="skip-button"], button.ytmusic-ad-player-overlay-renderer, ytmusic-mealbar-promo-renderer #dismiss-button'
        );

        skipButtons.forEach((btn) => {
          try {
            btn.click();
          } catch {}
        });

        // Record stats (throttled)
        const now = Date.now();
        if (now - lastAdSkippedTime > 2000) {
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
        // Normal music/video playing: restore rate and volume immediately
        if (video) {
          if (video.playbackRate > 1.0) {
            video.playbackRate = 1.0;
          }
          // Fail-safe unmute: If ad is not active, ensure video is audible
          if (wasMutedByAd || (video.muted && !player?.classList?.contains('ytp-volume-slider-active'))) {
            video.muted = false;
            wasMutedByAd = false;
          }
          if (video.volume === 0 && !player?.classList?.contains('ytp-volume-slider-active')) {
            video.volume = 1.0;
          }
        }
        // Force YouTube / YouTube Music internal player API to unmute
        try {
          const ytPlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
          if (ytPlayer && typeof ytPlayer.unMute === 'function') {
            if (typeof ytPlayer.isMuted === 'function' && ytPlayer.isMuted()) {
              ytPlayer.unMute();
            }
          }
        } catch {}
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

    // --- B. Spotify Web Player (open.spotify.com) ---
    if (hostname.includes('spotify.com')) {
      // 1. A real song ALWAYS has a link to /track/ or /album/ in the now-playing bar
      const hasRealTrackLink = !!document.querySelector(
        '[data-testid="now-playing-widget"] a[href*="/track/"], [data-testid="now-playing-widget"] a[href*="/album/"]'
      );

      // 2. Identify advertisements ONLY when there is NO real track link present
      let isSpotifyAd = false;
      if (!hasRealTrackLink) {
        isSpotifyAd =
          document.title.toLowerCase().startsWith('advertisement') ||
          !!document.querySelector(
            '[data-testid="context-item-info-ad-title"], [data-testid="track-info-advertiser"], [aria-label="Advertisement"], a[href*="spotify:ad:"], [data-testid="ad-feedback-button"], [data-testid="ad-break"]'
          ) ||
          document.querySelector('[data-testid="now-playing-widget"] [data-testid="context-item-info-title"]')?.textContent?.trim().toLowerCase() === 'advertisement';
      }

      const audios = document.querySelectorAll('audio, video');

      if (isSpotifyAd) {
        // Mute audio during advertisement
        audios.forEach((audio) => {
          if (!audio.muted) {
            audio.muted = true;
            wasMutedByAd = true;
          }
          audio.volume = 0;
          try {
            audio.playbackRate = 16.0;
            // Advance to the end of the ad track so it completes quickly without skipping real tracks
            if (audio.duration && !isNaN(audio.duration) && audio.currentTime < audio.duration - 0.2) {
              audio.currentTime = audio.duration - 0.1;
            }
          } catch {}
        });

        // Purge visual billboard and modal overlays
        document.querySelectorAll(
          '[data-testid="billboard-ad"], [data-testid="leaderboard-ad"], [data-testid="top-bar-ad"], [data-testid="in-app-message-wrapper"], [data-testid="ad-break"], div[class*="GenericModal"]'
        ).forEach((el) => {
          try { el.remove(); } catch {}
        });

        const now = Date.now();
        if (now - lastSpotifyMuteTime > 2500) {
          lastSpotifyMuteTime = now;
          localTabBlockedCount++;
          try {
            chrome.runtime.sendMessage({
              type: 'INCREMENT_TAB_STATS',
              site: 'spotify.com',
              category: 'spotify-ad',
              count: 1
            });
          } catch {}
        }
      } else {
        // Real music playing: ALWAYS ensure audio is unmuted and audible
        audios.forEach((audio) => {
          if (audio.muted) {
            audio.muted = false;
          }
          if (audio.volume === 0) {
            audio.volume = 1.0;
          }
          if (audio.playbackRate > 1.0) {
            audio.playbackRate = 1.0;
          }
        });
        if (wasMutedByAd) {
          wasMutedByAd = false;
        }
      }
    }

    // --- C. Universal Web Audio & Video Safe Guard (SoundCloud, Twitch, Vimeo, Dailymotion, etc.) ---
    if (!hostname.includes('youtube.com') && !hostname.includes('spotify.com')) {
      const allMedia = document.querySelectorAll('video, audio');
      allMedia.forEach((m) => {
        if (m.playbackRate > 1.0 && !m.closest('[class*="ad"], [id*="ad"]')) {
          m.playbackRate = 1.0;
        }
      });
    }
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

  // 5. Specialized TeraBox & Cloud Storage Protection
  function handleTeraBoxProtections() {
    if (!byeadsActive || isWhitelisted) return;
    const isTeraBoxDomain =
      hostname.includes('terabox') ||
      hostname.includes('1024tera') ||
      hostname.includes('terasharelink') ||
      hostname.includes('nephobox') ||
      hostname.includes('4funbox') ||
      hostname.includes('mirrobox') ||
      hostname.includes('momerybox') ||
      hostname.includes('tibibox');

    if (!isTeraBoxDomain) return;

    // 1. Obliterate forced app download guides, privilege / VIP popups, client modals
    const teraAdSelectors = [
      'div[class*="GuideModal"]',
      'div[class*="app-download-guide"]',
      'div[class*="download-tip"]',
      'div[class*="app-guide"]',
      'div[class*="privilege-box"]',
      'div[class*="claim-vip"]',
      'div[class*="popup-guide"]',
      'div[class*="ad-box"]',
      'div[class*="banner-ad"]',
      'div[class*="cloud-ad"]',
      'div[class*="client-guide-modal"]',
      'div[class*="open-app-modal"]',
      'div[class*="install-app-dialog"]',
      'div[class*="dialog-wrapper"]:has(button[class*="client"])',
      'div[class*="modal-wrapper"]:has(div[class*="app"])',
      'div.guide-modal',
      '.web-download-tip',
      'div[class*="bottom-bar-tip"]'
    ];

    let removedModal = false;
    teraAdSelectors.forEach((sel) => {
      try {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => {
          el.remove();
          removedModal = true;
        });
      } catch {}
    });

    // 2. Unfreeze page body and restore natural scrolling
    if (removedModal || (document.body && document.body.style.overflow === 'hidden')) {
      try {
        if (document.body) {
          document.body.style.setProperty('overflow', 'auto', 'important');
          document.body.style.setProperty('pointer-events', 'auto', 'important');
        }
        if (document.documentElement) {
          document.documentElement.style.setProperty('overflow', 'auto', 'important');
        }
      } catch {}
    }

    // 3. Neutralize video player clickjack overlays on TeraBox
    try {
      const playerOverlays = document.querySelectorAll('.vjs-modal-dialog, div[class*="player-ad-overlay"], div[class*="click-layer"]');
      playerOverlays.forEach((ov) => ov.remove());
    } catch {}

    // 4. Reveal & ensure direct browser download button is clickable
    try {
      const downloadBtns = document.querySelectorAll(
        '.download-btn, button[class*="download"], div[class*="download-file-btn"], [data-action="download"], div[class*="common-download"]'
      );
      downloadBtns.forEach((btn) => {
        btn.style.setProperty('display', 'inline-flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
      });
    } catch {}
  }

  // 6. Social Media Ad & Feed Cleanser (X / Twitter, Reddit, Twitch, SoundCloud)
  function handleSocialMediaCleaners() {
    if (!byeadsActive || isWhitelisted) return;

    // A. X / Twitter timeline sponsored cleaner
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const sponsoredCells = document.querySelectorAll('div[data-testid="cellInnerDiv"]:has([data-testid="placementTracking"])');
      sponsoredCells.forEach((c) => {
        try { c.remove(); } catch {}
      });
      document.querySelectorAll('aside[aria-label*="Subscribe to Premium"], div[data-testid="inline-upgrade-prompt"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }

    // B. Reddit promoted posts & "Open in App" killer
    if (hostname.includes('reddit.com')) {
      document.querySelectorAll('shreddit-post[is-promoted="true"], .promotedlink, [data-adclickarea]').forEach((el) => {
        try { el.remove(); } catch {}
      });
      document.querySelectorAll('shreddit-async-loader[bundlename="bottom_sheet"], reddit-bottom-sheet, xpromo-app-selector').forEach((el) => {
        try {
          el.remove();
          if (document.body) {
            document.body.style.setProperty('overflow', 'auto', 'important');
          }
        } catch {}
      });
    }

    // C. Twitch stream ad banners & Turbo nags
    if (hostname.includes('twitch.tv')) {
      document.querySelectorAll('.stream-display-ad__wrapper, .video-player__ad-overlay, div[data-test-selector="ad-banner-default-text"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }

    // D. SoundCloud sponsored stream audio banners
    if (hostname.includes('soundcloud.com')) {
      document.querySelectorAll('div[class*="soundBadge__sponsored"], .streamAds, div[class*="sidebarAd"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }
  }

  // 7. Deception Engine: Fake Button & Deceptive Link Scanner
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

  // Trap any click on an invisible overlay or ad redirect link in capturing phase
  window.addEventListener('click', (e) => {
    if (!byeadsActive || isWhitelisted) return;
    const target = e.target;
    if (!target) return;

    // Check if target or parent is an ad-link
    const anchor = target.closest('a');
    if (anchor) {
      const href = String(anchor.href || '').toLowerCase();
      const AD_PATTERNS = [
        'popads', 'popcash', 'propeller', 'adsterra', 'exoclick', 'monetag', 'hilltopads',
        'adcash', 'onclickads', 'trafficjunky', 'juicyads', 'exdynsrv', 'clickadu', 'yllix',
        'bidvertiser', 'admaven', 'deloton', 'zeroredirect', 'alwingulla', 'onclickperformance',
        'bet365', '1xbet', 'spinanga', 'vulkanvegas'
      ];
      if (AD_PATTERNS.some(p => href.includes(p))) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        anchor.remove();
        return false;
      }
    }

    // Check if clicked element is a transparent overlay
    const rect = target.getBoundingClientRect();
    if (rect.width >= window.innerWidth * 0.65 && rect.height >= window.innerHeight * 0.65 && target.tagName !== 'VIDEO') {
      const style = window.getComputedStyle(target);
      const isFixed = style.position === 'fixed' || style.position === 'absolute';
      const isTransparent = parseFloat(style.opacity) <= 0.1 ||
                            style.backgroundColor === 'transparent' ||
                            style.backgroundColor.includes('rgba(0, 0, 0, 0)') ||
                            style.backgroundColor === 'rgba(0,0,0,0)';
      const textLen = (target.innerText || '').trim().length;
      if (isFixed && isTransparent && textLen < 15) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        target.remove();
        return false;
      }
    }
  }, true);

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
    } else if (msg.type === 'GET_TAB_STATS') {
      trackCosmeticBlocks();
      sendResponse({ count: Math.max(localTabBlockedCount, getTabBlockedCount()) });
      return true;
    }
  });

  const cosmeticSelectors = [
    'ins.adsbygoogle', 'div[id^="google_ads_"]', 'div[id^="div-gpt-ad"]', 'div[class*="ad-slot"]',
    'div[class*="ad-banner"]', 'div[id*="taboola-"]', 'div[class*="outbrain"]', '.ad-container',
    '[data-ad-unit]', '[data-ad-slot]', '#tads', '#tadsb', '#bottomads', 'ytd-ad-slot-renderer',
    '#player-ads', '.ytp-ad-overlay-container', 'ytmusic-player-bar .advertisement',
    'div[data-testid="ad-banner"]', '[data-testid="billboard-ad"]', '[data-testid="leaderboard-ad"]',
    '[data-testid="top-bar-ad"]', '[data-testid="in-app-message-wrapper"]', 'a[href*="spotify:ad:"]'
  ];

  function getTabBlockedCount() {
    let count = 0;
    try {
      const els = document.querySelectorAll(cosmeticSelectors.join(','));
      count = els.length;
    } catch {}
    return count;
  }

  function trackCosmeticBlocks() {
    if (!byeadsActive || isWhitelisted) return;
    try {
      const current = getTabBlockedCount();
      if (current > lastReportedCosmeticCount) {
        const delta = current - lastReportedCosmeticCount;
        lastReportedCosmeticCount = current;
        localTabBlockedCount += delta;
        try {
          chrome.runtime.sendMessage({
            type: 'INCREMENT_TAB_STATS',
            count: delta,
            category: 'cosmetic-ad',
            site: hostname
          });
        } catch {}
      }
    } catch {}
  }

  // Run initializations
  injectCosmeticFilter();
  handleTeraBoxProtections();
  handleSocialMediaCleaners();
  scanForDeceptiveButtons();
  killInvisibleClickjacks();
  setTimeout(handleCookieBanners, 800);
  setTimeout(trackCosmeticBlocks, 1200);

  // Fast loop for media streaming & clickjacks (runs at 150ms on Spotify)
  const loopInterval = hostname.includes('spotify.com') ? 150 : 250;
  setInterval(handleMediaStreamAds, loopInterval);
  setInterval(handleTeraBoxProtections, 500);
  setInterval(handleSocialMediaCleaners, 1000);
  setInterval(killInvisibleClickjacks, 1000);
  setInterval(trackCosmeticBlocks, 2000);

  // Dynamic mutation observer
  const observer = new MutationObserver(() => {
    handleMediaStreamAds();
    handleTeraBoxProtections();
    handleSocialMediaCleaners();
    scanForDeceptiveButtons();
    handleCookieBanners();
    killInvisibleClickjacks();
    trackCosmeticBlocks();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();

