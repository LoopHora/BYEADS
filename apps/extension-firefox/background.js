// ===== BYEADS FIREFOX BACKGROUND SCRIPT =====

const BLOCKED_DOMAINS = [
  "*://*.doubleclick.net/*",
  "*://*.googlesyndication.com/*",
  "*://*.google-analytics.com/*",
  "*://*.adservice.google.com/*",
  "*://*.popads.net/*",
  "*://*.propellerads.com/*",
  "*://*.adnxs.com/*",
  "*://*.outbrain.com/*",
  "*://*.taboola.com/*",
  "*://*.onclickads.net/*",
  "*://*.criteo.com/*",
  "*://*.amazon-adsystem.com/*",
  "*://*.adsterra.com/*",
  "*://*.adcash.com/*",
  "*://*.popcash.net/*",
  "*://*.revcontent.com/*",
  "*://*.mgid.com/*",
  "*://*.ezoic.com/*",
  "*://*.media.net/*",
  "*://*.buysellads.com/*",
  "*://*.carbonads.net/*",
  "*://*.clarity.ms/*",
  "*://*.hotjar.com/*",
  "*://*.youtube.com/api/stats/ads*",
  "*://*.youtube.com/pagead/*",
  "*://*.youtube.com/ptracking*",
  "*://*.music.youtube.com/api/stats/ads*",
  "*://*.googleads.g.doubleclick.net/pagead/*"
];

let stats = {
  adsBlocked: 0,
  mediaAdsBlocked: 0,
  blockedDownloads: 0,
  threatsDetected: 0,
  lastUpdated: Date.now()
};

const recentLogs = [];

function logBlockedEvent(domain, category, details) {
  recentLogs.unshift({
    id: Date.now() + Math.random(),
    domain,
    category,
    details: details || '',
    time: new Date().toLocaleTimeString()
  });
  if (recentLogs.length > 60) recentLogs.pop();
}

// WebRequest blocking filter
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      stats.adsBlocked++;
      chrome.storage.local.set({ byeads_stats: stats });
      try {
        const u = new URL(details.url);
        logBlockedEvent(u.hostname, 'Network Ad / Tracker', details.url);
      } catch {}
      return { cancel: true };
    },
    { urls: BLOCKED_DOMAINS },
    ["blocking"]
  );
}

// Download Guard: Evaluate downloads on creation
if (chrome.downloads && chrome.downloads.onCreated) {
  chrome.downloads.onCreated.addListener((item) => {
    const filename = (item.filename || '').trim();
    const parts = filename.split('.');
    if (parts.length >= 3) {
      const realExt = parts[parts.length - 1].toLowerCase();
      const fakeExt = parts[parts.length - 2].toLowerCase();
      const DANGEROUS = new Set(['exe', 'scr', 'bat', 'cmd', 'ps1', 'msi', 'iso']);
      const DOCS = new Set(['pdf', 'doc', 'docx', 'xlsx', 'mp4', 'zip', 'txt']);

      if (DANGEROUS.has(realExt) && DOCS.has(fakeExt)) {
        console.warn(`[BYEADS Firefox] Deception detected! Cancelling: ${filename}`);
        chrome.downloads.cancel(item.id, () => {
          stats.blockedDownloads++;
          stats.threatsDetected++;
          chrome.storage.local.set({ byeads_stats: stats });
          logBlockedEvent('download', 'Deceptive File (.pdf.exe)', filename);
        });
      }
    }
  });
}

// Message listener for in-page detections & stats
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'MEDIA_AD_BLOCKED') {
    stats.mediaAdsBlocked = (stats.mediaAdsBlocked || 0) + (msg.count || 1);
    stats.adsBlocked = (stats.adsBlocked || 0) + (msg.count || 1);
    chrome.storage.local.set({ byeads_stats: stats });
    logBlockedEvent(msg.site || 'youtube.com', 'YouTube In-Stream Ad', 'Muted & Fast-Forwarded to skip');
    sendResponse({ success: true, stats });
  } else if (msg.type === 'DECEPTION_DETECTED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });
    logBlockedEvent(msg.targetDomain || 'external', 'Deceptive Button Target', msg.claimedText);
    sendResponse({ success: true, stats });
  } else if (msg.type === 'GET_STATS') {
    chrome.storage.local.get(['byeads_stats'], (res) => {
      if (res && res.byeads_stats) stats = { ...stats, ...res.byeads_stats };
      sendResponse({ stats });
    });
    return true;
  } else if (msg.type === 'GET_LOGS') {
    sendResponse({ logs: recentLogs });
    return true;
  } else if (msg.type === 'RESET_STATS') {
    stats = { adsBlocked: 0, mediaAdsBlocked: 0, blockedDownloads: 0, threatsDetected: 0, lastUpdated: Date.now() };
    recentLogs.length = 0;
    chrome.storage.local.set({ byeads_stats: stats }, () => {
      sendResponse({ success: true, stats });
    });
    return true;
  }
});
