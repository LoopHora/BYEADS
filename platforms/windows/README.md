# BYEADS — Windows Platform Setup Guide

BYEADS supports Windows 10 (Build 19628+) and Windows 11 natively using system-level **DNS-over-HTTPS (DoH)** encryption without requiring third-party drivers or VPN software.

## Architecture Note: Why No .EXE or Separate Windows Extension?

- **No duplicate Windows extension:** Browser extensions are cross-platform by definition. Windows users run the official Chromium MV3 extension (in Chrome, Edge, Brave, Opera) or Firefox package.
- **No .EXE installer needed (0 MB background RAM):** Traditional ad-blocking software installs background `.exe` daemons that consume 80MB-150MB of RAM and trigger SmartScreen/Antivirus warnings. BYEADS instead configures Windows' own native kernel resolver (`dnscache`) to route DNS over HTTPS directly.

---

## Option 1: 1-Click Batch Installer (Easiest)

1. Download [`install-byeads-dns.bat`](file:///d:/BYEADS/platforms/windows/install-byeads-dns.bat).
2. Right-click and select **Run as administrator**.
3. Choose option `[1]` to enable BYEADS Anycast DNS Shield (`dns.byeads.net`).

---

## Option 2: Automated PowerShell Command

1. Open **Settings** (`Win + I`) and click **Network & Internet**.
2. Select your active connection (**Wi-Fi** or **Ethernet**).
3. Next to **DNS server assignment**, click **Edit**.
4. Change from *Automatic (DHCP)* to **Manual**.
5. Toggle **IPv4** to **On**:
   - **Preferred DNS**: `1.1.1.2`
   - **DNS over HTTPS**: Select **Encrypted only (DNS over HTTPS)** or **Encrypted preferred**
   - **Alternate DNS**: `1.0.0.2`
6. Click **Save**.
7. Test in PowerShell:
   ```powershell
   Resolve-DnsName -Name google.com
   ```

All background DNS queries are now encrypted and filtered against malware and advertising domains before reaching your system.
