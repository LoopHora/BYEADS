// ===== BYEADS WEB SHIELD & DECEPTION ENGINE =====
// Multi-layer in-page protection: YouTube/Music stream ad neutralization,
// universal cosmetic ad removal, and deceptive link heuristics.

(function () {
  'use strict';

  let byeadsActive = true;
  let blockedCount = 0;
  let lastAdSkippedTime = 0;

  // 1. Inject Universal & Streaming Cosmetic CSS Rules
  function injectCosmeticFilter() {
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

      /* YouTube & YouTube Music Specific Ad Removals */
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
      ytmusic-popup-container ytmusic-mealbar-promo-renderer {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // 2. YouTube & YouTube Music Active Stream Interceptor & Ad Skipper
  function handleMediaStreamAds() {
    if (!byeadsActive) return;

    const hostname = window.location.hostname;
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

      // Throttle recording stats
      const now = Date.now();
      if (now - lastAdSkippedTime > 1500) {
        lastAdSkippedTime = now;
        blockedCount++;
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
  }

  // 3. Deception Engine: Fake Button & Deceptive Link Scanner
  function scanForDeceptiveButtons() {
    if (!byeadsActive) return;

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

          // Check if link claims to be download but points to known ad domain or distinct third party
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
        } catch {
          // ignore parsing error
        }
      }
    });
  }

  // Check state from storage
  try {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res && res.byeads_enabled === false) {
        byeadsActive = false;
      }
    });
  } catch {}

  // Run initializations
  injectCosmeticFilter();
  scanForDeceptiveButtons();

  // High-frequency media ad guard loop for YouTube / YT Music
  setInterval(handleMediaStreamAds, 250);

  // MutationObserver for dynamic insertions
  const observer = new MutationObserver(() => {
    handleMediaStreamAds();
    scanForDeceptiveButtons();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
