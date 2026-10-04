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
  "*://*.hiibel.com/*",
  "*://*.gpcasla.org/*",
  "*://*.histats.com/*",
  "*://*.applejr.xyz/*",
  "*://*.youtube.com/api/stats/ads*",
  "*://*.youtube.com/pagead/*",
  "*://*.youtube.com/ptracking*",
  "*://*.music.youtube.com/api/stats/ads*",
  "*://*.googleads.g.doubleclick.net/pagead/*",
  "*://*.adeventtracker.spotify.com/*",
  "*://*.ads-fa.spotify.com/*",
  "*://*.adstudio-assets.scdn.co/*",
  "*://*.adstudio-assets.spotifycdn.com/*",
  "*://*.scdn.co/mp3-ad/*",
  "*://spclient.wg.spotify.com/ad-logic/*",
  "*://spclient.wg.spotify.com/ads/*",
  "*://spclient.wg.spotify.com/desktop-omni-ads/*",
  "*://spclient.wg.spotify.com/ad-experiences/*"
];

let stats = {
  adsBlocked: 0,
  mediaAdsBlocked: 0,
  blockedDownloads: 0,
  threatsDetected: 0,
  lastUpdated: Date.now()
};

const tabBlockedCounts = {};
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

function updateBadge(targetTabId) {
  const badgeObj = chrome.browserAction || chrome.action;
  if (!badgeObj) return;

  if (targetTabId && tabBlockedCounts[targetTabId]) {
    const tabCount = tabBlockedCounts[targetTabId];
    badgeObj.setBadgeText({
      tabId: targetTabId,
      text: tabCount > 999 ? '999+' : String(tabCount)
    });
    badgeObj.setBadgeBackgroundColor({
      tabId: targetTabId,
      color: '#10b981'
    });
  } else {
    const total = (stats.adsBlocked || 0) + (stats.mediaAdsBlocked || 0) + (stats.threatsDetected || 0);
    badgeObj.setBadgeText({ text: total > 0 ? (total > 999 ? '999+' : String(total)) : 'ON' });
    badgeObj.setBadgeBackgroundColor({ color: '#10b981' });
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

// WebRequest blocking filter
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      stats.adsBlocked++;
      if (details.tabId && details.tabId > 0) {
        tabBlockedCounts[details.tabId] = (tabBlockedCounts[details.tabId] || 0) + 1;
        updateBadge(details.tabId);
      } else {
        updateBadge();
      }
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
  'rollerads', 'clickaine', 'hiibel', 'gpcasla', 'applejr.xyz', 'open-download', 'histats',
  'puclc', 'purs?', 'transplayer', 'transplink'
];

function isAdOrPopupUrl(url) {
  if (!url) return false;
  const lower = String(url).toLowerCase();
  if (lower.startsWith('chrome://') || lower.startsWith('about:') || lower.startsWith('moz-extension://')) {
    return false;
  }
  return POPUP_AD_PATTERNS.some(d => lower.includes(d));
}

async function evaluatePopupTab(tabId, targetUrlStr, openerTabId) {
  if (!targetUrlStr) return;

  const lower = String(targetUrlStr).toLowerCase().trim();

  // 1. Direct ad pattern match (ALWAYS blocks, regardless of openerTabId)
  if (isAdOrPopupUrl(targetUrlStr)) {
    chrome.tabs.remove(tabId, () => {
      stats.adsBlocked = (stats.adsBlocked || 0) + 1;
      chrome.storage.local.set({ byeads_stats: stats });
      updateBadge();
      logBlockedEvent('popup-killer', 'Blocked Ad Popup Tab', targetUrlStr);
    });
    return;
  }

  // 2. Block blank / synthetic staging tabs IF opened from another tab (popunder setup phase)
  if (openerTabId && (lower === '' || lower === 'about:blank' || lower.startsWith('data:text/html') || lower === 'about:blank#blocked')) {
    chrome.tabs.remove(tabId, () => {
      stats.adsBlocked = (stats.adsBlocked || 0) + 1;
      chrome.storage.local.set({ byeads_stats: stats });
      updateBadge();
      logBlockedEvent('popup-killer', 'Blocked Blank Popunder Staging Tab', targetUrlStr);
    });
    return;
  }

  // 3. Cross-domain origin inspection (aggressive mode)
  if (openerTabId && (targetUrlStr.startsWith('http://') || targetUrlStr.startsWith('https://'))) {
    try {
      const opener = await chrome.tabs.get(openerTabId);
      if (!opener || !opener.url) return;

      const openerUrl = new URL(opener.url);
      if (openerUrl.protocol.startsWith('about') || openerUrl.protocol.startsWith('moz-extension')) return;

      const openerHost = openerUrl.hostname.replace(/^www\./, '');
      const targetUrl = new URL(targetUrlStr);
      const targetHost = targetUrl.hostname.replace(/^www\./, '');

      const isSameDomain = targetHost === openerHost || targetHost.endsWith('.' + openerHost) || openerHost.endsWith('.' + targetHost);

      if (!isSameDomain && !isTrustedAuthHost(targetHost)) {
        if (isAdOrPopupUrl(targetHost) || isAdOrPopupUrl(targetUrlStr)) {
          chrome.tabs.remove(tabId, () => {
            stats.adsBlocked = (stats.adsBlocked || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            updateBadge();
            logBlockedEvent('popup-killer', 'Blocked Cross-Origin Ad Popup Tab', targetHost);
          });
          return;
        }

        // Block cross-origin popups with suspicious redirect query params
        const fullUrl = (targetUrl.pathname + targetUrl.search).toLowerCase();
        const hasRedirectParams = ['zoneid=', 'pop=', 'clickid=', 'aff_id=', 'aff_sub=', 'subid=',
          'token_hash=', 'pub_id=', 'camp_id=', 'aff_c=', 'ad_url=', 'dest_ad=', 'ad_redirect=',
          'tmpl=', 'plk=', 'puclc', 'purs', 'psid=', 'flb=', 'ibid=', 'bv=']
          .some(p => fullUrl.includes(p));
        const hasRedirectPath = ['/jump', '/go/', '/out/', '/redirect', '/click', '/pop', '/ad/', '/gate/',
          '/jump.php', '/go.php', '/pop.php', '/click.php', '/direct-link', '/open-download']
          .some(p => fullUrl.includes(p));

        if (hasRedirectParams || hasRedirectPath) {
          chrome.tabs.remove(tabId, () => {
            stats.adsBlocked = (stats.adsBlocked || 0) + 1;
            chrome.storage.local.set({ byeads_stats: stats });
            updateBadge();
            logBlockedEvent('popup-killer', 'Blocked Redirect Popup Tab', targetUrlStr);
          });
          return;
        }
      }
    } catch {}
  }
}

if (chrome.tabs && chrome.tabs.onCreated) {
  chrome.tabs.onCreated.addListener(async (tab) => {
    chrome.storage.local.get(['byeads_enabled'], async (res) => {
      if (res.byeads_enabled === false) return;
      const targetUrl = tab.url || tab.title || '';
      let openerId = tab.openerTabId;
      if (!openerId) {
        try {
          const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          if (activeTab && activeTab.id !== tab.id) {
            openerId = activeTab.id;
          }
        } catch {}
      }
      evaluatePopupTab(tab.id, targetUrl, openerId);
    });
  });
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    chrome.storage.local.get(['byeads_enabled'], async (res) => {
      if (res.byeads_enabled === false) return;
      if (changeInfo.url) {
        let openerId = tab.openerTabId;
        if (!openerId) {
          try {
            const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (activeTab && activeTab.id !== tabId) {
              openerId = activeTab.id;
            }
          } catch {}
        }
        evaluatePopupTab(tabId, changeInfo.url, openerId);
      }
    });
  });
}

// Message listener for in-page detections & stats
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
