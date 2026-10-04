// ===== BYEADS WEB SHIELD & DECEPTION ENGINE =====
// Multi-layer in-page protection:
// 1. YouTube & YouTube Music stream ad neutralization
// 2. Universal cosmetic ad removal
// 3. Smart Cookie Banner Auto-Dismiss (GDPR/CCPA)
// 4. Visual Element Zapper & Custom Rules Engine
// 5. Deception Engine fake download button scanner

(function () {
  'use strict';

  // Guarantee MAIN world execution of defuser.js (critical for Firefox MV2 and prototype locking)
  function ensureMainWorldDefuser() {
    if (document.getElementById('byeads-defuser-core')) return;
    try {
      const script = document.createElement('script');
      script.id = 'byeads-defuser-core';
      script.src = chrome.runtime.getURL('defuser.js');
      script.async = false;
      (document.head || document.documentElement).prepend(script);
      script.onload = () => script.remove();
    } catch {}
  }
  ensureMainWorldDefuser();

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
      ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
      ytd-promoted-video-renderer,
      ytd-display-ad-renderer,
      ytd-action-companion-ad-renderer,
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

      /* Spotify Web Player Ad Slots, Companion Cards & Upgrade Nags */
      div[data-testid="ad-companion-card"],
      div[data-testid="ad-companion-card-tagline"],
      div[data-testid="ad-slot-container"],
      div[data-testid="ad-banner"],
      div[data-testid="in-app-ad"],
      div[data-testid="desktop-client-sponsor-container"],
      div[aria-label="Sponsored"],
      div[data-testid="billboard-ad"],
      div[data-testid="leaderboard-ad"],
      div[data-testid="top-bar-ad"],
      div[data-testid="in-app-message-wrapper"],
      div[data-testid="ad-break"],
      a[data-context-item-type="ad"],
      a[href*="spotify:ad:"],
      button[data-testid="ad-feedback-button"],
      span[data-testid="track-info-advertiser"],
      span[data-testid="context-item-info-ad-title"],
      span[data-testid="context-item-info-ad-subtitle"],
      div[data-testid="context-item-info-ad-title"],
      div[data-testid="context-item-info-ad-subtitle"],
      button[data-testid="upgrade-button"],
      div[data-testid="user-widget-upgrade-button"],
      div[data-testid="banner-upsell"],
      div[data-testid="upsell-container"],
      div[data-testid="upsell-banner"],
      div[data-testid="premium-modal"],
      [aria-label="Upgrade to Premium"],
      footer[data-testid*="ad-type-ad"],
      footer[data-testadtype*="ad-type-ad"],
      #Desktop_PanelContainer_Id:has([data-testid="ad-companion-card"]),
      div:has(> [data-testid="ad-companion-card"]),
      div:has(> a[data-context-item-type="ad"]),
      div:has(> a[href*="spotify:ad:"]),
      div[class*="GenericModal"]:has([aria-label="Advertisement"]),
      div[class*="GenericModal"]:has(button[data-testid="ad-feedback-button"]),
      div[class*="GenericModal"]:has(a[href*="spotify:ad:"]),
      div[class*="ReactModal"]:has([aria-label="Advertisement"]),

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

      /* Facebook & Instagram Sponsored Feeds & Login Walls */
      div[data-pagelet*="FeedUnit"]:has(a[href*="/ads/about"]),
      div[id="login_popup_cta"],
      div[role="dialog"]:has(a[href*="accounts/login"]),
      div[class*="login-cta"],
      article:has(a[href*="/about/ads"]),
      div[data-testid="fb-sponsored-feed-unit"],

      /* LinkedIn Promoted Feed & Upsell Bars */
      aside.scaffold-layout__aside div:has(a[href*="premium"]),
      div[class*="premium-upsell"],
      div[data-view-name*="premium-upsell"],

      /* TikTok Web In-Feed Ads & App Download Prompts */
      div[data-e2e="feed-item"]:has([data-e2e="ad-tag"]),
      div[class*="DivBottomBanner"],
      div[class*="DivAppDownload"],
      div[class*="DivModalContainer"]:has(a[href*="apps.apple.com"]),

      /* Quora Promoted Answers & Signup Walls */
      div.q-box:has(a[href*="/ad/"]),
      div[class*="AdAnswer"],
      .signup_wall,
      .BaseSignupForm,
      .signup_modal,
      div[class*="SignupWall"],

      /* Pinterest Promoted Pins & Full Screen Signups */
      div[data-test-id="pin"]:has([data-test-id="badge-promoted"]),
      div[data-test-id="gift-wrap"],
      div[data-test-id="full-page-signup"],
      div[data-test-id="login-modal-default"],

      /* Cloud File Hosters Fake Download Ads & Timer Traps (MediaFire, 1Fichier, RapidGator) */
      div.dl-promo-cont,
      #ad-desktop-1,
      #ad-desktop-2,
      div[class*="dl-ad"],
      div[class*="download-ad"],
      div[id*="ad-direct"],
      .ads-middle,
      .ads-bottom,
      div[class*="promo-download"],

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
      a[href*="1xbet.com"],

      /* Outstream & Floating Sticky Corner Video Players ("Whooshing" Video Ads) */
      div[class*="corner-player"],
      div[id*="corner-player"],
      div[class*="sticky-player"],
      div[id*="sticky-player"],
      div[class*="floating-player"],
      div[id*="floating-player"],
      div[class*="dock-player"],
      div[class*="docked-player"],
      div[class*="outstream"],
      div[id*="outstream"],
      div[class*="in-stream-ad"],
      div[class*="instream-ad"],
      div[class*="flyin-ad"],
      div[class*="slide-in-ad"],
      div[class*="slidein-ad"],
      div[class*="floater-ad"],
      div[class*="adhesive-ad"],
      div[class*="gutter-ad"],
      div[id*="vdoai"],
      div[class*="vdo-ai"],
      div[id*="primis"],
      div[class*="primis"],
      div[id*="connatix"],
      div[class*="connatix"],
      div[id*="brid_"],
      div[class*="brid-player"],
      div[id*="aniview"],
      div[class*="aniview"],
      div[class*="playwire"],
      div[id*="playwire"],
      div[class*="anyclip"],
      div[id*="anyclip"],
      div[class*="teads"],
      div[id*="teads"],
      div[class*="undertone"],
      div[id*="undertone"],
      div[class*="kargo"],
      div[class*="ad-dock"],
      div[class*="sticky-dock"],
      div[class*="sticky-video-container"],
      div[class*="video-ad-dock"],
      div[class*="floating-video"],
      div[id*="floating-video"],
      div[class*="interstitial-ad"],
      div[id*="interstitial-ad"],
      div[class*="takeover-ad"],
      div[id*="takeover-ad"],
      div[class*="overlay-ad"],
      div[id*="overlay-ad"],
      div[class*="ad-overlay"],
      div[id*="ad-overlay"],
      div[class*="ad-wrapper-floating"],
      div[class*="floating-banner"],
      div[id*="floating-banner"],
      div[class*="corner-banner"],
      div[id*="corner-banner"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
      }

      @layer byeads_override {
        [data-testid="ad-companion-card"],
        [data-testid="ad-companion-card-tagline"],
        [data-testid="ad-slot-container"],
        [data-testid="ad-banner"],
        [data-testid="in-app-ad"],
        [data-testid="desktop-client-sponsor-container"],
        [data-testid="billboard-ad"],
        [data-testid="leaderboard-ad"],
        [data-testid="top-bar-ad"],
        [data-testid="in-app-message-wrapper"],
        [data-testid="ad-break"],
        a[data-context-item-type="ad"],
        a[href*="spotify:ad:"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          max-height: 0 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // 3. Media Stream Ad Neutralizer (YouTube, YouTube Music & Spotify)
  let wasMutedByAd = false;
  let lastSpotifyMuteTime = 0;
  let lastSpotifySkipTime = 0;
  let spotifyMutedByAd = false;
  let spotifyConfirmedRealTrackTicks = 0;

  const SPOTIFY_AD_SELECTORS = [
    '[data-testid="ad-companion-card"]',
    '[data-testid="ad-companion-card-tagline"]',
    '[data-testid="ad-slot-container"]',
    '[data-testid="ad-banner"]',
    '[data-testid="in-app-ad"]',
    '[data-testid="desktop-client-sponsor-container"]',
    '[data-testid="billboard-ad"]',
    '[data-testid="leaderboard-ad"]',
    '[data-testid="top-bar-ad"]',
    '[data-testid="in-app-message-wrapper"]',
    '[data-testid="ad-break"]',
    '[data-testid="track-info-advertiser"]',
    '[data-testid="context-item-info-ad-title"]',
    '[data-testid="context-item-info-ad-subtitle"]',
    '[data-testid="user-widget-upgrade-button"]',
    '[data-testid="banner-upsell"]',
    '[data-testid="upsell-container"]',
    '[data-testid="upsell-banner"]',
    '[data-testid="premium-modal"]',
    'button[data-testid="ad-feedback-button"]',
    'button[data-testid="upgrade-button"]',
    '[aria-label="Upgrade to Premium"]',
    'a[data-context-item-type="ad"]',
    'a[href*="spotify:ad:"]',
    'footer[data-testid*="ad-type-ad"]',
    'footer[data-testadtype*="ad-type-ad"]',
    '#Desktop_PanelContainer_Id:has([data-testid="ad-companion-card"])',
    'div:has(> [data-testid="ad-companion-card"])',
    'div:has(> a[data-context-item-type="ad"])',
    'div:has(> a[href*="spotify:ad:"])',
    'div[class*="GenericModal"]:has([aria-label="Advertisement"])',
    'div[class*="GenericModal"]:has(button[data-testid="ad-feedback-button"])',
    'div[class*="GenericModal"]:has(a[href*="spotify:ad:"])',
    'div[class*="ReactModal"]:has([aria-label="Advertisement"])'
  ];

  function cleanSpotifyDOMAds() {
    if (!hostname.includes('spotify.com')) return;
    try {
      const elements = document.querySelectorAll(SPOTIFY_AD_SELECTORS.join(', '));
      elements.forEach((el) => {
        try {
          // Hide visually without calling el.remove() to avoid breaking React's virtual DOM tree
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('height', '0px', 'important');
          el.style.setProperty('max-height', '0px', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        } catch {}
      });
    } catch {}
  }

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
      // 1. Continuous aggressive visual & companion ad suppression
      cleanSpotifyDOMAds();

      const docTitle = document.title.toLowerCase();

      // 2. Explicit advertisement title indicators
      const hasAdTitle = docTitle.includes('advertisement');

      // 3. Explicit ad widgets, advertiser badges, ad breaks, or ad companion cards
      const adWidget = document.querySelector(
        '[data-testid="context-item-info-ad-title"], ' +
        '[data-testid="context-item-info-ad-subtitle"], ' +
        '[data-testid="track-info-advertiser"], ' +
        '[data-testid="ad-companion-card"], ' +
        '[data-testid="ad-companion-card-tagline"], ' +
        '[data-testid="ad-break"], ' +
        '[data-testid="ad-feedback-button"], ' +
        'a[data-context-item-type="ad"], ' +
        'footer[data-testid*="ad-type-ad"], ' +
        'footer[data-testadtype*="ad-type-ad"], ' +
        '[aria-label="Advertisement"], ' +
        'a[href*="spotify:ad:"]'
      );

      // 4. Check track title in player bar
      const nowPlayingTitle = document.querySelector(
        '[data-testid="now-playing-widget"] [data-testid="context-item-info-title"], ' +
        '[data-testid="context-item-info-title"]'
      );
      const titleText = nowPlayingTitle ? nowPlayingTitle.textContent.trim().toLowerCase() : '';
      const isTitleAd = titleText === 'advertisement' || titleText.startsWith('advertisement');

      // 5. Check for ad-break text in now playing widget / footer
      const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"], footer');
      const widgetText = nowPlayingWidget ? (nowPlayingWidget.textContent || '').toLowerCase() : '';
      const hasAdBreakText = widgetText.includes('continue after the break');

      // Detection: explicit ad title, ad widget, or ad break indicator
      const isSpotifyAd = hasAdTitle || !!adWidget || isTitleAd || hasAdBreakText;

      const audios = document.querySelectorAll('audio, video');

      if (isSpotifyAd) {
        spotifyMutedByAd = true;

        // Advertisement detected: Mute audio cleanly
        audios.forEach((audio) => {
          if (!audio.muted) {
            audio.muted = true;
          }
          audio.volume = 0;
        });

        // Trigger skip button gently (max once per 4 seconds, never flood)
        const now = Date.now();
        if (now - lastSpotifySkipTime > 4000) {
          lastSpotifySkipTime = now;
          try {
            const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
            if (skipBtn && !skipBtn.disabled && skipBtn.getAttribute('aria-disabled') !== 'true') {
              skipBtn.click();
            }
          } catch {}
        }

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
        // Genuine music track playing: restore audio immediately
        if (spotifyMutedByAd) {
          audios.forEach((audio) => {
            audio.muted = false;
            if (audio.volume === 0) {
              audio.volume = 1.0;
            }
          });
          spotifyMutedByAd = false;
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
      document.querySelectorAll('shreddit-post[is-promoted="true"], .promotedlink, [data-adclickarea], div[data-testid="post-container"]:has([data-testid="placementTracking"])').forEach((el) => {
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

    // D. SoundCloud sponsored stream audio banners & audio ad neutralizer
    if (hostname.includes('soundcloud.com')) {
      const isSoundcloudAd = !!document.querySelector('div[class*="soundBadge__sponsored"], .soundBadge__sponsored') ||
                             document.title.toLowerCase().includes('audio ad') ||
                             !!document.querySelector('.playControls__soundBadge [aria-label*="Sponsored"]');
      if (isSoundcloudAd) {
        document.querySelectorAll('audio').forEach((a) => {
          if (!a.muted) a.muted = true;
          try {
            a.playbackRate = 16.0;
            if (a.duration && !isNaN(a.duration)) a.currentTime = a.duration - 0.1;
          } catch {}
        });
        const skip = document.querySelector('.playControls__next, button[title="Skip to next"]');
        if (skip && !skip.disabled) skip.click();
      } else {
        document.querySelectorAll('audio').forEach((a) => {
          if (a.muted) a.muted = false;
          if (a.playbackRate > 1.0) a.playbackRate = 1.0;
        });
      }
      document.querySelectorAll('div[class*="soundBadge__sponsored"], .streamAds, div[class*="sidebarAd"], .soundBadge__sponsored').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }

    // E. Facebook & Instagram sponsored feed cleaner & login popups
    if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
      document.querySelectorAll('div[data-pagelet*="FeedUnit"]:has(a[href*="/ads/about"]), div[data-testid="fb-sponsored-feed-unit"], article:has(a[href*="/about/ads"])').forEach((el) => {
        try { el.remove(); } catch {}
      });
      // Neutralize sticky login wall modals blocking page viewing
      document.querySelectorAll('div[id="login_popup_cta"], div[class*="login-cta"], div[role="dialog"]:has(a[href*="accounts/login"])').forEach((el) => {
        try {
          el.remove();
          if (document.body) {
            document.body.style.setProperty('overflow', 'auto', 'important');
          }
        } catch {}
      });
    }

    // F. LinkedIn promoted feeds & premium upsells
    if (hostname.includes('linkedin.com')) {
      document.querySelectorAll('.feed-shared-update-v2:has(.feed-shared-actor__sub-description), div[data-urn*="urn:li:activity"]').forEach((card) => {
        try {
          const text = (card.innerText || '').toLowerCase();
          if (text.includes('promoted') || text.includes('sponsored')) {
            card.remove();
          }
        } catch {}
      });
      document.querySelectorAll('aside.scaffold-layout__aside div:has(a[href*="premium"]), div[class*="premium-upsell"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }

    // G. TikTok web in-feed ads & app download banners
    if (hostname.includes('tiktok.com')) {
      document.querySelectorAll('div[data-e2e="feed-item"]:has([data-e2e="ad-tag"]), div[class*="DivBottomBanner"], div[class*="DivAppDownload"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
    }

    // H. Quora sponsored answers & signup wall unblur
    if (hostname.includes('quora.com')) {
      document.querySelectorAll('div.q-box:has(a[href*="/ad/"]), div[class*="AdAnswer"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
      const signupWall = document.querySelectorAll('.signup_wall, .BaseSignupForm, .signup_modal, div[class*="SignupWall"]');
      if (signupWall.length > 0) {
        signupWall.forEach((el) => {
          try { el.remove(); } catch {}
        });
        if (document.body) {
          document.body.style.setProperty('overflow', 'auto', 'important');
        }
        document.querySelectorAll('div[id="root"], div[class*="content"], div[class*="layout"]').forEach((el) => {
          el.style.setProperty('filter', 'none', 'important');
        });
      }
    }

    // I. Pinterest promoted pins & signup dialog
    if (hostname.includes('pinterest.com')) {
      document.querySelectorAll('div[data-test-id="pin"]:has([data-test-id="badge-promoted"]), div[data-test-id="gift-wrap"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
      document.querySelectorAll('div[data-test-id="full-page-signup"], div[data-test-id="login-modal-default"]').forEach((el) => {
        try {
          el.remove();
          if (document.body) {
            document.body.style.setProperty('overflow', 'auto', 'important');
          }
        } catch {}
      });
    }
  }

  // 7. Universal File Hoster & Cloud Portal Protection (MediaFire, RapidGator, 1Fichier, Mega)
  function handleFileHosterCleaners() {
    if (!byeadsActive || isWhitelisted) return;
    const isHoster =
      hostname.includes('mediafire.com') ||
      hostname.includes('rapidgator.net') ||
      hostname.includes('1fichier.com') ||
      hostname.includes('mega.nz') ||
      hostname.includes('filefactory.com') ||
      hostname.includes('uploaded.net') ||
      hostname.includes('zippyshare');

    if (!isHoster) return;

    // MediaFire specific ad wrappers and direct download protection
    if (hostname.includes('mediafire.com')) {
      document.querySelectorAll('div.dl-promo-cont, #ad-desktop-1, #ad-desktop-2, div[class*="dl-ad"], div.ads, div[id*="ad_"]').forEach((el) => {
        try { el.remove(); } catch {}
      });
      const dlBtn = document.getElementById('downloadButton');
      if (dlBtn) {
        dlBtn.style.setProperty('display', 'block', 'important');
        dlBtn.style.setProperty('visibility', 'visible', 'important');
        dlBtn.style.setProperty('pointer-events', 'auto', 'important');
      }
    }

    // Generic file hoster fake buttons & countdown timer overlays
    const fakeDlSelectors = [
      'div[class*="download-ad"]',
      'div[id*="ad-direct"]',
      '.ads-middle',
      '.ads-bottom',
      'div[class*="promo-download"]',
      'div[id*="banner-container"]',
      'iframe[src*="ad"]'
    ];
    fakeDlSelectors.forEach((sel) => {
      try {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => el.remove());
      } catch {}
    });
  }

  // 8. Deception Engine: Fake Button & Deceptive Link Scanner
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

  // 7. Outstream Floating Sticky Corner Video & Takeover Neutralizer ("Whooshing" Video Ads)
  const OUTSTREAM_PATTERNS = [
    'corner-player', 'sticky-player', 'floating-player', 'dock-player', 'docked-player',
    'outstream', 'instream-ad', 'flyin-ad', 'slide-in-ad', 'slidein-ad', 'floater-ad',
    'adhesive-ad', 'gutter-ad', 'vdoai', 'vdo-ai', 'primis', 'connatix', 'brid_',
    'brid-player', 'aniview', 'playwire', 'anyclip', 'teads', 'undertone', 'kargo',
    'ad-dock', 'sticky-dock', 'sticky-video-container', 'video-ad-dock', 'floating-video',
    'interstitial-ad', 'takeover-ad', 'floating-banner', 'corner-banner'
  ];

  function killFloatingAndOutstreamAds() {
    if (!byeadsActive || isWhitelisted) return;
    try {
      // 1. Selector-based fast cleanup
      const selector = OUTSTREAM_PATTERNS.map(p => `div[class*="${p}"], div[id*="${p}"]`).join(', ');
      const candidates = document.querySelectorAll(selector);
      candidates.forEach((el) => {
        el.querySelectorAll('video').forEach(v => {
          try { v.pause(); v.src = ''; } catch {}
        });
        el.remove();
      });

      // 2. Structural heuristic: fixed/sticky corner video widgets that warp/whoosh into view
      const fixedContainers = document.querySelectorAll('div, aside, section');
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      fixedContainers.forEach((el) => {
        if (el === document.body || el === document.documentElement) return;
        if (el.id === 'byeads-zapper-overlay' || el.closest('#byeads-zapper-overlay')) return;

        const style = window.getComputedStyle(el);
        if (style.position !== 'fixed' && style.position !== 'sticky') return;

        const rect = el.getBoundingClientRect();
        // Floating corner widget: 140px-500px wide, 80px-380px high, docked near screen edges
        const isCornerSize = rect.width >= 140 && rect.width <= 500 && rect.height >= 80 && rect.height <= 380;
        const isDockedCorner = (rect.bottom >= vh - 60 && (rect.right >= vw - 60 || rect.left <= 60));

        if (isCornerSize && isDockedCorner) {
          const hasVideoOrIframe = el.querySelector('video, iframe');
          const hasAdKeywords = /ad|sponsor|promo|outstream|vdo|primis|brid|connatix|video-dock/i.test(el.className + ' ' + el.id);
          if (hasVideoOrIframe && (hasAdKeywords || !el.querySelector('nav, main, header, article'))) {
            el.querySelectorAll('video').forEach(v => {
              try { v.pause(); v.src = ''; } catch {}
            });
            el.remove();
          }
        }
      });
    } catch {}
  }

  // 8. Invisible Clickjack & Popunder Trap Killer (with Download & Button Safeguards)
  let lastClickjackAlertTime = 0;
  function killInvisibleClickjacks() {
    if (!byeadsActive || isWhitelisted) return;

    // Scan overlay candidate containers
    const elements = document.querySelectorAll('div, section');
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    elements.forEach((el) => {
      if (el === document.body || el === document.documentElement) return;
      if (el.id === 'byeads-zapper-overlay' || el.closest('#byeads-zapper-overlay')) return;

      // CRITICAL SAFEGUARD: Never touch buttons, links, download controls, or inputs
      if (el.closest('button, a, form, input, select, textarea, [download], [role="button"], [class*="download"], [id*="download"], [class*="btn"], [id*="btn"]')) return;

      try {
        const style = window.getComputedStyle(el);
        const pos = style.position;
        if (pos !== 'fixed' && pos !== 'absolute') return;

        const rect = el.getBoundingClientRect();
        // True invisible clickjack must cover a large portion of the viewport (>= 50% width and height)
        const isCoverageTrap = rect.width >= vw * 0.5 && rect.height >= vh * 0.5;

        if (isCoverageTrap) {
          const opacity = parseFloat(style.opacity);
          const bg = style.backgroundColor;
          const isTransparentBg = bg === 'transparent' ||
                                  bg.includes('rgba(0, 0, 0, 0)') ||
                                  bg === 'rgba(0,0,0,0)';
          const isTransparent = opacity <= 0.05 || isTransparentBg;

          const textLength = (el.innerText || '').trim().length;
          const hasInteractiveChildren = el.querySelectorAll('button, a, input, select, textarea, form, h1, h2, h3, p, video, img').length > 0;

          // Only eliminate true blank cover sheets with zero text and zero interactive children
          if (isTransparent && textLength === 0 && !hasInteractiveChildren) {
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

  // 9. Trap Any Click on an Invisible Overlay or Ad Redirect Link in Capturing Phase
  const EXTENDED_AD_PATTERNS = [
    'popads', 'popcash', 'propeller', 'adsterra', 'exoclick', 'monetag', 'hilltopads',
    'adcash', 'onclickads', 'trafficjunky', 'juicyads', 'exdynsrv', 'exosrv', 'realsrv',
    'clickadu', 'yllix', 'bidvertiser', 'admaven', 'ad-maven', 'deloton', 'zeroredirect',
    'alwingulla', 'onclickperformance', 'popunder', 'trafficstars', 'plugrush', 'popmyads',
    'directrev', 'adnetworkperformance', 'clck.ru', 'adnxs', 'criteo', 'taboola', 'outbrain',
    'mgid', 'revcontent', 'doubleclick', 'googlesyndication', 'adservice.google',
    'smartadserver', 'bet365', '1xbet', 'vulkan', 'parimatch', 'spinanga', 'onclick',
    'direct-link', 'redirect-jump', 'linkbucks', 'ouo.io', 'adf.ly', 'shorte.st',
    'richpush', 'a-ads', 'voluumtrk', 'redtrack', 'bemob', 'aniview', 'vdo.ai',
    'connatix', 'playwire', 'brid.tv', 'primis', 'teads', 'evadav', 'rollerads', 'clickaine'
  ];

  const EXPLICIT_AD_REDIRECT_PATHS = [
    '/jump.php', '/jump?', '/go.php', '/go?', '/ad/click', '/pop.php', '/popunder', '/redirect.php?ad=', '/direct-link'
  ];

  const SAFE_DOWNLOAD_EXTENSIONS = [
    '.zip', '.tar', '.gz', '.tgz', '.exe', '.msi', '.iso', '.dmg', '.pkg',
    '.apk', '.pdf', '.mp3', '.mp4', '.wav', '.epub', '.7z', '.rar', '.json',
    '.mobileconfig', '.ps1', '.sh', '.bat', '.cmd'
  ];

  function isAdClickTarget(targetHref, anchor) {
    if (!targetHref || targetHref === '#' || targetHref.startsWith('javascript:')) return false;

    // Never block legitimate downloads or form actions
    if (anchor) {
      if (anchor.hasAttribute('download')) return false;
      const text = (anchor.innerText || anchor.textContent || '').toLowerCase();
      if (/download|install|setup|get\s|save|update/i.test(text)) return false;
    }

    try {
      const resolved = new URL(targetHref, window.location.href);
      const destHost = resolved.hostname.toLowerCase().replace(/^www\./, '');
      const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, '');
      const fullPath = (resolved.pathname + resolved.search).toLowerCase();

      // If URL points to a legitimate download file extension, allow immediately!
      if (SAFE_DOWNLOAD_EXTENSIONS.some(ext => resolved.pathname.toLowerCase().endsWith(ext))) {
        return false;
      }

      // Direct ad domain match
      if (EXTENDED_AD_PATTERNS.some(p => destHost.includes(p))) return true;

      // Same-host explicit ad redirect traps
      if (destHost === currentHost || destHost.endsWith('.' + currentHost)) {
        if (EXPLICIT_AD_REDIRECT_PATHS.some(rg => fullPath.includes(rg))) return true;
        if (/(\?|&)(ad_url|dest_ad|ad_redirect)=https?:\/\//i.test(fullPath)) return true;
      }
    } catch {}
    return false;
  }

  window.addEventListener('click', (e) => {
    if (!byeadsActive || isWhitelisted) return;
    const target = e.target;
    if (!target) return;

    // SAFEGUARD: If target or parent is a legitimate button, download, form input, or interactive control, ALLOW IMMEDIATELY!
    if (
      target.closest('button, input, select, textarea, label, [role="button"], [download], [class*="download"], [id*="download"], [class*="btn"], [id*="btn"]')
    ) {
      return;
    }

    // 1. Check if target or parent is an ad-link (NEVER call anchor.remove() so buttons never disappear)
    const anchor = target.closest('a');
    if (anchor) {
      // If it's a download link or has download text, NEVER touch or block it!
      const anchorText = (anchor.innerText || anchor.textContent || '').trim().toLowerCase();
      if (anchor.hasAttribute('download') || anchor.download || /download|install|setup|get\s|save|update/i.test(anchorText)) {
        return;
      }

      const href = String(anchor.href || '');
      if (isAdClickTarget(href, anchor)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.warn('[BYEADS] Blocked click on ad destination:', href);
        return false;
      }

      // Check external _blank links on suspicious ad domains
      if (anchor.target === '_blank' && (href.startsWith('http://') || href.startsWith('https://'))) {
        try {
          const currentHost = window.location.hostname.replace(/^www\./, '');
          const destHost = new URL(href).hostname.replace(/^www\./, '');
          const isSameDomain = destHost === currentHost || destHost.endsWith('.' + currentHost);
          if (!isSameDomain && EXTENDED_AD_PATTERNS.some(p => destHost.includes(p))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.warn('[BYEADS] Blocked click on ad network host:', destHost);
            return false;
          }
        } catch {}
      }
      return; // Do NOT proceed to overlay check if clicking inside a link
    }

    // 2. Check if clicked element is a true transparent clickjack overlay
    // A true overlay must be a large fixed/absolute cover covering >= 70% of the screen with ZERO visible text and NO child controls
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = target.getBoundingClientRect();
    const isLargeCover = rect.width >= vw * 0.7 && rect.height >= vh * 0.7;

    if (isLargeCover && target.tagName !== 'VIDEO' && target.tagName !== 'MAIN' && target.tagName !== 'BODY' && target.tagName !== 'HTML') {
      const style = window.getComputedStyle(target);
      const isFixed = style.position === 'fixed' || style.position === 'absolute';
      const isTransparent = parseFloat(style.opacity) <= 0.05 ||
                            style.backgroundColor === 'transparent' ||
                            style.backgroundColor.includes('rgba(0, 0, 0, 0)') ||
                            style.backgroundColor === 'rgba(0,0,0,0)';
      const textLen = (target.innerText || '').trim().length;

      // Only eliminate true blank cover sheets with zero text and no interactive controls
      if (isFixed && isTransparent && textLen === 0 && !target.querySelector('button, a, input, select, textarea, form, h1, h2, h3, p, video, img')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        target.style.setProperty('pointer-events', 'none', 'important');
        target.style.setProperty('display', 'none', 'important');
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
    '[data-testid="top-bar-ad"]', '[data-testid="in-app-message-wrapper"]', 'a[href*="spotify:ad:"]',
    '[data-testid="ad-companion-card"]', '[data-testid="ad-slot-container"]', '[data-testid="track-info-advertiser"]',
    'a[data-context-item-type="ad"]'
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

  // 10. Cross-Platform Dashboard Bridge (Windows, MacBook & Android PWA)
  // Allows the authorized BYEADS web dashboard to verify real extension presence and read live stats
  const isDashboardOrigin =
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('byeads.net');

  if (isDashboardOrigin) {
    function sendDashboardTelemetry() {
      try {
        window.postMessage({
          source: 'BYEADS_EXTENSION',
          type: 'BYEADS_TELEMETRY_UPDATE',
          payload: {
            installed: true,
            version: '1.0.0',
            active: byeadsActive && !isWhitelisted,
            blockedInTab: Math.max(localTabBlockedCount, getTabBlockedCount()),
            rulesActive: 77,
            shields: {
              webShield: true,
              deceptionEngine: true,
              popupTrap: true,
              teraboxShield: true,
              socialCleaners: true,
              autoHealer: true
            }
          }
        }, '*');
      } catch {}
    }

    sendDashboardTelemetry();
    window.addEventListener('DOMContentLoaded', sendDashboardTelemetry);
    window.addEventListener('load', sendDashboardTelemetry);

    window.addEventListener('message', (e) => {
      if (e.data && e.data.source === 'BYEADS_DASHBOARD' && e.data.type === 'PING') {
        sendDashboardTelemetry();
      }
    });

    setInterval(sendDashboardTelemetry, 1500);
  }

  // Run initializations
  injectCosmeticFilter();
  handleTeraBoxProtections();
  handleFileHosterCleaners();
  handleSocialMediaCleaners();
  scanForDeceptiveButtons();
  killInvisibleClickjacks();
  killFloatingAndOutstreamAds();
  setTimeout(handleCookieBanners, 800);
  setTimeout(trackCosmeticBlocks, 1200);

  // Fast loop for media streaming & clickjacks (runs at 150ms on Spotify)
  const loopInterval = hostname.includes('spotify.com') ? 150 : 250;
  setInterval(handleMediaStreamAds, loopInterval);
  setInterval(handleTeraBoxProtections, 500);
  setInterval(handleFileHosterCleaners, 1000);
  setInterval(handleSocialMediaCleaners, 1000);
  setInterval(killInvisibleClickjacks, 1000);
  setInterval(killFloatingAndOutstreamAds, 1000);
  setInterval(trackCosmeticBlocks, 2000);

  // Dynamic mutation observer
  const observer = new MutationObserver(() => {
    handleMediaStreamAds();
    handleTeraBoxProtections();
    handleFileHosterCleaners();
    handleSocialMediaCleaners();
    scanForDeceptiveButtons();
    handleCookieBanners();
    killInvisibleClickjacks();
    killFloatingAndOutstreamAds();
    trackCosmeticBlocks();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();

