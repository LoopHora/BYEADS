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
  const shieldDownload = document.getElementById('shieldDownload');

  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const resetStatsBtn = document.getElementById('resetStatsBtn');

  // 1. Detect Active Tab
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          if (url.protocol.startsWith('http')) {
            siteHostname.textContent = url.hostname;
          } else {
            siteHostname.textContent = 'Browser Internal Page';
            masterDesc.textContent = 'Protection active for external sites';
          }
        } catch {
          siteHostname.textContent = 'Active Web Tab';
        }
      }
    });
  }

  // 2. Load Stored States & Stats
  function refreshStats() {
    chrome.storage.local.get(
      [
        'byeads_enabled',
        'byeads_stats',
        'byeads_web_shield',
        'byeads_media_shield',
        'byeads_deception_shield',
        'byeads_download_shield'
      ],
      (res) => {
        const isEnabled = res.byeads_enabled !== false;
        masterToggle.checked = isEnabled;
        updateMasterUI(isEnabled);

        shieldWeb.checked = res.byeads_web_shield !== false;
        shieldMedia.checked = res.byeads_media_shield !== false;
        shieldDeception.checked = res.byeads_deception_shield !== false;
        shieldDownload.checked = res.byeads_download_shield !== false;

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

  // 3. Master Toggle Handler
  masterToggle.addEventListener('change', () => {
    const isEnabled = masterToggle.checked;
    updateMasterUI(isEnabled);
    chrome.storage.local.set({ byeads_enabled: isEnabled });

    // Enable or disable declarativeNetRequest ruleset if supported
    if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateEnabledRulesets) {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        [isEnabled ? 'enableRulesetIds' : 'disableRulesetIds']: ['byeads_core_rules']
      });
    }
  });

  // 4. Subsystem Toggles
  shieldWeb.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_web_shield: shieldWeb.checked });
  });

  shieldMedia.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_media_shield: shieldMedia.checked });
  });

  shieldDeception.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_deception_shield: shieldDeception.checked });
  });

  shieldDownload.addEventListener('change', () => {
    chrome.storage.local.set({ byeads_download_shield: shieldDownload.checked });
  });

  // 5. Open Dashboard Link
  openDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'http://localhost:5173/#/dashboard' });
    } else {
      window.open('http://localhost:5173/#/dashboard', '_blank');
    }
  });

  // 6. Reset Stats
  resetStatsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: 'RESET_STATS' }, () => {
      refreshStats();
    });
  });
});
