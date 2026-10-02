# BYEADS — Android Platform Setup Guide

Android 9.0 (Pie) through Android 15+ natively includes system-wide encrypted **Private DNS (DNS-over-TLS)** support.

## Option 1: Native Android Settings (GUI)

1. Open the **Settings** app on your Android device.
2. Tap **Network & internet** (or **Connections** / **Wi-Fi & Network** depending on manufacturer).
3. Tap **Private DNS** (often under Advanced or More Connection Settings).
4. Select **Private DNS provider hostname**.
5. Enter your preferred DoT endpoint hostname:
   - Enter endpoint hostname: `security.cloudflare-dns.com`
6. Tap **Save**.

Once saved, Android will test and immediately encrypt all DNS lookups across all apps and browsers.

## Option 2: ADB Shell Automation (For Developers / Fleet Management)

If configuring via USB debugging or MDM, run:

```bash
# Enable Private DNS with hostname provider
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier security.cloudflare-dns.com

# Verify configuration state
adb shell settings get global private_dns_mode
adb shell settings get global private_dns_specifier
```

To revert back to automatic network DNS:
```bash
adb shell settings put global private_dns_mode opportunistic
```
