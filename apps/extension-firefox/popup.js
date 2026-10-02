// ===== BYEADS POPUP LOGIC =====

document.addEventListener('DOMContentLoaded', () => {
  const threatsCountEl = document.getElementById('threatsCount');
  const blockedCountEl = document.getElementById('blockedCount');
  const shieldToggle = document.getElementById('shieldToggle');
  const deceptionToggle = document.getElementById('deceptionToggle');
  const statusText = document.getElementById('statusText');

  // Load stats from storage
  chrome.storage.local.get(['byeads_stats', 'byeads_enabled'], (res) => {
    if (res.byeads_stats) {
      threatsCountEl.textContent = res.byeads_stats.threatsDetected || 0;
      blockedCountEl.textContent = (res.byeads_stats.blockedRequests || 0) + (res.byeads_stats.blockedDownloads || 0);
    }
    const enabled = res.byeads_enabled !== false;
    updateToggleUI(shieldToggle, enabled);
    statusText.textContent = enabled ? 'Active' : 'Paused';
  });

  shieldToggle.addEventListener('click', () => {
    chrome.storage.local.get(['byeads_enabled'], (res) => {
      const newState = !res.byeads_enabled;
      chrome.storage.local.set({ byeads_enabled: newState });
      updateToggleUI(shieldToggle, newState);
      statusText.textContent = newState ? 'Active' : 'Paused';
    });
  });

  deceptionToggle.addEventListener('click', () => {
    deceptionToggle.classList.toggle('active');
  });

  function updateToggleUI(el, active) {
    if (active) el.classList.add('active');
    else el.classList.remove('active');
  }
});
