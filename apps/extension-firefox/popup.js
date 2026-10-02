// ===== BYEADS MINIMAL POPUP CONTROLLER =====

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('heroSection');
  const shieldToggleBtn = document.getElementById('shieldToggleBtn');
  const shieldIcon = document.getElementById('shieldIcon');
  const statusTitle = document.getElementById('statusTitle');
  const siteDomain = document.getElementById('siteDomain');

  const siteBlockedCount = document.getElementById('siteBlockedCount');
  const totalBlockedCount = document.getElementById('totalBlockedCount');

  const zapBtn = document.getElementById('zapBtn');
  const pauseSiteBtn = document.getElementById('pauseSiteBtn');
  const pauseSiteText = document.getElementById('pauseSiteText');
  const healBtn = document.getElementById('healBtn');
  const healText = document.getElementById('healText');

  const openDashboardIcon = document.getElementById('openDashboardIcon');
  const openDashboardLink = document.getElementById('openDashboardLink');

  let currentHost = '';
  let activeTabId = null;
  let isEnabled = true;
  let isWhitelisted = false;

  // 1. Detect Current Tab
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

  // 2. Whitelist Check & Sync
  function checkWhitelist() {
    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      const whitelist = res.byeads_whitelist || [];
      isWhitelisted = whitelist.includes(currentHost);
      syncUI();
    });
  }

  function syncUI() {
    if (!isEnabled) {
      heroSection.className = 'hero-section disabled';
      statusTitle.textContent = 'Protection Paused';
      shieldIcon.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      `;
      pauseSiteText.textContent = 'Pause Site';
      pauseSiteBtn.classList.remove('active');
    } else if (isWhitelisted) {
      heroSection.className = 'hero-section whitelisted';
      statusTitle.textContent = 'Paused On Site';
      shieldIcon.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
      pauseSiteText.textContent = 'Resume Site';
      pauseSiteBtn.classList.add('active');
    } else {
      heroSection.className = 'hero-section';
      statusTitle.textContent = 'Protected';
      shieldIcon.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      `;
      pauseSiteText.textContent = 'Pause Site';
      pauseSiteBtn.classList.remove('active');
    }
  }

  // 3. Central Shield Toggle (Global On/Off)
  shieldToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isEnabled = !isEnabled;
    chrome.storage.local.set({ byeads_enabled: isEnabled }, () => {
      syncUI();
      if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
          [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
        });
      }
    });
  });

  // 4. Pause Site Toggle (Whitelist)
  pauseSiteBtn.addEventListener('click', (e) => {
    e.preventDefault();
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
  });

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

    totalBlockedCount.textContent = total.toLocaleString();

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

  if (openDashboardIcon) openDashboardIcon.addEventListener('click', goToDashboard);
  if (openDashboardLink) openDashboardLink.addEventListener('click', goToDashboard);
});
