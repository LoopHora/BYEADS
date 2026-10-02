// ===== BYEADS CHROMIUM MV3 BACKGROUND SERVICE WORKER =====

const DANGEROUS_EXTS = new Set(['exe', 'scr', 'bat', 'cmd', 'ps1', 'vbs', 'msi', 'iso']);
const DOC_EXTS = new Set(['pdf', 'doc', 'docx', 'xlsx', 'mp4', 'zip', 'txt']);

let stats = {
  blockedRequests: 0,
  blockedDownloads: 0,
  threatsDetected: 0
};

// Initialize persistent storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['byeads_stats', 'byeads_enabled'], (res) => {
    if (!res.byeads_stats) {
      chrome.storage.local.set({ byeads_stats: stats });
    } else {
      stats = res.byeads_stats;
    }
    if (res.byeads_enabled === undefined) {
      chrome.storage.local.set({ byeads_enabled: true });
    }
  });
});

// Download Guard: Evaluate downloads on creation
if (chrome.downloads && chrome.downloads.onCreated) {
  chrome.downloads.onCreated.addListener((item) => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res.byeads_enabled === false) return;

      const filename = (item.filename || '').trim();
      const parts = filename.split('.');

      if (parts.length >= 3) {
        const realExt = parts[parts.length - 1].toLowerCase();
        const fakeExt = parts[parts.length - 2].toLowerCase();

        // Flag double extension deception
        if (DANGEROUS_EXTS.has(realExt) && DOC_EXTS.has(fakeExt)) {
          console.warn(`[BYEADS] Deception detected! Cancelling deceptive download: ${filename}`);
          chrome.downloads.cancel(item.id, () => {
            stats.blockedDownloads++;
            stats.threatsDetected++;
            chrome.storage.local.set({ byeads_stats: stats });
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
          });
        }
      }
    });
  });
}

// Listen for messages from content script (Deception Engine detections)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'DECEPTION_DETECTED') {
    stats.threatsDetected++;
    chrome.storage.local.set({ byeads_stats: stats });
    chrome.action.setBadgeText({ text: 'WARN' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
    sendResponse({ received: true });
  } else if (msg.type === 'GET_STATS') {
    sendResponse({ stats });
  }
});
