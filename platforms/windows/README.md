# BYEADS — Windows Platform Setup Guide

BYEADS supports Windows 10 (Build 19628+) and Windows 11 natively using system-level **DNS-over-HTTPS (DoH)** encryption without requiring third-party drivers or VPN software.

## Option 1: Automated PowerShell Setup (Recommended)

1. Open PowerShell as Administrator (`Win + X` -> **Terminal (Admin)** or **PowerShell (Admin)**).
2. Run the remote one-liner:
   ```powershell
   irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex
   ```
   Or if executing from a cloned repository:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "./platforms/windows/setup-windows-doh.ps1"
   ```
3. To revert back to automatic default DNS at any time:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "./platforms/windows/setup-windows-doh.ps1" -Uninstall
   ```

## Option 2: Windows 11 GUI Configuration

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
