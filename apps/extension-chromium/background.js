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

// Circular memory buffer for live network traffic logger (last 60 events)
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

// Initialize persistent storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(
    ['byeads_stats', 'byeads_enabled', 'byeads_whitelist', 'byeads_web_shield', 'byeads_media_shield', 'byeads_deception_shield'],
    (res) => {
      if (!res.byeads_stats) {
        chrome.storage.local.set({ byeads_stats: stats });
      } else {
        stats = { ...stats, ...res.byeads_stats };
      }
      if (res.byeads_enabled === undefined) chrome.storage.local.set({ byeads_enabled: true });
      if (!res.byeads_whitelist) chrome.storage.local.set({ byeads_whitelist: [] });
      if (res.byeads_web_shield === undefined) chrome.storage.local.set({ byeads_web_shield: true });
      if (res.byeads_media_shield === undefined) chrome.storage.local.set({ byeads_media_shield: true });
      if (res.byeads_deception_shield === undefined) chrome.storage.local.set({ byeads_deception_shield: true });
      updateBadge();
    }
  );
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

        // Flag double extension deception
        if (DANGEROUS_EXTS.has(realExt) && DOC_EXTS.has(fakeExt)) {
          console.warn(`[BYEADS] Deception detected! Cancelling deceptive download: ${filename}`);
          chrome.downloads.cancel(item.id, () => {
            stats.blockedDownloads = (stats.blockedDownloads || 0) + 1;
            stats.threatsDetected = (stats.threatsDetected || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
            logBlockedEvent('download', 'Deceptive File (.pdf.exe)', filename);
          });
        }
      }
    });
  });
}

// Pop-up Tab & Unsolicited Redirect Killer
const POPUP_AD_PATTERNS = [
  'popads', 'popcash', 'propeller', 'adsterra', 'exoclick', 'monetag', 'hilltopads',
  'adcash', 'onclickads', 'trafficjunky', 'juicyads', 'exdynsrv', 'exosrv', 'realsrv',
  'rtmark', 'doublepimp', 'traffichaus', 'clickadu', 'yllix', 'bidvertiser', 'admaven',
  'ad-maven', 'deloton', 'tsyndicate', 'zeroredirect', 'alwingulla', 'onclickperformance',
  'popunder', 'trafficstars', 'plugrush', 'popmyads', 'directrev', 'adnetworkperformance',
  'clck.ru', 'adnxs', 'criteo', 'taboola', 'outbrain', 'mgid', 'revcontent', 'doubleclick',
  'googlesyndication', 'adservice.google', 'googleadservices', 'smartadserver', 'rubiconproject',
  'pubmatic', 'openx', 'casalemedia', 'bet365', '1xbet', 'vulkan', 'parimatch', 'spinanga',
  'onclick', 'click_id=', 'camp_id=', 'aff_id=', 'direct-link', 'redirect-jump'
];

function isAdOrPopupUrl(url) {
  if (!url) return false;
  const lower = String(url).toLowerCase();
  if (lower.startsWith('chrome://') || lower.startsWith('about:') || lower.startsWith('edge://')) {
    return false;
  }
  return POPUP_AD_PATTERNS.some(d => lower.includes(d));
}

if (chrome.tabs && chrome.tabs.onCreated) {
  chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res.byeads_enabled === false) return;

      if (tab.openerTabId) {
        const targetUrl = tab.pendingUrl || tab.url || '';
        if (isAdOrPopupUrl(targetUrl)) {
          chrome.tabs.remove(tab.id, () => {
            stats.adsBlocked = (stats.adsBlocked || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            updateBadge();
            logBlockedEvent('popup-killer', 'Blocked Unsolicited Popup Tab', targetUrl);
          });
        }
      }
    });
  });
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res.byeads_enabled === false) return;

      if (changeInfo.url && tab.openerTabId) {
        if (isAdOrPopupUrl(changeInfo.url)) {
          chrome.tabs.remove(tabId, () => {
            stats.adsBlocked = (stats.adsBlocked || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            updateBadge();
            logBlockedEvent('popup-killer', 'Closed Popunder Redirect Tab', changeInfo.url);
          });
        }
      }
    });
  });
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'MEDIA_AD_BLOCKED') {
    stats.mediaAdsBlocked = (stats.mediaAdsBlocked || 0) + (msg.count || 1);
    stats.adsBlocked = (stats.adsBlocked || 0) + (msg.count || 1);
    chrome.storage.local.set({ byeads_stats: stats });
    updateBadge();
    logBlockedEvent(msg.site || 'youtube.com', 'YouTube In-Stream Ad', 'Muted & Fast-Forwarded to skip');
    sendResponse({ success: true, stats });
  } else if (msg.type === 'DECEPTION_DETECTED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });
    chrome.action.setBadgeText({ text: 'WARN' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
    logBlockedEvent(msg.targetDomain || 'external', 'Deceptive Button Target', msg.claimedText);
    sendResponse({ success: true, stats });
  } else if (msg.type === 'CLICKJACK_NEUTRALIZED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });
    updateBadge();
    logBlockedEvent(msg.domain || 'page', 'Clickjack Overlay Trapped', 'Removed transparent intercepting overlay');
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
      updateBadge();
      sendResponse({ success: true, stats });
    });
    return true;
  }
});
