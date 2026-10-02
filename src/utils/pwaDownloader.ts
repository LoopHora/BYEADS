// ===== PWA & MOBILE ROBUST DOWNLOAD HELPER =====
// Solves PWA standalone webview download blocking across iOS, Android, macOS, and Windows

export interface DownloadResult {
  success: boolean;
  message: string;
  isIosProfileNotice?: boolean;
}

export function downloadPwaFile(url: string, filename: string): DownloadResult {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window not defined' };
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isMobileConfig = filename.endsWith('.mobileconfig');

  // iOS Standalone PWA limitation:
  // Apple WKWebView in standalone mode prohibits downloading device configuration profiles directly.
  // The profile MUST be opened in Safari so iOS triggers the "Profile Downloaded" prompt.
  if (isIos && isMobileConfig) {
    // Open directly in Safari via blank target or window.location
    window.location.href = url;
    return {
      success: true,
      isIosProfileNotice: true,
      message: 'Opening profile in Safari. When prompted, tap "Allow", then open iPhone Settings -> Profile Downloaded to install.'
    };
  }

  try {
    const link = document.createElement('a');
    link.href = url;
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
      message: `Downloaded ${filename} successfully.`
    };
  } catch (err: any) {
    // Fallback: direct window.open
    window.open(url, '_blank');
    return {
      success: true,
      message: `Opened ${filename} in new window.`
    };
  }
}
