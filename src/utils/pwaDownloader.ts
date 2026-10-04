// ===== PWA & MOBILE ROBUST DOWNLOAD HELPER =====
// Directly downloads from official GitHub repository (raw.githubusercontent.com)
// Solves PWA standalone webview download blocking across iOS, Android, macOS, and Windows

export interface DownloadResult {
  success: boolean;
  message: string;
  isIosProfileNotice?: boolean;
}

export const GITHUB_REPO_URL = 'https://github.com/LoopHora/BYEADS';
export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/LoopHora/BYEADS/main';

/**
 * Returns the direct, canonical GitHub raw download URL for any platform artifact
 */
export function getGithubDownloadUrl(pathOrFilename: string): string {
  if (pathOrFilename.startsWith('http://') || pathOrFilename.startsWith('https://')) {
    return pathOrFilename;
  }
  const clean = pathOrFilename.replace(/^\/+/, '');
  if (clean.includes('mobileconfig')) {
    return `${GITHUB_RAW_BASE}/public/byeads-encrypted-dns.mobileconfig`;
  }
  if (clean.includes('install-byeads-dns.bat')) {
    return `${GITHUB_RAW_BASE}/public/install-byeads-dns.bat`;
  }
  if (clean.includes('setup-windows-doh.ps1')) {
    return `${GITHUB_RAW_BASE}/public/setup-windows-doh.ps1`;
  }
  if (clean.includes('chromium')) {
    return `${GITHUB_RAW_BASE}/public/byeads-extension-chromium.zip`;
  }
  if (clean.includes('firefox')) {
    return `${GITHUB_RAW_BASE}/public/byeads-extension-firefox.zip`;
  }
  if (clean.includes('safari')) {
    return `${GITHUB_RAW_BASE}/public/byeads-extension-safari.zip`;
  }
  if (clean.includes('wblock') || clean.includes('filter')) {
    return `${GITHUB_RAW_BASE}/public/byeads-wblock-filters.txt`;
  }
  return `${GITHUB_RAW_BASE}/public/${clean}`;
}

export function downloadPwaFile(urlOrPath: string, filename: string): DownloadResult {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window not defined' };
  }

  // Resolve to download URL (relative local file or GitHub)
  const targetUrl = (urlOrPath.startsWith('/') && !urlOrPath.startsWith('//'))
    ? urlOrPath
    : getGithubDownloadUrl(urlOrPath);

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isMobileConfig = filename.endsWith('.mobileconfig');

  // iOS Standalone PWA limitation:
  // Apple WKWebView in standalone mode prohibits downloading device configuration profiles directly.
  // The profile MUST be opened in Safari so iOS triggers the native "Profile Downloaded" prompt.
  if (isIos && isMobileConfig) {
    window.location.href = targetUrl;
    return {
      success: true,
      isIosProfileNotice: true,
      message: 'Opening profile directly from GitHub in Safari. Tap "Allow", then open iPhone Settings -> Profile Downloaded to install.'
    };
  }

  try {
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);

    return {
      success: true,
      message: `Downloading ${filename} directly from GitHub.`
    };
  } catch (err: any) {
    // Fallback: direct window.open
    window.open(targetUrl, '_blank');
    return {
      success: true,
      message: `Opened ${filename} from GitHub in new window.`
    };
  }
}
