// ===== BYEADS CHROMIUM MV3 BACKGROUND SERVICE WORKER =====

const DANGEROUS_EXTS = new Set(['exe', 'scr', 'bat', 'cmd', 'ps1', 'vbs', 'msi', 'iso', 'jar', 'apk']);
const DOC_EXTS = new Set(['pdf', 'doc', 'docx', 'xlsx', 'mp4', 'zip', 'txt', 'jpg', 'png']);

let stats = {
  adsBlocked: 0,
  mediaAdsBlocked: 0,
  blockedDownloads: 0,
  threatsDetected: 0,
  lastUpdated: Date.now()
};

// Initialize persistent storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['byeads_stats', 'byeads_enabled', 'byeads_web_shield', 'byeads_media_shield', 'byeads_deception_shield'], (res) => {
    if (!res.byeads_stats) {
      chrome.storage.local.set({ byeads_stats: stats });
    } else {
      stats = { ...stats, ...res.byeads_stats };
    }
    if (res.byeads_enabled === undefined) chrome.storage.local.set({ byeads_enabled: true });
    if (res.byeads_web_shield === undefined) chrome.storage.local.set({ byeads_web_shield: true });
    if (res.byeads_media_shield === undefined) chrome.storage.local.set({ byeads_media_shield: true });
    if (res.byeads_deception_shield === undefined) chrome.storage.local.set({ byeads_deception_shield: true });
    updateBadge();
  });
});

function updateBadge() {
  const total = (stats.adsBlocked || 0) + (stats.mediaAdsBlocked || 0) + (stats.threatsDetected || 0);
  if (total > 0) {
    chrome.action.setBadgeText({ text: total > 999 ? '999+' : String(total) });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  } else {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  }
}

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

        // Flag double extension deception (e.g. document.pdf.exe)
        if (DANGEROUS_EXTS.has(realExt) && DOC_EXTS.has(fakeExt)) {
          console.warn(`[BYEADS] Deception detected! Cancelling deceptive download: ${filename}`);
          chrome.downloads.cancel(item.id, () => {
            stats.blockedDownloads = (stats.blockedDownloads || 0) + 1;
            stats.threatsDetected = (stats.threatsDetected || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
          });
        }
      }
    });
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'MEDIA_AD_BLOCKED') {
    stats.mediaAdsBlocked = (stats.mediaAdsBlocked || 0) + (msg.count || 1);
    stats.adsBlocked = (stats.adsBlocked || 0) + (msg.count || 1);
    chrome.storage.local.set({ byeads_stats: stats });
    updateBadge();
    sendResponse({ success: true, stats });
  } else if (msg.type === 'DECEPTION_DETECTED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });
    chrome.action.setBadgeText({ text: 'WARN' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
    sendResponse({ success: true, stats });
  } else if (msg.type === 'GET_STATS') {
    chrome.storage.local.get(['byeads_stats'], (res) => {
      if (res && res.byeads_stats) {
        stats = { ...stats, ...res.byeads_stats };
      }
      sendResponse({ stats });
    });
    return true; // Keep async channel open
  } else if (msg.type === 'RESET_STATS') {
    stats = { adsBlocked: 0, mediaAdsBlocked: 0, blockedDownloads: 0, threatsDetected: 0, lastUpdated: Date.now() };
    chrome.storage.local.set({ byeads_stats: stats }, () => {
      updateBadge();
      sendResponse({ success: true, stats });
    });
    return true;
  }
});
