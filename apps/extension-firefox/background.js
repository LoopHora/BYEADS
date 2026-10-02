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
  "*://*.onclickads.net/*"
];

// WebRequest blocking filter
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      console.log(`[BYEADS Firefox] Blocked ad/tracker: ${details.url}`);
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
      const DANGEROUS = new Set(['exe', 'scr', 'bat', 'cmd', 'ps1', 'msi']);
      const DOCS = new Set(['pdf', 'doc', 'docx', 'xlsx', 'mp4', 'zip', 'txt']);

      if (DANGEROUS.has(realExt) && DOCS.has(fakeExt)) {
        console.warn(`[BYEADS Firefox] Deception detected! Cancelling: ${filename}`);
        chrome.downloads.cancel(item.id);
      }
    }
  });
}
