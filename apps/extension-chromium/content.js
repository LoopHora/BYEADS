// ===== BYEADS DECEPTION ENGINE CONTENT SCRIPT =====
// Runs in document context to detect fake buttons, deceptive overlays, and redirect lures

(function () {
  function scanForDeceptiveButtons() {
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
            (targetDomain !== currentDomain && !targetDomain.endsWith(`.${currentDomain}`));

          if (isSuspiciousRedirect) {
            el.style.outline = '2px dashed #f59e0b';
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

  // Scan initially after load and on dynamic DOM updates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanForDeceptiveButtons);
  } else {
    scanForDeceptiveButtons();
  }

  // Observe dynamically injected third-party elements
  const observer = new MutationObserver(() => {
    scanForDeceptiveButtons();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
