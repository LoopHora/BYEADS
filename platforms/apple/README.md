# BYEADS — Apple (macOS & iOS) Installation Guide

Apple devices natively support encrypted DNS via system `.mobileconfig` profiles without requiring any third-party background daemon or battery-draining VPN.

## macOS Setup (macOS Big Sur 11 to Sequoia 15+)

1. Double-click `byeads-encrypted-dns.mobileconfig`.
2. A system notification will prompt: *"Profile Downloaded — review in System Settings"*.
3. Open **System Settings** (or System Preferences).
4. Search or navigate to:
   - macOS 13+: **Privacy & Security** > **Profiles**
   - macOS 11-12: **Profiles**
5. Double-click the **BYEADS Protection Profile** and click **Install...**.
6. Enter your macOS administrator password when prompted.
7. System verification:
   ```bash
   scutil --dns | grep -i "1.1.1.2"
   ```

## iOS & iPadOS Setup (iOS 14 to iOS 18+)

1. Send `byeads-encrypted-dns.mobileconfig` to your device via AirDrop, iCloud Drive, or host on your local server.
2. Tap the file in Safari or the Files app. A notification will say: *"Profile Downloaded"*.
3. Open the **Settings** app on your iPhone/iPad.
4. Tap the **Profile Downloaded** banner right near the top.
5. Tap **Install** in the top right, enter your device Passcode, and confirm.
6. Encrypted DNS is now active across all Wi-Fi networks and Cellular LTE/5G connections!

To remove at any time, open Profiles in Settings and tap **Remove Profile**.
