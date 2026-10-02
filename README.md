# BYEADS — Bye Ads. Hello Security.
> **Free & Open-Source Dual-Layer Web Protection by LoopHora**
>
> System-Wide Encrypted DNS Shield · In-Page DOM Defuser · Fake Button & Deception Detection · High-Risk Download Interception

---

## ⚡ Direct GitHub Downloads

All platform artifacts and installers are hosted directly on GitHub and can be downloaded or inspected immediately:

| Platform | Component | Download Link | Type |
| :--- | :--- | :--- | :--- |
| **Windows 11 / 10** | 1-Click Native DoH Setup | [**Download `install-byeads-dns.bat`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/install-byeads-dns.bat) | Batch Script (0 MB RAM) |
| **Windows PowerShell** | Native DoH Engine | [**View / Download `setup-windows-doh.ps1`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/setup-windows-doh.ps1) | PowerShell 5.1 & 7+ |
| **Apple (iOS / iPadOS / macOS)** | Encrypted DNS Profile | [**Download `byeads-encrypted-dns.mobileconfig`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/byeads-encrypted-dns.mobileconfig) | Apple Managed Profile |
| **Chrome / Edge / Brave / Opera** | Chromium MV3 Extension | [**Download `byeads-extension-chromium.zip`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/byeads-extension-chromium.zip) | Manifest V3 Package |
| **Mozilla Firefox** | Firefox WebExtension | [**Download `byeads-extension-firefox.zip`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/byeads-extension-firefox.zip) | WebExtension Package |
| **Apple Safari (macOS)** | Safari WebExtension | [**Download `byeads-extension-safari.zip`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/byeads-extension-safari.zip) | Safari MV3 Package |
| **Android (9+)** | Android Private DNS | Hostname: `dns.byeads.net` | RFC 7858 DoT (Port 853) |

---

## 🛡️ Dual-Layer Architecture

BYEADS combines two independent, complementary protection layers:

```
┌─────────────────────────────────────────────────────────────┐
│                 LAYER 1: SYSTEM-WIDE DNS                    │
│   Anycast Encrypted DNS (DoH / DoT) — dns.byeads.net        │
│   • Blocks ad networks, telemetry trackers, malware domains │
│   • Operates system-wide across all apps (0 MB background)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 LAYER 2: IN-PAGE WEB SHIELD                 │
│   Browser Extension & DOM Defuser (Chromium / FF / Safari)  │
│   • Deception Engine: flags countdown traps & fake buttons  │
│   • Download Guard: blocks double extensions (.pdf.exe)     │
│   • Video Ad Fast-Forwarding: defuses in-stream ad segments │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Setup by Platform

### 1. Windows 11 & 10 (Zero-Bloat Native DoH)
No heavy background executables (`.exe`) wasting RAM:
1. Download [**`install-byeads-dns.bat`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/install-byeads-dns.bat).
2. Right-click and choose **Run as administrator** (or double-click; it auto-prompts for UAC elevation).
3. Select `[1]` to apply **BYEADS Anycast DNS Shield** (`dns.byeads.net`).
4. Or run the remote PowerShell one-liner:
   ```powershell
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex
   ```

### 2. Apple iOS, iPadOS & macOS
1. Download [**`byeads-encrypted-dns.mobileconfig`**](https://raw.githubusercontent.com/AzeemS24/BYEADS/main/public/byeads-encrypted-dns.mobileconfig) in Safari.
2. When prompted, tap **Allow**.
3. Open **Settings → Profile Downloaded** (or **General → VPN & Device Management**).
4. Tap **Install** and enter your passcode.

### 3. Android 9+ (Private DNS)
1. Open **Settings → Network & internet → Private DNS**.
2. Select **Private DNS provider hostname**.
3. Enter:
   ```
   dns.byeads.net
   ```
4. Tap **Save**.

### 4. Browser Extensions (Chromium, Firefox, Safari)
1. Download the respective `.zip` archive above.
2. Unpack the zip file into a local folder.
3. Open `chrome://extensions` (or `about:debugging` in Firefox).
4. Toggle **Developer mode** on and click **Load unpacked**.
5. Select the extracted folder.

---

## 📊 Minimalist Dashboard (Inspired by Inficy-Gateway)

The BYEADS Dashboard (`/#/dashboard`) features an ultra-clean, focused security center:
- **Configured Device Focus**: Only displays your active, verified device (`Target Device: Windows Desktop PC (BYEADS-4096)  ● DNS Connected`).
- **Live Latency & Reachability Probing**: Real-time probe button testing resolver latency in milliseconds.
- **Asymmetric 2x2 Stats Grid**: High-contrast typography displaying monitored queries, blocked threats, resolver ping, and shield health.
- **24-Hour Timeline Slider**: Horizontal event timeline (`24h` ────●───●──────●── `now`) visualizing security incidents in real time.
- **PWA Mobile Navigation**: Native-like top app bar with `< Back` navigation and fixed bottom dock for mobile devices.

---

## 🛠️ Development & Testing

```bash
# Install dependencies
npm install

# Run automated test suite (40 unit & integration tests)
npm test

# Launch local development server
npm run dev

# Compile production bundle
npm run build
```

---

## 📜 License & Open Source
BYEADS is free, open-source software maintained by LoopHora Security. Distributed under the MIT License.
