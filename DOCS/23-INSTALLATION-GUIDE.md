# BYEADS — Installation Guide v1.0

## Status
- Finalized planning and implementation baseline.
- All platforms have installable packages and configuration files in this repository.

---

## 1. Chromium Browser Extension (Chrome, Edge, Brave, Opera)

Directory: `apps/extension-chromium/`

### Features
- **declarativeNetRequest Rules**: Blocks ad exchanges, tracking pixels, and malicious redirects.
- **Deception Engine**: Detects fake download buttons and deceptive overlays in webpage DOM.
- **Download Guard**: Intercepts double extensions (`.pdf.exe`, `.mp4.scr`) and unsafe executables.

### Installation Steps
1. Open your browser and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left toolbar).
4. Select the unpacked directory:
   ```
   apps/extension-chromium
   ```
   (or unzip the release package `byeads-extension-chromium.zip` and select that directory).
5. Click **Select Folder**. The BYEADS extension will load and appear in your toolbar.

---

## 2. Windows 11 & Windows 10 (DNS-over-HTTPS)

Directory: `platforms/windows/`

### Option A: One-Liner Remote Setup (PowerShell Run as Administrator)
1. Open PowerShell as Administrator.
2. Run the secure setup command:
   ```powershell
   irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex
   ```
3. Or if running from a local cloned repository:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "./platforms/windows/setup-windows-doh.ps1"
   ```
4. To uninstall or revert back to standard DHCP DNS:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "./platforms/windows/setup-windows-doh.ps1" -Uninstall
   ```

### Option B: Windows 11 Settings GUI
1. Open **Settings** (`Win + I`) > **Network & Internet**.
2. Click **Wi-Fi** or **Ethernet** > **DNS server assignment** > **Edit**.
3. Select **Manual**, enable **IPv4**.
4. Preferred DNS: `1.1.1.2`, DNS encryption: **Encrypted only (DNS over HTTPS)**.
5. Alternate DNS: `1.0.0.2`. Click **Save**.

---

## 3. Apple macOS, iOS & iPadOS (Encrypted DNS Profile)

Directory: `platforms/apple/`
File: `byeads-encrypted-dns.mobileconfig`

### macOS Setup (macOS 11+)
1. Double-click `byeads-encrypted-dns.mobileconfig`.
2. Open **System Settings** > **Privacy & Security** > **Profiles**.
3. Double-click **BYEADS Protection Profile** and click **Install...**.
4. Enter your administrator password to confirm.

### iOS Setup (iOS 14+)
1. Transfer `byeads-encrypted-dns.mobileconfig` to iPhone/iPad via AirDrop or iCloud Drive.
2. Tap the file and confirm *Profile Downloaded*.
3. Open **Settings** > tap **Profile Downloaded** at the top > tap **Install**.
4. Enter device passcode to activate.

---

## 4. Android (Private DNS / DNS-over-TLS)

Directory: `platforms/android/`

### Native Android Settings (Android 9+)
1. Open **Settings** > **Network & internet** (or **Connections**).
2. Tap **Private DNS** > select **Private DNS provider hostname**.
3. Enter hostname: `security.cloudflare-dns.com` (or your self-hosted resolver).
4. Tap **Save**.

### ADB Automation (Developers)
```bash
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier security.cloudflare-dns.com
```

---

## 5. Docker & Self-Hosting Stack

Directory: `platforms/self-host/`

### Quickstart
```bash
git clone https://github.com/AzeemS24/BYEADS.git
cd BYEADS/platforms/self-host
docker compose up -d
```

### Verification
```bash
# Verify ad blocking (returns 0.0.0.0)
nslookup doubleclick.net 127.0.0.1

# Verify normal resolution
nslookup wikipedia.org 127.0.0.1
```

---

## 6. Automated Test Suite Verification

Run the full automated test suite covering DNS filtering, Deception Engine, Download Guard, Redirect Intelligence, and platform configurations:

```bash
git clone https://github.com/AzeemS24/BYEADS.git
cd BYEADS
npm install
npm test
```

All 37 test specifications execute and pass with zero failures.

---

## Platform Normative Checklist Requirements
1. Android is a defined subsystem or concern of BYEADS.
2. Android must follow canonical BYEADS policy semantics.
3. Android requires automated tests before stable release.
4. Android must document security and privacy implications.
5. Windows is a defined subsystem or concern of BYEADS.
6. Windows must follow canonical BYEADS policy semantics.
7. Windows requires automated tests before stable release.
8. macOS and iOS are defined subsystems of BYEADS.
9. Chromium MV3 is a defined subsystem of BYEADS.
10. Self-hosting via Docker is a defined subsystem of BYEADS.
