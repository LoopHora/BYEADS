# BYEADS — Windows: How It Works & User Workflow

Device 1 · Windows 10/11 · Desktop browsers

On Windows, BYEADS is designed to work through its browser extension, DNS filtering configuration, and web dashboard. These are separate components, and each provides a different kind of protection. The audit identifies Windows 11 with desktop Chrome, Firefox and Edge as its testing environment.

## 1. How BYEADS works on Windows

Windows PC

User opens a website or app

Browser extension

Applies browser-level filtering, page scripts and supported cosmetic protections.

DNS filtering

Filters domain lookups using the configured DNS service.

Website or service loads

Requests blocked by the active protection layers may not load.

Browser extension: Works inside a supported browser. The audit describes domain matching, download-size heuristics, popunder neutralization, a zapper and whitelist controls. Some protections, including clickjacking and cookie-banner handling, are reported as partial or experimental.

DNS filtering: Works at the domain lookup level, not by inspecting everything on a webpage. If an ad is delivered from the same domain as the content, DNS filtering alone may not be able to distinguish it.

Dashboard: Provides the user-facing interface for setup and protection status. A dashboard showing a setting as enabled does not, by itself, prove that a particular ad or tracker was blocked.

## 2. Windows user workflow

This is a practical workflow based on the audited components. The report does not specify every exact installer screen or menu label.

1. Install the browser extension

   The user obtains the BYEADS extension package and installs it in a supported desktop browser, such as Chrome, Firefox or Edge, following the applicable browser installation process.

   The audit reports Chromium MV3 and Firefox MV2 extension packages.

2. Open the BYEADS dashboard

   The user opens the dashboard to view available controls and setup information. They can review which protections are supported and configure the available options.

3. Configure DNS if desired

   If the user wants domain-level filtering beyond the browser extension, they configure Windows or their network to use the DNS service specified by BYEADS. This is a separate setup step; installing the extension does not automatically change Windows DNS.

4. Browse normally

   The user visits websites as usual. The extension handles supported browser-level protections, while DNS filtering handles domain lookups when the device is using the configured resolver.

5. Check protection and troubleshoot

   If an expected item is not blocked or a website breaks, the user can check the extension's status, review allowlist settings and test whether the DNS configuration is active. The audit notes that some protections are only partially verified, so results can vary by website and browser.

## 3. What the user should expect

| Feature                        | Windows behavior                                                          |
| ------------------------------ | ------------------------------------------------------------------------- |
| Browser-level filtering        | Available through the installed extension                                 |
| Domain blocking                | Available through configured DNS filtering                                |
| Popunder neutralization        | Reported as verified in the audit                                         |
| Cosmetic/page-level protection | Depends on the supported rule or script                                   |
| YouTube / YouTube Music ads    | Partially verified in desktop browsers; not guaranteed                    |
| Native Windows apps            | Browser extension protections do not apply to them                        |
| PWA protection                 | Not automatically inherited from the browser extension                    |
| Privacy                        | Audit reports zero telemetry, but DNS resolvers can still see DNS queries |

The audit's broader test matrix reports 126 passes, 2 failures and 2 inconclusive results out of 130, but its detailed execution log only documents 37 Vitest tests. So these findings should be treated as an audit baseline rather than proof that every Windows scenario has been validated.

## 4. Simple example

Imagine a user opens a news website on Windows:

- Windows resolves the website's domain through its configured DNS resolver, if DNS filtering is enabled.
- The browser extension applies its supported filtering rules to relevant browser requests and page behavior.
- The website loads with any requests successfully blocked by those layers omitted.
- If an ad is served from the same domain as the article, BYEADS may not be able to block it through DNS, and the extension may not have a matching supported rule.

Important limitation

BYEADS should not be presented as guaranteeing that all ads, including YouTube in-stream ads, will be blocked on Windows. The audit specifically marks YouTube and YouTube Music behavior as partially verified and notes that changes to the sites can affect results.

In short: On Windows, the browser extension protects supported activity within the browser, while DNS filtering can block selected domains across applications that use the configured resolver. The dashboard helps the user manage and understand the setup; it is not itself the filtering engine.

Next, we can cover Android, including the difference between browser-extension protection, Android Private DNS and PWA behavior.

# BYEADS — Windows: Automatic Device Detection & Live Monitoring

Windows 10/11 · Browser extension + DNS filtering + PWA dashboard

On Windows, BYEADS can provide a similar experience to Android and iPhone: the user installs the browser extension, configures DNS if supported, opens the BYEADS dashboard, and sees the protection status and genuine monitoring data.

The key difference is that Windows allows more flexible integration with desktop browsers and system networking, but a PWA still cannot independently inspect every system setting or all network traffic.

## 1. How it works

Windows PC

User installs BYEADS and configures protection

Browser extension

Filters supported requests and page behavior inside compatible browsers.

DNS filtering

Filters domain lookups through the configured DNS resolver.

BYEADS dashboard / PWA

Checks connectivity and requests real monitoring data from the available protection components.

Verified protection status

Displays only the components that have actually been verified as working.

## 2. Windows user workflow

Proposed workflow for BYEADS, not a claim that automatic detection is already implemented.

1. Install the BYEADS browser extension

   The user installs the appropriate extension package in a supported browser, such as Chrome, Firefox or Edge. The extension starts applying its supported browser-level filtering.
2. Configure DNS, if desired

   The user configures Windows to use the verified BYEADS DNS resolver, if BYEADS provides one. This is a separate step from installing the extension.
3. Open or install the BYEADS dashboard

   The user opens the dashboard in their browser and can optionally install it as a PWA for quick access.
4. Automatically verify the protection setup

   When opened, the dashboard can perform a DNS verification request and check whether the browser extension is reachable through an explicitly implemented integration. It can also check whether the monitoring service is available.
5. Activate the verified dashboard

   Once checks return valid results, the dashboard updates the status of each protection component separately. For example, DNS may be verified while extension connectivity is still unconfirmed.
6. Show live monitoring

   While the dashboard is open, it can refresh real statistics from a connected monitoring source. If the dashboard is closed, monitoring may continue in the extension or DNS service, but the dashboard will not necessarily receive live updates until reopened.

## 3. Example dashboard

BYEADS Protection

Example: Connected

Illustrative layout. No real Windows device data is being reported here.

Browser extension

Connected

Integration verified

DNS filtering

Verified

Resolver check passed

Requests monitored

# —

Waiting for real data

Requests blocked

# —

Waiting for real data

Browser filtering and DNS filtering are separate. These indicators should be based on actual component status, not a single successful connection check.

## 4. What Windows can detect

| Capability                     | How it can be verified                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| BYEADS dashboard is open       | The PWA or website knows it is running in the current browser tab                           |
| DNS resolver is reachable      | A verification request to a BYEADS-controlled endpoint                                      |
| DNS filtering is working       | A controlled test domain and a reliable check of the resolver's filtering response          |
| Browser extension is connected | An explicit extension-to-dashboard integration, if implemented                              |
| Browser requests blocked       | Actual event data exposed by the extension's filtering APIs                                 |
| DNS requests blocked           | Genuine statistics from the configured resolver                                             |
| Other Windows apps protected   | Requires evidence that those apps use the configured DNS path; a browser test is not enough |
| Continuous monitoring          | Requires a component that continues collecting data while the dashboard is closed           |

## 5. The important difference from mobile

Windows offers options beyond a PWA, such as a native companion application or a supported background service. These could provide more reliable status information and, with suitable implementation and permissions, integrate browser and DNS monitoring.

Important technical limitation

A PWA cannot directly inspect the installed extension, read all Windows DNS settings, or see all device network requests by itself. Browser DNS-over-HTTPS, VPNs, proxy settings and network changes can also affect whether DNS verification reflects the actual traffic path.

To provide accurate monitoring, BYEADS needs a defined communication method between the extension, dashboard and DNS service—or a native Windows component for broader integration.

## 6. Recommended implementation for BYEADS

1. Browser extension integration: expose only the required status and blocking statistics to an authorized dashboard origin, with secure permission checks.
2. DNS verification: implement a controlled test that confirms the resolver's response, while clearly indicating that it does not prove all traffic uses that resolver.
3. Monitoring source: collect genuine extension and DNS statistics, with transparent consent and minimal retention.
4. Dashboard status engine: show separate states for extension connectivity, DNS status, monitoring freshness and protection coverage.
5. Optional native companion: consider this if BYEADS needs system-level status or monitoring beyond what the extension and PWA can provide.

The existing audit describes browser extensions, DNS configuration and the dashboard, but does not establish that this full automatic detection and live-monitoring integration is already implemented.

In short: Windows can support the experience you're envisioning: install BYEADS, configure DNS, open the dashboard, and see verified protection and monitoring status. For genuinely live, accurate data, the extension and DNS resolver need to actively provide that information; simply detecting that the PWA is open is not enough.

## 7. Architectural Decision: Why Windows Does Not Need an .EXE or Duplicate Extension

### 1. No Duplicate "Windows Extension"
Browser extensions are cross-platform by specification:
- The **Chromium MV3 package** runs natively on Google Chrome, Microsoft Edge, Brave, Opera, and Vivaldi on Windows.
- The **Firefox package** runs natively on Mozilla Firefox on Windows.
Creating a separate "Windows Extension" is redundant and creates maintenance divergence. Windows users simply install the standard browser extension corresponding to their desktop browser.

### 2. Why an .EXE Installer is NOT Needed
Traditional ad-blocking software compiles standalone Windows background daemons (`.exe` executables). For BYEADS, an `.exe` is intentionally avoided:
- **0 MB Background RAM:** Windows 10 (Build 19628+) and Windows 11 natively support kernel-level **DNS-over-HTTPS (DoH)** inside the Windows `dnscache` service. Running a background `.exe` daemon wastes 80MB–150MB of system memory; Windows native DoH uses 0 additional memory.
- **Zero Antivirus / SmartScreen False Alarms:** Third-party `.exe` binaries from open-source repositories lack multi-thousand dollar Microsoft EV Code-Signing certificates, triggering alarming "Unknown Publisher / Windows Protected Your PC" warnings. Native PowerShell scripts and batch files avoid this entirely.
- **Full Transparency & Auditing:** The 1-click installer ([`install-byeads-dns.bat`](file:///d:/BYEADS/platforms/windows/install-byeads-dns.bat)) and PowerShell script ([`setup-windows-doh.ps1`](file:///d:/BYEADS/platforms/windows/setup-windows-doh.ps1)) are 100% human-readable and auditable before execution.
- **Desktop App Integration via PWA:** The BYEADS Dashboard can be installed directly from Edge or Chrome as a standalone Windows desktop app (Start Menu, taskbar pinning, window framing) without requiring an executable installer.