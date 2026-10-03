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

// Map of tabId -> number of threats/ads blocked in this tab session
const tabBlockedCounts = {};

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

function updateBadge(targetTabId) {
  if (targetTabId && tabBlockedCounts[targetTabId]) {
    const tabCount = tabBlockedCounts[targetTabId];
    chrome.action.setBadgeText({
      tabId: targetTabId,
      text: tabCount > 999 ? '999+' : String(tabCount)
    });
    chrome.action.setBadgeBackgroundColor({
      tabId: targetTabId,
      color: '#10b981'
    });
  } else {
    const total = (stats.adsBlocked || 0) + (stats.mediaAdsBlocked || 0) + (stats.threatsDetected || 0);
    chrome.action.setBadgeText({ text: total > 0 ? (total > 999 ? '999+' : String(total)) : 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  }
}

// Track active tab changes to update badge
if (chrome.tabs && chrome.tabs.onActivated) {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    updateBadge(activeInfo.tabId);
  });
}

// Clean up tab counts when tab closes or navigates
if (chrome.tabs && chrome.tabs.onRemoved) {
  chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabBlockedCounts[tabId];
  });
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading' && changeInfo.url) {
      tabBlockedCounts[tabId] = 0;
      updateBadge(tabId);
    }
  });
}

// Live DNR Network Ad Blocker Listener (records every matched rule)
if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
    stats.adsBlocked = (stats.adsBlocked || 0) + 1;
    chrome.storage.local.set({ byeads_stats: stats });

    const tabId = info.request ? info.request.tabId : null;
    if (tabId && tabId > 0) {
      tabBlockedCounts[tabId] = (tabBlockedCounts[tabId] || 0) + 1;
      updateBadge(tabId);
    } else {
      updateBadge();
    }

    try {
      const u = new URL(info.request?.url || '');
      logBlockedEvent(u.hostname, 'DNR Network Ad Blocked', `Rule ID ${info.rule?.ruleId || 'DNR'}`);
    } catch {
      logBlockedEvent('ad-network', 'DNR Network Ad Blocked', 'Ad Request Dropped');
    }
  });
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

// Trusted identity, login, and checkout providers permitted to open popup tabs
const TRUSTED_AUTH_GATEWAYS = [
  'accounts.google.com', 'appleid.apple.com', 'github.com', 'login.microsoftonline.com',
  'facebook.com', 'twitter.com', 'x.com', 'paypal.com', 'stripe.com', 'discord.com',
  'checkout.stripe.com', 'pay.google.com', 'auth0.com', 'amazon.com', 'steamcommunity.com'
];

function isTrustedAuthHost(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase().replace(/^www\./, '');
  return TRUSTED_AUTH_GATEWAYS.some(t => h === t || h.endsWith('.' + t));
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
  'onclick', 'click_id=', 'camp_id=', 'aff_id=', 'affid=', 'zoneid=', 'direct-link',
  'redirect-jump', 'adkeeper', 'adserver', 'infolinks', 'terraclicks', 'propellerclick',
  'linkbucks', 'adf.ly', 'ouo.io', 'richpush', 'a-ads', 'voluumtrk', 'redtrack', 'bemob',
  'aniview', 'vdo.ai', 'connatix', 'playwire', 'brid.tv', 'primis', 'teads', 'evadav',
  'rollerads', 'clickaine'
];

function isAdOrPopupUrl(url) {
  if (!url) return false;
  const lower = String(url).toLowerCase();
  if (lower.startsWith('chrome://') || lower.startsWith('about:') || lower.startsWith('edge://')) {
    return false;
  }
  return POPUP_AD_PATTERNS.some(d => lower.includes(d));
}

// Evaluate whether a spawned tab is an unsolicited popup
async function evaluatePopupTab(tabId, targetUrlStr, openerTabId) {
  if (!targetUrlStr || !openerTabId) return;

  // 1. Direct ad pattern match
  if (isAdOrPopupUrl(targetUrlStr)) {
    chrome.tabs.remove(tabId, () => {
      stats.adsBlocked = (stats.adsBlocked || 0) + 1;
      chrome.storage.local.set({ byeads_stats: stats });
      updateBadge();
      logBlockedEvent('popup-killer', 'Blocked Ad Popup Tab', targetUrlStr);
    });
    return;
  }

  // 2. Cross-domain origin inspection
  if (targetUrlStr.startsWith('http://') || targetUrlStr.startsWith('https://')) {
    try {
      const opener = await chrome.tabs.get(openerTabId);
      if (!opener || !opener.url) return;

      const openerUrl = new URL(opener.url);
      if (openerUrl.protocol.startsWith('chrome') || openerUrl.protocol.startsWith('about')) return;

      const openerHost = openerUrl.hostname.replace(/^www\./, '');
      const targetUrl = new URL(targetUrlStr);
      const targetHost = targetUrl.hostname.replace(/^www\./, '');

      const isSameDomain = targetHost === openerHost || targetHost.endsWith('.' + openerHost) || openerHost.endsWith('.' + targetHost);

      // If opening an unverified third-party cross-origin domain
      if (!isSameDomain && !isTrustedAuthHost(targetHost)) {
        if (isAdOrPopupUrl(targetHost) || isAdOrPopupUrl(targetUrlStr)) {
          chrome.tabs.remove(tabId, () => {
            stats.adsBlocked = (stats.adsBlocked || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            updateBadge();
            logBlockedEvent('popup-killer', 'Blocked Cross-Origin Ad Popup Tab', targetHost);
          });
        }
      }
    } catch {}
  }
}

if (chrome.tabs && chrome.tabs.onCreated) {
  chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res.byeads_enabled === false) return;
      if (tab.openerTabId) {
        const targetUrl = tab.pendingUrl || tab.url || '';
        evaluatePopupTab(tab.id, targetUrl, tab.openerTabId);
      }
    });
  });
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      if (res.byeads_enabled === false) return;
      if (changeInfo.url && tab.openerTabId) {
        evaluatePopupTab(tabId, changeInfo.url, tab.openerTabId);
      }
    });
  });
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const senderTabId = sender?.tab?.id || msg.tabId;

  if (msg.type === 'INCREMENT_TAB_STATS') {
    const addCount = Number(msg.count) || 1;
    if (senderTabId && senderTabId > 0) {
      tabBlockedCounts[senderTabId] = (tabBlockedCounts[senderTabId] || 0) + addCount;
      updateBadge(senderTabId);
    } else {
      updateBadge();
    }
    stats.adsBlocked = (stats.adsBlocked || 0) + addCount;
    if (msg.category === 'spotify-ad' || msg.site === 'spotify.com') {
      stats.mediaAdsBlocked = (stats.mediaAdsBlocked || 0) + addCount;
    }
    chrome.storage.local.set({ byeads_stats: stats });
    logBlockedEvent(msg.site || msg.domain || 'active-tab', msg.category || 'Threat Blocked', `Count +${addCount}`);
    sendResponse({ success: true, count: senderTabId ? tabBlockedCounts[senderTabId] : stats.adsBlocked });
    return true;
  } else if (msg.type === 'GET_TAB_STATS') {
    const targetId = msg.tabId || senderTabId;
    const count = (targetId && tabBlockedCounts[targetId]) || 0;
    sendResponse({ count });
    return true;
  } else if (msg.type === 'MEDIA_AD_BLOCKED') {
    const addCount = Number(msg.count) || 1;
    stats.mediaAdsBlocked = (stats.mediaAdsBlocked || 0) + addCount;
    stats.adsBlocked = (stats.adsBlocked || 0) + addCount;
    if (senderTabId && senderTabId > 0) {
      tabBlockedCounts[senderTabId] = (tabBlockedCounts[senderTabId] || 0) + addCount;
      updateBadge(senderTabId);
    } else {
      updateBadge();
    }
    chrome.storage.local.set({ byeads_stats: stats });
    const siteName = msg.site || (sender?.tab?.url ? new URL(sender.tab.url).hostname : 'Media Stream');
    logBlockedEvent(siteName, 'In-Stream Media Ad Defused', 'Muted & skipped automatically');
    sendResponse({ success: true, stats, tabCount: senderTabId ? tabBlockedCounts[senderTabId] : undefined });
    return true;
  } else if (msg.type === 'DECEPTION_DETECTED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    if (senderTabId && senderTabId > 0) {
      tabBlockedCounts[senderTabId] = (tabBlockedCounts[senderTabId] || 0) + 1;
      updateBadge(senderTabId);
    }
    chrome.storage.local.set({ byeads_stats: stats });
    chrome.action.setBadgeText({ text: 'WARN' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
    logBlockedEvent(msg.targetDomain || 'external', 'Deceptive Button Target', msg.claimedText);
    sendResponse({ success: true, stats });
    return true;
  } else if (msg.type === 'CLICKJACK_NEUTRALIZED') {
    stats.threatsDetected = (stats.threatsDetected || 0) + 1;
    if (senderTabId && senderTabId > 0) {
      tabBlockedCounts[senderTabId] = (tabBlockedCounts[senderTabId] || 0) + 1;
      updateBadge(senderTabId);
    } else {
      updateBadge();
    }
    chrome.storage.local.set({ byeads_stats: stats });
    logBlockedEvent(msg.domain || 'page', 'Clickjack Overlay Trapped', 'Removed transparent intercepting overlay');
    sendResponse({ success: true, stats });
    return true;
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
    Object.keys(tabBlockedCounts).forEach((k) => delete tabBlockedCounts[k]);
    chrome.storage.local.set({ byeads_stats: stats }, () => {
      updateBadge();
      sendResponse({ success: true, stats });
    });
    return true;
  }
});
