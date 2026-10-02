# BYEADS — MacBook: Automatic Device Detection & Live Monitoring

macOS · Safari / Chrome / Firefox · DNS filtering + browser extension + PWA dashboard

On a MacBook, BYEADS can follow a similar workflow to Windows: the user installs the browser extension, configures DNS if supported, opens the BYEADS dashboard and sees the verified protection status.

macOS also supports native applications and system-level networking integrations, which could allow BYEADS to offer richer monitoring in the future. However, a PWA alone cannot inspect all Mac network traffic or independently detect every system configuration.

[Old Republic Cyber | Cyber Insurance & Liability Coverage](https://images.openai.com/static-rsc-4/fpzc5-ZCsgXW9KiHoBFwDxX_STH75FvMCQkES2zwVNWkKlJi2Jtq18iS9gcQx0i7js0n2BdhsPDEzdkztc8FFvyCpmIudJMapM6bbli-Yg2aB0RCNGg0o4VMT9NcA2GTHmBvrq_aebWg876GXff0i8FDKWQhW4VdglcIsWlAYct8KpKXSxwJSGOMkPwyyaYg?purpose=fullsize)

## 1. How BYEADS works on MacBook

MacBook (macOS)

User opens a browser and configures BYEADS

Browser extension

Browser-level filtering in compatible browsers.

DNS filtering

Domain-level filtering through the configured resolver.

BYEADS PWA / Dashboard

Verifies available connections and displays monitoring data.

Verified protection status

Shows the components confirmed as working.

## 2. MacBook user workflow

Proposed workflow; actual installation options depend on the BYEADS packages available for macOS.

1. Open BYEADS on MacBook

   The user visits the BYEADS website in Safari, Chrome or another supported browser and opens the macOS setup instructions.
2. Install the browser extension

   The user installs the compatible BYEADS extension in their chosen browser. Safari requires a compatible Safari Web Extension, typically distributed through a macOS app; Chromium and Firefox use their respective extension formats.
3. Configure DNS

   If BYEADS provides a verified DNS resolver or configuration profile for macOS, the user follows the setup instructions to configure it in macOS network settings. This is independent of the browser extension.
4. Add the dashboard to the Dock

   The user can install or add the BYEADS website as a web app where the browser supports it, or simply bookmark the dashboard. This makes the dashboard easy to reopen but does not install system-level protection.
5. Verify protection automatically

   When the dashboard opens, it can test the DNS endpoint and, if BYEADS implements a secure extension integration, confirm the browser extension's status. It can also check whether the monitoring service is reachable.
6. View live monitoring

   The dashboard displays actual statistics received from the extension or DNS service, updating while it is active. If the dashboard is closed, the extension or resolver may continue filtering, but the dashboard itself will not necessarily receive live updates.

## 3. Example dashboard

BYEADS Protection

Example: Connected

Illustrative interface only; no real MacBook data is shown.

Browser extension

Verified

Status confirmed

DNS filtering

Connected

Test passed

Requests monitored

# —

Awaiting real data

Requests blocked

# —

Awaiting real data

Filtering status and monitoring status should be reported independently.

## 4. What BYEADS can detect on macOS

| Capability                           | How it could work                                                        |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Dashboard is open                    | The PWA or browser page detects its own active state                     |
| DNS connectivity                     | A controlled request to a BYEADS verification endpoint                   |
| DNS filtering                        | A controlled test domain and resolver response                           |
| Browser extension status             | Secure extension-to-dashboard communication, if implemented              |
| Browser requests blocked             | Actual filtering events exposed by the extension                         |
| DNS requests blocked                 | Resolver-provided monitoring statistics                                  |
| Other Mac apps protected             | Requires checking whether they use the configured DNS route              |
| Monitoring while dashboard is closed | Requires a separate persistent monitoring source                         |
| System-wide network monitoring       | Requires a suitable native macOS integration and appropriate permissions |

## 5. Advanced option: Native macOS integration

[Cyber Security Dashboard :: Behance](https://images.openai.com/static-rsc-4/kpdhLlxxiwJ0FhE3558h_Okk_a-be5IMS_NaO5SU5gfFDcD09vJdVUBRCjKhTEaAgECw7U3eBwxO2ukqJECzBxqcthyde2eVQSImegiqJQoPLyX_JK_tR81B1ehB39P2omg5-d_lKdUatp_4XaNGt1Il94Jq98bEXFL0XCkbsoF-8oF8UynBTpKqy_JCdWL8?purpose=fullsize)

If you want BYEADS to behave more like a native security application, a future macOS companion app could provide additional integration:

- System status: Show supported network configuration and connection status.
- DNS integration: Coordinate with the configured DNS resolver and display its verified status.
- Background monitoring: Collect authorized status and filtering statistics while the dashboard is closed.
- Dashboard communication: Securely send genuine status and statistics to the web dashboard.

macOS Network Extension capabilities may support some system-level network functions, but they require the appropriate Apple-supported implementation, entitlements and permissions. A native app does not automatically gain unrestricted access to every connection.

## 6. MacBook-specific limitations

Important

- A PWA cannot directly inspect all macOS network settings or every app's traffic.
- A browser extension only protects supported activity inside its browser.
- DNS filtering cannot reliably distinguish ads from content served by the same domain.
- Safari needs a compatible Safari extension; desktop Chromium or Firefox packages cannot simply be installed into Safari.
- DNS verification does not prove that all applications use BYEADS DNS.

The existing BYEADS audit reports Windows desktop testing and Apple profile XML/Plist integrity checks, but it does not establish a fully tested macOS release, Safari extension or native Mac monitoring integration.

## 7. Adopted Strategy: wBlock Hybrid Architecture for macOS & iOS

To avoid expensive Apple Developer Program memberships, avoid submitting closed native apps to the Mac App Store, and keep hosting 100% free and open, BYEADS adopts a transparent hybrid model:

1. **Compatible Blocker Engine**: Users install **wBlock** (free & open source, GPL-3.0, available on the Mac App Store and GitHub).
2. **BYEADS Custom Filter List**: BYEADS supplies a tested, declarative Adblock Plus filter list (`byeads-wblock-filters.txt`), hosted for free on GitHub Pages and Cloudflare static hosting.
3. **First-Party Extensions**: BYEADS continues developing its full-featured first-party extensions with active scriptlet defusing, Deception Engine heuristics, and Download Guard on Chrome, Edge, and Firefox.
4. **Optional System-Wide DNS**: System-wide DNS is optional (e.g. NextDNS, Cloudflare 1.1.1.2, or BYEADS mobileconfig). We are transparent that DNS filtering does not block in-stream video ads.

### macOS wBlock Setup Steps:
1. Install **wBlock** from the Mac App Store: `https://apps.apple.com/app/wblock-fast-adblock-for-safari/id6477748432`.
2. Open Safari > Settings > Extensions > Enable wBlock content blockers.
3. Open wBlock > Filter Lists > Add Custom List > Paste the raw URL:
   `https://raw.githubusercontent.com/LoopHora/BYEADS/main/public/byeads-wblock-filters.txt`
4. Tap Update. Safari now compiles the rules directly into high-speed WebKit bytecode.

In short: MacBook users get high-performance native Safari ad blocking via wBlock and BYEADS's curated rules, without requiring BYEADS to build or publish a proprietary macOS native app.