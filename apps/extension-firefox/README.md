# BYEADS — Firefox WebExtension

Open-source Firefox WebExtension implementing the **Web Shield**, **Deception Engine**, and **Download Guard**.

## How to Install (Temporary Add-on / Debugging)

1. Open Mozilla Firefox and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```
2. Click the button labeled **Load Temporary Add-on...**
3. In the file picker, select:
   ```
   apps/extension-firefox/manifest.json
   ```
   (or unzip `byeads-extension-firefox.zip` and select its `manifest.json`).
4. Click **Open**.
5. The **BYEADS** shield icon will appear in your Firefox toolbar with active real-time filtering!

## Permanent Installation
For permanent distribution, package this directory as a `.zip` or `.xpi` file and submit to addons.mozilla.org (AMO) or sign via web-ext.
