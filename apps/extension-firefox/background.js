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
  "*://*.monetag.com/*",
  "*://*.hilltopads.com/*",
  "*://*.hilltopads.net/*",
  "*://*.exoclick.com/*",
  "*://*.exdynsrv.com/*",
  "*://*.exosrv.com/*",
  "*://*.realsrv.com/*",
  "*://*.rtmark.net/*",
  "*://*.doublepimp.com/*",
  "*://*.traffichaus.com/*",
  "*://*.trafficjunky.com/*",
  "*://*.trafficjunky.net/*",
  "*://*.juicyads.com/*",
  "*://*.clickadu.com/*",
  "*://*.yllix.com/*",
  "*://*.bidvertiser.com/*",
  "*://*.admaven.com/*",
  "*://*.ad-maven.com/*",
  "*://*.deloton.com/*",
  "*://*.zeroredirect.com/*",
  "*://*.alwingulla.com/*",
  "*://*.onclickperformance.com/*",
  "*://*.popunder.net/*",
  "*://*.popmyads.com/*",
  "*://*.trafficstars.com/*",
  "*://*.plugrush.com/*",
  "*://*.directrev.com/*",
  "*://*.adnetworkperformance.com/*",
  "*://*.clck.ru/*",
  "*://*.bet365.com/*",
  "*://*.1xbet.com/*",
  "*://*.vulkanvegas.com/*",
  "*://*.spinanga.com/*",
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
  if (lower.startsWith('chrome://') || lower.startsWith('about:') || lower.startsWith('moz-extension://')) {
    return false;
  }
  return POPUP_AD_PATTERNS.some(d => lower.includes(d));
}

if (chrome.tabs && chrome.tabs.onCreated) {
  chrome.tabs.onCreated.addListener((tab) => {
    if (tab.openerTabId) {
      const targetUrl = tab.url || tab.title || '';
      if (isAdOrPopupUrl(targetUrl)) {
        chrome.tabs.remove(tab.id, () => {
          stats.adsBlocked = (stats.adsBlocked || 0) + 1;
          chrome.storage.local.set({ byeads_stats: stats });
          logBlockedEvent('popup-killer', 'Blocked Unsolicited Popup Tab', targetUrl);
        });
      }
    }
  });
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.openerTabId) {
      if (isAdOrPopupUrl(changeInfo.url)) {
        chrome.tabs.remove(tabId, () => {
          stats.adsBlocked = (stats.adsBlocked || 0) + 1;
          chrome.storage.local.set({ byeads_stats: stats });
          logBlockedEvent('popup-killer', 'Closed Popunder Redirect Tab', changeInfo.url);
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
  } else if (msg.type === 'CLICKJACK_NEUTRALIZED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });
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
      sendResponse({ success: true, stats });
    });
    return true;
  }
});
