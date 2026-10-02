// ===== BYEADS POPUP SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const siteHostname = document.getElementById('siteHostname');
  const masterDesc = document.getElementById('masterDesc');
  const masterToggle = document.getElementById('masterToggle');

  const statAds = document.getElementById('statAds');
  const statMedia = document.getElementById('statMedia');
  const statDeception = document.getElementById('statDeception');
  const statDownloads = document.getElementById('statDownloads');

  const shieldWeb = document.getElementById('shieldWeb');
  const shieldMedia = document.getElementById('shieldMedia');
  const shieldDeception = document.getElementById('shieldDeception');
  const shieldCookie = document.getElementById('shieldCookie');

  const zapperBtn = document.getElementById('zapperBtn');
  const toggleLoggerBtn = document.getElementById('toggleLoggerBtn');
  const whitelistBtn = document.getElementById('whitelistBtn');
  const whitelistBtnText = document.getElementById('whitelistBtnText');
  const loggerDrawer = document.getElementById('loggerDrawer');
  const loggerList = document.getElementById('loggerList');
  const loggerCount = document.getElementById('loggerCount');
  const openDashboardBtn = document.getElementById('openDashboardBtn');

  let currentDomain = '';
  let activeTabId = null;

  // 1. Detect Active Tab
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
          } else {
            currentDomain = 'internal';
            siteHostname.textContent = 'Browser Internal';
            masterDesc.textContent = 'Protection active for external sites';
          }
        } catch {
          siteHostname.textContent = 'Active Tab';
        }
      }
    });
  }

  // 2. Whitelist Handler
  function checkWhitelistStatus() {
    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      const whitelist = res.byeads_whitelist || [];
      if (whitelist.includes(currentDomain)) {
        whitelistBtnText.textContent = 'Site Whitelisted';
        whitelistBtn.style.color = 'var(--amber)';
        masterDesc.textContent = 'Protection whitelisted on this site';
        statusBadge.classList.add('disabled');
        statusText.textContent = 'Whitelisted';
      } else {
        whitelistBtnText.textContent = 'Whitelist Site';
        whitelistBtn.style.color = '';
      }
    });
  }

  whitelistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentDomain || currentDomain === 'internal') return;

    chrome.storage.local.get(['byeads_whitelist'], (res) => {
      let whitelist = res.byeads_whitelist || [];
      const alreadyWhitelisted = whitelist.includes(currentDomain);

      if (alreadyWhitelisted) {
        whitelist = whitelist.filter((d) => d !== currentDomain);
      } else {
        whitelist.push(currentDomain);
      }

      chrome.storage.local.set({ byeads_whitelist: whitelist }, () => {
        checkWhitelistStatus();
        if (activeTabId) {
          chrome.tabs.sendMessage(activeTabId, {
            type: 'TOGGLE_WHITELIST',
            isWhitelisted: !alreadyWhitelisted
          });
        }
      });
    });
  });

  // 3. Element Zapper Trigger
  zapperBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: 'START_ZAPPER' }, () => {
        window.close(); // Close popup so user can click to zap
      });
    }
  });

  // 4. Load Stored States & Live Stats
  function refreshStats() {
    chrome.storage.local.get(
      ['byeads_enabled', 'byeads_stats', 'byeads_web_shield', 'byeads_media_shield', 'byeads_deception_shield', 'byeads_cookie_shield'],
      (res) => {
        const isEnabled = res.byeads_enabled !== false;
        masterToggle.checked = isEnabled;
        updateMasterUI(isEnabled);

        shieldWeb.checked = res.byeads_web_shield !== false;
        shieldMedia.checked = res.byeads_media_shield !== false;
        shieldDeception.checked = res.byeads_deception_shield !== false;
        shieldCookie.checked = res.byeads_cookie_shield !== false;

        const stats = res.byeads_stats || {};
        statAds.textContent = (stats.adsBlocked || 0).toLocaleString();
        statMedia.textContent = (stats.mediaAdsBlocked || 0).toLocaleString();
        statDeception.textContent = (stats.threatsDetected || 0).toLocaleString();
        statDownloads.textContent = (stats.blockedDownloads || 0).toLocaleString();
      }
    );
  }

  function updateMasterUI(enabled) {
    if (enabled) {
      statusBadge.classList.remove('disabled');
      statusText.textContent = 'Active';
      masterDesc.textContent = 'All 4 shields active on this page';
    } else {
      statusBadge.classList.add('disabled');
      statusText.textContent = 'Paused';
      masterDesc.textContent = 'Protection paused for this session';
    }
  }

  refreshStats();

  // 5. Master Toggle Handler
  masterToggle.addEventListener('change', () => {
    const isEnabled = masterToggle.checked;
    updateMasterUI(isEnabled);
    chrome.storage.local.set({ byeads_enabled: isEnabled });

    if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
      });
    }
  });

  // 6. Subsystem Toggles
  shieldWeb.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_web_shield: shieldWeb.checked });
  });

  shieldMedia.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_media_shield: shieldMedia.checked });
  });

  shieldDeception.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_deception_shield: shieldDeception.checked });
  });

  shieldCookie.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_cookie_shield: shieldCookie.checked });
  });

  // 7. Live Traffic Drawer (Logger)
  toggleLoggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = loggerDrawer.classList.toggle('open');
    if (isOpen) {
      chrome.runtime.sendMessage({ type: 'GET_LOGS' }, (res) => {
        if (res && res.logs && res.logs.length > 0) {
          loggerCount.textContent = `${res.logs.length} events`;
          loggerList.innerHTML = res.logs.map(log => `
            <div class="log-item">
              <div>
                <span style="font-weight: 700; color: var(--text-main);">${escapeHtml(log.category)}</span>
                <div style="font-size: 0.625rem; color: var(--text-dim);">${escapeHtml(log.details)}</div>
              </div>
              <span style="font-size: 0.625rem; color: var(--brand); font-weight: 600;">${escapeHtml(log.time)}</span>
            </div>
          `).join('');
        } else {
          loggerList.innerHTML = '<div style="color: var(--text-dim); text-align: center; padding: 6px;">No ad events logged yet.</div>';
          loggerCount.textContent = '0 events';
        }
      });
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 8. Open Dashboard Link
  openDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'http://localhost:5173/#/dashboard' });
    } else {
      window.open('http://localhost:5173/#/dashboard', '_blank');
    }
  });
});
