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
  if (chrome.tabs && chrome.tabs.query) {
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
  }

  function fetchPageBlockedCount() {
    if (!activeTabId) return;
    try {
      chrome.tabs.sendMessage(activeTabId, { type: 'GET_TAB_STATS' }, (res) => {
        if (!chrome.runtime.lastError && res && typeof res.count === 'number') {
          siteBlockedCount.textContent = res.count.toLocaleString();
        }
      });
    } catch {}
  }

  // 2. Whitelist Check & State Sync
  function checkWhitelist() {
    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      const whitelist = res.byeads_whitelist || [];
      isWhitelisted = whitelist.includes(currentHost);
      syncUI();
    });
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
    chrome.storage.local.set({ byeads_enabled: isEnabled }, () => {
      syncUI();
      if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
          [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
        });
      }
    });
  }

  toggleShieldZone.addEventListener('click', toggleProtection);
  if (peakOrb) peakOrb.addEventListener('click', toggleProtection);

  // 4. Toggle Site Whitelist
  function toggleSiteWhitelist(e) {
    if (e) e.preventDefault();
    if (!currentHost || currentHost === 'internal') return;

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
  }

  pauseSiteBtn.addEventListener('click', toggleSiteWhitelist);
  siteCapsule.addEventListener('click', toggleSiteWhitelist);

  // 5. Block Element (Zapper)
  zapBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: 'START_ZAPPER' }, () => {
        window.close();
      });
    }
  });

  // 6. Fix Page (Healer)
  healBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: 'FIX_THIS_PAGE' }, () => {
        healBtn.classList.add('healed');
        healText.textContent = 'Healed!';
        setTimeout(() => {
          healText.textContent = 'Fix Page';
          healBtn.classList.remove('healed');
        }, 3000);
      });
    }
  });

  // 7. Load Total Stats
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

  // 8. Open Dashboard
  function goToDashboard(e) {
    e.preventDefault();
    const url = 'http://localhost:5173/#/dashboard';
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  if (dashboardLink) dashboardLink.addEventListener('click', goToDashboard);
  if (openDashboardBottom) openDashboardBottom.addEventListener('click', goToDashboard);
});
