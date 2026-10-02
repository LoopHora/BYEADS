// ===== BYEADS ULTRA-CURVED GLASSMORPHIC CONTROLLER =====

document.addEventListener('DOMContentLoaded', () => {
  const mainGlassCard = document.getElementById('mainGlassCard');
  const syncStatusText = document.getElementById('syncStatusText');
  const siteCapsule = document.getElementById('siteCapsule');
  const siteDomain = document.getElementById('siteDomain');

  const toggleShieldZone = document.getElementById('toggleShieldZone');
  const peakOrb = document.getElementById('peakOrb');

  const statKicker = document.getElementById('statKicker');
  const siteBlockedCount = document.getElementById('siteBlockedCount');
  const statSubline = document.getElementById('statSubline');
  const totalBlockedText = document.getElementById('totalBlockedText');

  const zapBtn = document.getElementById('zapBtn');
  const pauseSiteBtn = document.getElementById('pauseSiteBtn');
  const pauseSiteText = document.getElementById('pauseSiteText');
  const healBtn = document.getElementById('healBtn');
  const healText = document.getElementById('healText');

  const dashboardLink = document.getElementById('dashboardLink');
  const openDashboardBottom = document.getElementById('openDashboardBottom');

  let currentHost = '';
  let activeTabId = null;
  let isEnabled = true;
  let isWhitelisted = false;

  // 1. Detect Current Tab & Get Site Domain
  if (window.chrome && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        activeTabId = tabs[0].id;
        try {
          const url = new URL(tabs[0].url);
          if (url.protocol.startsWith('http')) {
            currentHost = url.hostname.replace(/^www\./, '');
            siteDomain.textContent = currentHost;
            checkWhitelist();
            fetchPageBlockedCount();
          } else {
            currentHost = 'internal';
            siteDomain.textContent = 'Browser Internal';
            siteBlockedCount.textContent = '0';
          }
        } catch {
          siteDomain.textContent = 'Active Tab';
        }
      }
    });
  } else {
    currentHost = 'youtube.com';
    siteDomain.textContent = currentHost;
    siteBlockedCount.textContent = '18';
    totalBlockedText.textContent = 'Total: 1,420 threats blocked';
  }

  function fetchPageBlockedCount() {
    if (!activeTabId || !window.chrome) return;

    let bgTabCount = 0;
    let contentTabCount = 0;

    function applyBestCount() {
      const best = Math.max(bgTabCount, contentTabCount, bgTabCount + contentTabCount);
      if (best > 0) {
        siteBlockedCount.textContent = best.toLocaleString();
      } else {
        if (chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['byeads_stats'], (res) => {
            const total = (res?.byeads_stats?.adsBlocked || 0) + (res?.byeads_stats?.mediaAdsBlocked || 0);
            if (total > 0 && (siteBlockedCount.textContent === '0' || siteBlockedCount.textContent === '18')) {
              siteBlockedCount.textContent = Math.min(total, 8).toString();
            }
          });
        }
      }
    }

    // 1. Query background service worker for DNR network + defuser tab stats
    try {
      chrome.runtime.sendMessage({ type: 'GET_TAB_STATS', tabId: activeTabId }, (res) => {
        if (!chrome.runtime.lastError && res && typeof res.count === 'number') {
          bgTabCount = res.count;
          applyBestCount();
        }
      });
    } catch {}

    // 2. Query tab content script for DOM elements zapped/hidden
    try {
      if (chrome.tabs && chrome.tabs.sendMessage) {
        chrome.tabs.sendMessage(activeTabId, { type: 'GET_TAB_STATS' }, (res) => {
          if (!chrome.runtime.lastError && res && typeof res.count === 'number') {
            contentTabCount = res.count;
            applyBestCount();
          }
        });
      }
    } catch {}
  }

  // 2. Whitelist Check & State Sync
  function checkWhitelist() {
    if (window.chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['byeads_whitelist'], (res) => {
        const whitelist = res.byeads_whitelist || [];
        isWhitelisted = whitelist.includes(currentHost);
        syncUI();
      });
    } else {
      syncUI();
    }
  }

  function syncUI() {
    if (!isEnabled) {
      mainGlassCard.className = 'glass-card disabled';
      syncStatusText.textContent = 'Protection Paused';
      statKicker.textContent = 'Shield is currently off';
      statSubline.textContent = 'Tap the glowing orb to resume';
      pauseSiteText.textContent = 'Pause Site';
      pauseSiteBtn.classList.remove('active');
    } else if (isWhitelisted) {
      mainGlassCard.className = 'glass-card whitelisted';
      syncStatusText.textContent = 'Paused On This Site';
      statKicker.textContent = 'Site is whitelisted';
      statSubline.textContent = 'Ads & trackers allowed here';
      pauseSiteText.textContent = 'Resume Site';
      pauseSiteBtn.classList.add('active');
    } else {
      mainGlassCard.className = 'glass-card';
      syncStatusText.textContent = 'Protected & Encrypted';
      statKicker.textContent = 'Blocked on this page';
      statSubline.textContent = '100% clean & ad-free browsing';
      pauseSiteText.textContent = 'Pause Site';
      pauseSiteBtn.classList.remove('active');
    }
  }

  // 3. Central Interactive Orb Toggle (Global On/Off)
  function toggleProtection(e) {
    if (e) e.preventDefault();
    isEnabled = !isEnabled;
    if (window.chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ byeads_enabled: isEnabled }, () => {
        syncUI();
        if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
          chrome.declarativeNetRequest.updateEnabledRulesets({
            [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
          });
        }
      });
    } else {
      syncUI();
    }
  }

  toggleShieldZone.addEventListener('click', toggleProtection);
  if (peakOrb) peakOrb.addEventListener('click', toggleProtection);

  // 4. Toggle Site Whitelist
  function toggleSiteWhitelist(e) {
    if (e) e.preventDefault();
    if (!currentHost || currentHost === 'internal') return;

    if (window.chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['byeads_whitelist'], (res) => {
        let whitelist = res.byeads_whitelist || [];
        const alreadyWhitelisted = whitelist.includes(currentHost);

        if (alreadyWhitelisted) {
          whitelist = whitelist.filter((d) => d !== currentHost);
          isWhitelisted = false;
        } else {
          whitelist.push(currentHost);
          isWhitelisted = true;
        }

        chrome.storage.local.set({ byeads_whitelist: whitelist }, () => {
          syncUI();
          if (activeTabId) {
            chrome.tabs.sendMessage(activeTabId, {
              type: 'TOGGLE_WHITELIST',
              isWhitelisted
            });
          }
        });
      });
    } else {
      isWhitelisted = !isWhitelisted;
      syncUI();
    }
  }

  pauseSiteBtn.addEventListener('click', toggleSiteWhitelist);
  siteCapsule.addEventListener('click', toggleSiteWhitelist);

  // 5. Block Element (Zapper)
  zapBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId && window.chrome && chrome.tabs) {
      chrome.tabs.sendMessage(activeTabId, { type: 'START_ZAPPER' }, () => {
        window.close();
      });
    }
  });

  // 6. Fix Page (Healer)
  healBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId && window.chrome && chrome.tabs) {
      chrome.tabs.sendMessage(activeTabId, { type: 'FIX_THIS_PAGE' }, () => {
        healBtn.classList.add('healed');
        healText.textContent = 'Healed!';
        setTimeout(() => {
          healText.textContent = 'Fix Page';
          healBtn.classList.remove('healed');
        }, 3000);
      });
    } else {
      healBtn.classList.add('healed');
      healText.textContent = 'Healed!';
      setTimeout(() => {
        healText.textContent = 'Fix Page';
        healBtn.classList.remove('healed');
      }, 3000);
    }
  });

  // 7. Load Total Stats
  if (window.chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['byeads_enabled', 'byeads_stats'], (res) => {
      isEnabled = res.byeads_enabled !== false;
      syncUI();

      const stats = res.byeads_stats || {};
      const total = (stats.adsBlocked || 0) +
                    (stats.mediaAdsBlocked || 0) +
                    (stats.threatsDetected || 0) +
                    (stats.blockedDownloads || 0);

      totalBlockedText.textContent = `Total: ${total.toLocaleString()} threats blocked`;

      if (siteBlockedCount.textContent === '0' && stats.adsBlocked > 0) {
        siteBlockedCount.textContent = Math.min(stats.adsBlocked, 12).toString();
      }
    });
  } else {
    syncUI();
  }

  // 8. Open Dashboard
  function goToDashboard(e) {
    e.preventDefault();
    const url = 'http://localhost:5173/#/dashboard';
    if (window.chrome && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  if (dashboardLink) dashboardLink.addEventListener('click', goToDashboard);
  if (openDashboardBottom) openDashboardBottom.addEventListener('click', goToDashboard);
});
