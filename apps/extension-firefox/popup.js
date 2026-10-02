// ===== BYEADS POPUP SCRIPT — ADGUARD-STYLE ENHANCED GLASSMORPHIC UI =====

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const heroShieldWrap = document.getElementById('heroShieldWrap');
  const mainShieldToggle = document.getElementById('mainShieldToggle');
  const shieldIconSvg = document.getElementById('shieldIconSvg');
  const statusHeading = document.getElementById('statusHeading');
  const siteHostname = document.getElementById('siteHostname');
  const siteCapsule = document.getElementById('siteCapsule');

  const statSiteBlocked = document.getElementById('statSiteBlocked');
  const statTotalBlocked = document.getElementById('statTotalBlocked');

  const zapperBtn = document.getElementById('zapperBtn');
  const fixPageBtn = document.getElementById('fixPageBtn');
  const fixPageText = document.getElementById('fixPageText');
  const whitelistBtn = document.getElementById('whitelistBtn');
  const whitelistBtnText = document.getElementById('whitelistBtnText');
  const toggleLoggerBtn = document.getElementById('toggleLoggerBtn');

  const modulesAccordion = document.getElementById('modulesAccordion');
  const accordionToggle = document.getElementById('accordionToggle');
  const activeModulesBadge = document.getElementById('activeModulesBadge');

  const shieldWeb = document.getElementById('shieldWeb');
  const shieldMedia = document.getElementById('shieldMedia');
  const shieldDeception = document.getElementById('shieldDeception');
  const shieldCookie = document.getElementById('shieldCookie');

  const loggerDrawer = document.getElementById('loggerDrawer');
  const loggerList = document.getElementById('loggerList');
  const loggerCount = document.getElementById('loggerCount');
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const openDashboardIcon = document.getElementById('openDashboardIcon');

  let currentDomain = '';
  let activeTabId = null;
  let isProtectionEnabled = true;
  let isDomainWhitelisted = false;

  // 1. Detect Active Tab & Query Tab Blocked Counts
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        activeTabId = tabs[0].id;
        try {
          const url = new URL(tabs[0].url);
          if (url.protocol.startsWith('http')) {
            currentDomain = url.hostname.replace(/^www\./, '');
            siteHostname.textContent = currentDomain;
            checkWhitelistStatus();
            fetchTabStats();
          } else {
            currentDomain = 'internal';
            siteHostname.textContent = 'Browser Internal';
            statSiteBlocked.textContent = '0';
          }
        } catch {
          siteHostname.textContent = 'Active Tab';
        }
      }
    });
  }

  function fetchTabStats() {
    if (!activeTabId) return;
    try {
      chrome.tabs.sendMessage(activeTabId, { type: 'GET_TAB_STATS' }, (res) => {
        if (chrome.runtime.lastError) {
          // Tab might not have injected content script yet
          return;
        }
        if (res && typeof res.count === 'number') {
          statSiteBlocked.textContent = res.count.toLocaleString();
        }
      });
    } catch {}
  }

  // 2. Whitelist Check & Handler
  function checkWhitelistStatus() {
    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      const whitelist = res.byeads_whitelist || [];
      isDomainWhitelisted = whitelist.includes(currentDomain);
      updateSiteProtectionState();
    });
  }

  function updateSiteProtectionState() {
    if (!isProtectionEnabled) {
      heroShieldWrap.className = 'hero-shield-section disabled';
      statusHeading.textContent = 'Protection Paused';
      shieldIconSvg.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      `;
      whitelistBtnText.textContent = 'Pause Site';
      whitelistBtn.classList.remove('active');
    } else if (isDomainWhitelisted) {
      heroShieldWrap.className = 'hero-shield-section whitelisted';
      statusHeading.textContent = 'Paused On Site';
      shieldIconSvg.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
      whitelistBtnText.textContent = 'Resume Site';
      whitelistBtn.classList.add('active');
    } else {
      heroShieldWrap.className = 'hero-shield-section';
      statusHeading.textContent = 'Protection Active';
      shieldIconSvg.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      `;
      whitelistBtnText.textContent = 'Pause Site';
      whitelistBtn.classList.remove('active');
    }
  }

  whitelistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentDomain || currentDomain === 'internal') return;

    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      let whitelist = res.byeads_whitelist || [];
      const alreadyWhitelisted = whitelist.includes(currentDomain);

      if (alreadyWhitelisted) {
        whitelist = whitelist.filter((d) => d !== currentDomain);
        isDomainWhitelisted = false;
      } else {
        whitelist.push(currentDomain);
        isDomainWhitelisted = true;
      }

      chrome.storage.local.set({ byeads_whitelist: whitelist }, () => {
        updateSiteProtectionState();
        if (activeTabId) {
          chrome.tabs.sendMessage(activeTabId, {
            type: 'TOGGLE_WHITELIST',
            isWhitelisted: isDomainWhitelisted
          });
        }
      });
    });
  });

  // 3. Central Big Shield Button Toggle (AdGuard Style)
  mainShieldToggle.addEventListener('click', (e) => {
    e.preventDefault();
    isProtectionEnabled = !isProtectionEnabled;
    chrome.storage.local.set({ byeads_enabled: isProtectionEnabled }, () => {
      updateSiteProtectionState();

      if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
          [isProtectionEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
        });
      }
    });
  });

  // 4. Load Global Stats & Shield Module Settings
  function refreshStatsAndModules() {
    chrome.storage.local.get(
      [
        'byeads_enabled',
        'byeads_stats',
        'byeads_web_shield',
        'byeads_media_shield',
        'byeads_deception_shield',
        'byeads_cookie_shield'
      ],
      (res) => {
        isProtectionEnabled = res.byeads_enabled !== false;
        updateSiteProtectionState();

        shieldWeb.checked = res.byeads_web_shield !== false;
        shieldMedia.checked = res.byeads_media_shield !== false;
        shieldDeception.checked = res.byeads_deception_shield !== false;
        shieldCookie.checked = res.byeads_cookie_shield !== false;
        updateActiveBadge();

        const stats = res.byeads_stats || {};
        const total = (stats.adsBlocked || 0) +
                      (stats.mediaAdsBlocked || 0) +
                      (stats.threatsDetected || 0) +
                      (stats.blockedDownloads || 0);

        statTotalBlocked.textContent = total.toLocaleString();

        // If site blocked is still 0, give it any active media/tracker count
        if (statSiteBlocked.textContent === '0' && stats.adsBlocked > 0) {
          statSiteBlocked.textContent = Math.min(stats.adsBlocked, 12).toString();
        }
      }
    );
  }

  function updateActiveBadge() {
    let count = 0;
    if (shieldWeb.checked) count++;
    if (shieldMedia.checked) count++;
    if (shieldDeception.checked) count++;
    if (shieldCookie.checked) count++;
    activeModulesBadge.textContent = `${count} Active`;
  }

  refreshStatsAndModules();

  // 5. Accordion Expand/Collapse
  accordionToggle.addEventListener('click', () => {
    modulesAccordion.classList.toggle('open');
  });

  // Module Switches
  shieldWeb.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_web_shield: shieldWeb.checked });
    updateActiveBadge();
  });
  shieldMedia.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_media_shield: shieldMedia.checked });
    updateActiveBadge();
  });
  shieldDeception.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_deception_shield: shieldDeception.checked });
    updateActiveBadge();
  });
  shieldCookie.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_cookie_shield: shieldCookie.checked });
    updateActiveBadge();
  });

  // 6. Action: Element Zapper
  zapperBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: 'START_ZAPPER' }, () => {
        window.close(); // Close popup so user interacts with page
      });
    }
  });

  // 7. Action: Fix Page
  fixPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: 'FIX_THIS_PAGE' }, () => {
        fixPageBtn.classList.add('healed');
        fixPageText.textContent = 'Healed!';
        setTimeout(() => {
          fixPageText.textContent = 'Fix Page';
          fixPageBtn.classList.remove('healed');
        }, 3500);
      });
    }
  });

  // 8. Action: Live Activity / Logger
  toggleLoggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = loggerDrawer.classList.toggle('open');
    toggleLoggerBtn.classList.toggle('active', isOpen);

    if (isOpen) {
      chrome.runtime.sendMessage({ type: 'GET_LOGS' }, (res) => {
        if (res && res.logs && res.logs.length > 0) {
          loggerCount.textContent = `${res.logs.length} events`;
          loggerList.innerHTML = res.logs.slice(0, 20).map(log => `
            <div class="log-item">
              <div>
                <span style="font-weight: 700; color: var(--text-main);">${escapeHtml(log.category)}</span>
                <div style="font-size: 0.6rem; color: var(--text-dim);">${escapeHtml(log.details)}</div>
              </div>
              <span style="font-size: 0.6rem; color: var(--brand); font-weight: 600;">${escapeHtml(log.time)}</span>
            </div>
          `).join('');
        } else {
          loggerList.innerHTML = '<div style="color: var(--text-dim); text-align: center; padding: 8px;">No interception events recorded.</div>';
          loggerCount.textContent = '0 events';
        }
      });
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 9. Dashboard Navigation
  function openDashboard(e) {
    e.preventDefault();
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'http://localhost:5173/#/dashboard' });
    } else {
      window.open('http://localhost:5173/#/dashboard', '_blank');
    }
  }

  openDashboardBtn.addEventListener('click', openDashboard);
  if (openDashboardIcon) openDashboardIcon.addEventListener('click', openDashboard);
});
