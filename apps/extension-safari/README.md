# BYEADS — Chromium Browser Extension (MV3)

Manifest V3 browser extension implementing the **Web Shield**, **Deception Engine**, and **Download Guard**.

## Supported Browsers
- Google Chrome
- Microsoft Edge
- Brave Browser
- Opera / Vivaldi
- Any Chromium-based browser (v105+)

## How to Install (Unpacked Extension)

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Enable **Developer Mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the directory:
   ```
   apps/extension-chromium
   ```
   (or unzip the release package `byeads-extension-chromium.zip` and select the unzipped directory).
5. Click **Select Folder**.
6. The **BYEADS** shield icon will appear in your browser toolbar! Click the puzzle icon to pin BYEADS to your toolbar.

## Features Enforced
- **declarativeNetRequest Rules**: Blocks tracking beacons, ad exchange pixels, and malware networks before web requests leave your browser.
- **Deception Engine (Content Script)**: Analyzes webpage DOM to flag disguised buttons, deceptive download overlays, and destination domain spoofing.
- **Download Guard (Background Worker)**: Intercepts downloads to detect double extension spoofing (`invoice.pdf.exe`) and cancels malicious executables.
