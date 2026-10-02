# BYEADS — Android Platform Setup Guide

Android 9.0 (Pie) through Android 15+ natively includes system-wide encrypted **Private DNS (DNS-over-TLS)** support.

## 1. System-Wide Ad & Tracker Blocking (Native Private DNS)

This blocks ads, tracking SDKs, telemetry, and malicious domains across all Android apps, games, and browsers.

### Setup Steps (GUI)

1. Open the **Settings** app on your Android phone.
2. Tap **Network & internet** (or **Connections** / **Wi-Fi & Network** depending on manufacturer).
3. Tap **Private DNS** (often under Advanced or More Connection Settings).
4. Select **Private DNS provider hostname**.
5. Enter the BYEADS Ad-Blocking endpoint hostname:
   - **Ad & Tracker Blocker (Recommended):** `dns.adguard-dns.com`
   - **Malware & Security Only:** `security.cloudflare-dns.com`
6. Tap **Save**.

Once saved, Android will test and immediately encrypt all DNS lookups across all apps and browsers.

### ADB Shell Automation (For Developers / Fleet Management)

```bash
# Enable Private DNS with Ad-Blocking provider
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier dns.adguard-dns.com

# Verify configuration state
adb shell settings get global private_dns_mode
adb shell settings get global private_dns_specifier
```

To revert back to automatic network DNS:
```bash
adb shell settings put global private_dns_mode opportunistic
```

---

## 2. YouTube & YouTube Music on Smartphones (Important Notice)

### Why DNS Alone Cannot Block YouTube Video/Audio Ads
YouTube and YouTube Music stream ads from the exact same servers and domains (`*.googlevideo.com`) as the real music and video streams. If a DNS server blocks `googlevideo.com`, **the entire video or song fails to load completely**. DNS has no access to URL paths or DOM elements to mute or skip ads.

### How to Get Ad-Free YouTube & YouTube Music on Android:
1. Install **Firefox for Android** or **Kiwi Browser** (Chromium with extension support) from Google Play.
2. Load the BYEADS extension (`byeads-extension-firefox.zip` on Firefox, or `byeads-extension-chromium.zip` on Kiwi).
3. Open `music.youtube.com` or `youtube.com` in the mobile browser.
4. The BYEADS content script will run on mobile, automatically muting, fast-forwarding, and auto-skipping video and audio ads while keeping playback completely uninterrupted.
