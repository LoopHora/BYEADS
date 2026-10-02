# BYEADS — Android Smartphone: How It Works & User Workflow

Device 2 · Android smartphones · Mobile browsers, Private DNS and PWA

On Android, BYEADS can operate through three separate approaches: a compatible mobile browser extension, Android's Private DNS setting, or the BYEADS web dashboard/PWA. These approaches do not provide identical protection, and installing the PWA alone does not activate system-wide ad blocking.

[Cara Menghilangkan Iklan Google Chrome di HP: Panduan Lengkap untuk Browsing Bebas Gangguan - KapanLagi.com](https://images.openai.com/static-rsc-4/ShmHqm9H30CEEKiWpkqSQ61ZYhIDQ50Tnjryr4CSgm5bLn5xX9_Txf2OMLYKZR9zzCn_1F6OPloOTYcSgAzL4qqd0mivvB_g7e0GE3Rvwrho-FT2xWlf1gX6kzIFQhn6M6hYoCml1rrBHe0YAGS_FKykKdsVjYT3bkVCFkAfPnaUZNRNnzF8eowOGgzg3rvf?purpose=fullsize)

## 1. How BYEADS works on Android

Android smartphone

User opens a browser or app

Compatible browser

Extension protection in browsers that support the BYEADS extension.

Android Private DNS

Domain-level filtering through the configured DNS provider.

The BYEADS dashboard/PWA is a separate interface for setup and controls.

Supported requests are filtered

Actual protection depends on the active method, browser support, DNS configuration and website.

### The three approaches

- Mobile browser extension: If the Android browser supports the required extension APIs and BYEADS package, the extension can apply its supported browser-level protections. Support cannot be assumed for every Android browser.
- Android Private DNS: Android can use a manually configured DNS-over-TLS provider. This can filter domains for apps that use the system DNS configuration, but it does not inspect webpage elements or reliably block ads served from the same domain as content.
- PWA (Progressive Web App): The user can add the BYEADS website to their home screen for convenient access. The PWA is a web app interface; it does not automatically install an extension or enable system-wide filtering.

## 2. Android user workflow

A practical workflow. Exact screen names and setup steps may vary by Android version, browser and BYEADS release.

1. Open BYEADS on the smartphone

   The user visits the BYEADS website in a mobile browser. They can use the dashboard to read the setup guidance and see the available protection options.
2. Choose the protection method
   - For browser-level protection, use a compatible Android browser that supports the BYEADS extension.
   - For domain-level filtering, configure Android Private DNS with the verified hostname supplied by BYEADS.
   - The user may use both methods if their browser and configuration support them.
3. Configure Private DNS, if using it

   On many Android devices, the user can open Settings → Network & Internet → Private DNS (the exact path varies), select the provider-hostname option and enter the verified DNS hostname.

   The hostname must come from BYEADS's actual setup instructions. It should not be guessed or replaced with an unrelated resolver.
4. Install the PWA, if desired

   The user may choose Add to Home screen or the browser's equivalent option. This creates convenient access to the dashboard, but does not independently enable the extension or DNS protection.
5. Browse and test

   The user opens a few ordinary websites and checks whether the selected protection is active. If a site fails to load, they can review the DNS configuration or extension settings and use the available allowlist controls when appropriate.

## 3. What works on Android?

| Protection or feature               | Android behavior                                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| DNS domain filtering                | Can apply to apps using the configured Android DNS resolver                                                                   |
| Browser extension filtering         | Depends on browser compatibility and successful extension installation                                                        |
| Cosmetic filtering                  | Only available where a compatible extension can access and modify the page                                                    |
| Popunder neutralization             | Depends on supported browser-level protection                                                                                 |
| YouTube / YouTube Music ad blocking | Not guaranteed; behavior can vary by browser and site updates                                                                 |
| Native app page-level filtering     | Not provided by a browser extension                                                                                           |
| PWA dashboard                       | Provides access to the web interface, not automatic extension injection                                                       |
| Privacy                             | DNS requests are visible to the configured resolver; the audit's zero-telemetry claim is not the same as zero data visibility |

## 4. Example: A user watches a video on Android

[Orange and Synamedia Partner to Launch First Telco–Multi-CDN Solution - TechAfrica News](https://images.openai.com/static-rsc-4/cRNeg8naQ7AXsP0N9sBOPFPxm0E7Mty0QAB8kyhyVM7N5LASXSLO4mdyp01s4QGG02d9FMzMDi43KsfztBbGadVHMQ6nt_VqwN-Q7bDgO_RBSq5-_rP52TDg97fP4ChiqMIlgFiM2kCCGjqjV5FRkh2FIVJHPloN9zD9U7J0wAET7JpSDwcusMTWI8m7Kbc-?purpose=fullsize)

When the user opens a video website

- Private DNS may block requests to known advertising or tracking domains.
- A compatible browser extension may apply its supported browser-level rules.
- If ads are delivered through the same domain as the video, DNS filtering may not distinguish them.
- If the user watches through a native app, browser extension scripts do not apply to that app.

Important: Android PWA limitations

Adding BYEADS to the home screen does not make its browser extension scripts run inside the PWA. The audit reports mobile PWA testing, but the listed environment does not provide specific Android device, OS, browser or test details. The report's mobile PWA results therefore should not be treated as proof of verified Android compatibility.&#x20;



## 5. What still needs verification

Before publishing Android-specific claims, BYEADS should be tested on real Android devices with the exact browser and OS versions recorded. Tests should separately verify:

- Private DNS activation and behavior after switching between Wi-Fi and mobile data.
- Extension installation and filtering in each supported Android browser.
- Whether the PWA only displays the dashboard or has any separately documented protection integration.
- Website compatibility, including false positives and broken page elements.
- YouTube and YouTube Music behavior in mobile browsers versus native apps.
- DNS traffic and extension network activity, to substantiate privacy claims.

The audit mentions mobile PWA results, but it does not give enough Android-specific test evidence to establish that all these scenarios work.&#x20;


In short: On Android, Private DNS provides domain-level filtering, a compatible browser extension can provide browser-level protection, and the PWA offers convenient dashboard access. They are distinct parts of the setup—not one automatic, all-device ad-blocking system.

# BYEADS — iPhone (iOS): How It Works & User Workflow

Device 3 · Apple iPhone · Safari, DNS configuration and PWA

On an iPhone, BYEADS works differently from Windows and Android because iOS restricts how browser extensions, DNS filtering and web apps interact with the operating system. The main approaches are Safari content blocking (if BYEADS provides a compatible Safari extension), DNS filtering through a supported configuration, and the BYEADS web dashboard or PWA.

[How to use tabs and private browsing in Safari for iPhone and iPad | iMore](https://images.openai.com/static-rsc-4/iHydFTNU36gNrDHAkp8Dco2c_N6n9d7QX8A8kMspWeq_N--tIVZ8QFIhBk8I_zw5VgSpWrCSYumDQ9tbVVzWLgt6WqTZMIi4S5uGFWx1-m16R-EoKQRkSWdE0cB9W1b7jtJl3N-Rt7eTNEZyvZfYowqlAMBX7iWZeen0Xlhjh-ZW93OAM1U-lRQ4YQUpwfGz?purpose=fullsize)

## 1. How BYEADS works on iPhone

iPhone (iOS)

User opens Safari, a PWA or an app

Safari content blocker

Can block supported Safari requests if a compatible BYEADS content-blocking extension is provided and enabled.

DNS configuration

Can filter domain lookups when a compatible DNS configuration is installed and active.

The BYEADS PWA is a separate dashboard and setup interface.

Websites and apps

Filtering depends on the active protection method and iOS restrictions.

### The three approaches

- Safari content blocker: If BYEADS includes a compatible iOS Safari content-blocking extension, users can enable it in iPhone settings. A desktop Chrome or Firefox extension package cannot simply be installed on iOS Safari.
- DNS filtering: A compatible DNS profile or supported DNS configuration can filter selected domains. DNS filtering operates at the domain level and cannot inspect webpage elements or reliably distinguish ads served from the same domain as the content.
- PWA: Users can add the BYEADS website to their iPhone home screen. This provides convenient dashboard access, but does not automatically install a Safari content blocker or activate DNS filtering.

The audit describes Apple profile XML/Plist integrity checks, but this alone does not establish that a complete, installable BYEADS iOS DNS profile or Safari extension is available in the current release.&#x20;



## 2. iPhone user workflow

The workflow below is based on the protection methods described in the audit. Exact installation steps depend on the BYEADS iOS package actually provided.

1. Open the BYEADS website

   The user opens the BYEADS dashboard in Safari and reviews the iOS-specific setup instructions and available protection options.
2. Choose a supported protection method
   - If a compatible Safari content blocker is available, install it using its supported iOS installation method.
   - If a verified DNS profile or DNS hostname is provided, follow the corresponding iOS configuration instructions.
   - The user can access the dashboard as a PWA, but this is optional and does not replace either protection method.
3. Configure DNS, if supported

   The user installs the actual BYEADS-provided configuration using its documented method. iOS DNS profiles and encrypted DNS configurations may behave differently depending on the profile type, network and system configuration.

   Do not install a profile from an unverified source or assume that a generic profile is a BYEADS profile.
4. Enable the Safari content blocker, if available

   If BYEADS supplies a compatible Safari content blocker, the user enables it in iOS Safari extension or content-blocker settings, following the installation instructions for that package.
5. Add the dashboard to the home screen, if desired

   In Safari, the user can use the Share menu and select Add to Home Screen, if available. This creates a convenient way to reopen the dashboard; it does not grant the PWA browser-extension permissions.
6. Test and check the configuration

   The user visits ordinary websites and verifies whether the selected protection is active. If websites fail to load, they should review the configuration and available allowlist options.

## 3. What works on iPhone?

| Feature                       | iPhone behavior                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| DNS domain filtering          | Possible with a compatible, correctly installed DNS configuration                                                       |
| Safari content blocking       | Possible only if a compatible BYEADS iOS content blocker is provided and enabled                                        |
| Desktop browser extension     | Cannot be directly installed as an iOS Safari extension                                                                 |
| Cosmetic/page-level filtering | Depends on compatible Safari content-blocking functionality; not automatically provided by DNS                          |
| Native app ad blocking        | DNS may block selected domains, but cannot inspect app pages                                                            |
| YouTube / YouTube Music ads   | Not guaranteed; DNS filtering may not distinguish ads from content on shared domains                                    |
| PWA dashboard                 | Provides web access; does not automatically apply extension scripts                                                     |
| Privacy                       | DNS queries may be visible to the configured resolver; a zero-telemetry claim does not mean no network-level visibility |

## 4. Example: Watching YouTube on iPhone

[Mẹo Sửa Lỗi Không Xem Được Video Trên Safari Trong Nháy Mắt](https://images.openai.com/static-rsc-4/p8YciEthRwdjQu9juh3ccXld9mitiQcVAm6xO398bobL63qN-s7QfwqII_MLFwJbpeSTmL84H0Pz4ZD5gKoMQYOgy4uuPEgJxLcHLVDgh6YyY6JfaGft_x_QTVhx05KwBxUsY1XwS6YDSgJ-ofY8kc3fSVVq5HnFHyFHPYwcEq6HSYpwC-ifIhl0jCh6qnBb?purpose=fullsize)

When a user watches a video through Safari:

- A configured DNS service may block requests to known advertising or tracking domains.
- A compatible Safari content blocker may apply its supported blocking rules.
- Ads delivered through the same domains as video content may remain unaffected.
- When the user opens the native YouTube app, Safari content-blocking rules do not apply to that app.

Important iOS limitation

The audit's listed environment is Windows-based and does not document real iPhone device testing. Although it refers to Apple profile XML/Plist integrity, it does not establish that BYEADS has a verified iOS deployment with a functioning Safari content blocker and DNS profile.&#x20;



## 5. What needs to be verified before release

- Whether a working BYEADS iOS DNS profile or supported DNS configuration is available.
- Whether BYEADS provides an installable Safari content blocker, rather than only desktop extension packages.
- Whether the configuration works on supported iOS versions and across Wi-Fi and cellular networks.
- Whether the PWA is only a dashboard or has any separate, documented integration.
- Whether DNS and Safari filtering cause false positives or website compatibility problems.
- Whether privacy claims are supported by source review and observed network behavior.

In short: On iPhone, BYEADS uses the **wBlock Hybrid Architecture**: users install **wBlock** from the App Store and subscribe to the official BYEADS declarative filter list (`byeads-wblock-filters.txt`), avoiding Apple Developer account fees and keeping the software 100% free and open. Optional encrypted DNS can be configured for system-wide domain filtering, but is transparently acknowledged to not block in-stream video ads. The PWA provides dashboard monitoring access.

### iOS wBlock Setup Steps:
1. Install **wBlock** from the iOS App Store: `https://apps.apple.com/us/app/wblock/id6746388723`.
2. Open iPhone **Settings** > **Safari** > **Extensions** > toggle **wBlock** content blockers ON.
3. Open the **wBlock** app > tap **Filter Lists** > **+ Add Custom List** > paste:
   `https://raw.githubusercontent.com/LoopHora/BYEADS/main/public/byeads-wblock-filters.txt`
4. Tap **Save & Update**. Safari immediately applies high-speed WebKit compiled domain and cosmetic element blocking.

Okay, now I understand what you're describing. You want BYEADS to automatically recognize when a user has configured its DNS and added the BYEADS PWA to their iPhone home screen, then activate the dashboard with live protection status and monitoring, rather than showing a static dashboard with manual setup instructions.

The idea is to make BYEADS feel like a native security app, where the dashboard reflects the device's actual protection state.

# BYEADS — Automatic Device Detection & Live Dashboard

Proposed user experience for iPhone, with a similar approach possible on Android.

[Smart Cybersecurity Mobile App Design. by MaMuN AhAmEd on Dribbble](https://images.openai.com/static-rsc-4/mboI85MOt7QLjcr8We7BYKpPZRM-EWDUtsYW8F7AzO5rTswOl8HK-596HyvXkqgzc5r8lC5vkJzRBCQ_kMcyKLe1PATZAnxtW2U09usLsbMZ4oFEeTlPWEcHYwdd2pJWoWi0labWceiiQCdHJJRV0nOZ8gdTtxYuk2G1gXDR51OM6YvcZ1pWi771X8D399jI?purpose=fullsize)

Illustrative dashboard concept, not a screenshot of the current BYEADS app.

## 1. How the user workflow should work

1. User opens BYEADS website

   The user visits BYEADS in Safari and opens the setup page, where they can see instructions for configuring DNS and adding the dashboard to their home screen.
2. User configures BYEADS DNS

   The user installs or configures the supported DNS profile or provider. DNS filtering can now work through that configuration, subject to the device and network.
3. User adds BYEADS to the home screen

   The user adds the BYEADS PWA to their iPhone home screen and launches it like an app.
4. BYEADS checks the connection

   When opened, the PWA can perform a verification request to a BYEADS-controlled endpoint to check whether the configured DNS path appears to be in use. It can also verify that the dashboard itself is reachable.
5. Dashboard displays the verified status

   If the checks succeed, the dashboard can show that DNS verification passed, along with the monitoring data that BYEADS can genuinely access.
6. Live monitoring while available

   The dashboard refreshes its monitoring information while open, using permitted network requests or data from the DNS service. If the user closes the PWA or iOS suspends it, live updates may pause.

## 2. What the dashboard can detect

| Status                  | What BYEADS can verify                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| PWA opened              | The user launched the BYEADS web app                                       |
| DNS verification passed | A test request appears to have used the expected DNS path                  |
| DNS verification failed | The expected DNS path could not be verified                                |
| DNS service reachable   | BYEADS can communicate with its configured verification endpoint           |
| Live monitoring         | Recent activity data is being received from a supported monitoring source  |
| Protection active       | Only the protection components that have actually been verified are active |
| Monitoring paused       | The PWA is not currently receiving fresh monitoring updates                |

An important distinction: Adding a PWA to the home screen does not give it permission to inspect iOS system settings or automatically read all DNS queries. A successful DNS test also does not prove that every app on the device is using that DNS service.

## 3. How real monitoring could work

iPhone

PWA + configured DNS

DNS resolver

Receives DNS queries and applies domain-filtering rules

Monitoring data source

Provides permitted aggregate statistics or privacy-conscious device-linked events

BYEADS dashboard

Displays received statistics, timestamps and connection status

To deliver this, BYEADS would need a DNS service or resolver that exposes suitable monitoring information, plus a secure way to associate the data with the user's device or account. A PWA could retrieve the permitted statistics from a backend and display them.

For example, the dashboard could show:

- DNS requests observed by the configured resolver.
- Requests blocked by the resolver.
- Recently blocked domains, if logging is enabled and appropriate.
- Last successful DNS verification.
- Last time monitoring data was received.
- Current connection or monitoring state.

The figures must come from actual measurements. BYEADS should not generate simulated request counts and display them as live protection.

## 4. The iPhone-specific limitation

DNS configured does not mean the PWA can monitor the whole device.

iOS does not give an ordinary PWA unrestricted access to system DNS settings, all device network requests, or background network activity. DNS profile installation and DNS-level filtering are separate from the dashboard's ability to read monitoring data.

So BYEADS can verify its own DNS endpoint in a controlled test, but it cannot claim that every app or every DNS request on the iPhone is protected merely because that test passed.

For genuine device-wide DNS monitoring, BYEADS would need a compatible DNS provider with reporting, or a suitable native iOS implementation and the required Apple-supported capabilities. The PWA can then display the information provided by that system, within iOS's restrictions.

## 5. Recommended dashboard states

DNS verified

Connected

The expected DNS verification endpoint responded successfully.

Filtering

Verified

The resolver confirms that filtering rules are enabled.

Live monitoring

Waiting for data

No recent monitoring data has arrived yet. Do not show invented activity.

Device-wide protection

Not verified

The PWA cannot independently confirm that every app and network request uses the configured DNS.

These statuses should remain independent. For example, DNS might be verified while the monitoring backend is temporarily unreachable.

## 6. The key design decision

There are two different levels of BYEADS:

- PWA-based BYEADS: A web dashboard that can check connectivity, perform limited verification and display data from a DNS provider or backend.
- Native-integrated BYEADS: An iOS app using supported Apple capabilities, paired with a compatible DNS service, that may provide richer device status and monitoring.

If your goal is a home-screen app that automatically becomes active after DNS setup, the PWA can support a useful version of that experience, but it cannot independently detect every system-level configuration or provide unrestricted device-wide monitoring.

The core principle: BYEADS should automatically show the protection it has actually verified, distinguish it from protection that is merely configured, and clearly indicate when monitoring is unavailable. This will make the dashboard useful without misleading users about what their iPhone is protecting.

Yes. BYEADS can use a similar automatic activation and live dashboard workflow on Android, and Android offers some additional possibilities compared with iOS. However, adding BYEADS to the home screen and configuring Private DNS still do not automatically give the PWA access to all device network activity.

# BYEADS — Android: Automatic Device Detection & Live Monitoring

Proposed Android user experience · Private DNS + PWA dashboard

[Next Dash DNS | Controle Rápido, Seguro e Inteligente do NextDNS](https://images.openai.com/static-rsc-4/C30Nc0FVHSAIheRkAoIecxoJMq2gf7yzjmbg1yfda-mgwHeYe-QhgmwqJLt5c_zJ_AYyAIWi8CyDcHC1sn6i2htL0qPlVzLvAwDrcSy1zxd4o1vnWFs2I_A2xq-Cz35tac9ou7bBLsqevokd-Ddz7PKCxtrQuD9ktBE3I2rZE5wv3feM3lh1J_SWfzxZYGBO?purpose=fullsize)

## 1. How it works

Android smartphone

User opens BYEADS and configures protection

Private DNS

Filters supported domain lookups through the configured resolver.

BYEADS PWA

Provides the dashboard, verification and monitoring display.

BYEADS monitoring service

Supplies genuine DNS activity and filtering statistics, if the resolver supports reporting.

Verified dashboard

Shows connection state, filtering status and the latest available monitoring data.

## 2. Android user workflow

1. Open BYEADS

   The user visits the BYEADS website in a compatible Android browser and starts the Android setup process.
2. Configure Android Private DNS

   The user enters the verified BYEADS DNS provider hostname in Android's Private DNS settings, where supported. The exact settings path varies by device and Android version.
3. Add BYEADS to the home screen

   The user selects the browser's Add to Home screen or Install app option, where available, and launches the PWA.
4. Automatically verify DNS

   On opening, BYEADS can contact a verification endpoint and check whether the request appears to arrive through the expected DNS configuration. This confirms the tested route, not necessarily every app's DNS usage.
5. Activate the verified dashboard

   The PWA displays the actual results: DNS verification, resolver status, filtering status and whether recent monitoring data is available.
6. Monitor while using the app

   The dashboard refreshes from the monitoring service while it is open. If Android suspends the PWA or network access is lost, updates may pause until the app is active again.

## 3. Example of the live dashboard

BYEADS Protection

DNS verified

Illustrative dashboard layout; these are sample placeholders, not real device readings.

DNS requests

# —

Waiting for data

Blocked requests

# —

Waiting for data

DNS connection

Verified

Last check: on opening

Live monitoring

Not connected

No monitoring feed yet

Device-wide protection cannot be confirmed from a DNS test alone.

## 4. What Android can detect

| Capability                                  | Possible with PWA + Private DNS?                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| Detect that BYEADS PWA is open              | Yes                                                                            |
| Verify access to BYEADS endpoint            | Yes                                                                            |
| Test whether DNS appears to use BYEADS      | Yes, with a suitable verification design                                       |
| Read Android's Private DNS setting directly | No, not from an ordinary PWA                                                   |
| View all device DNS queries                 | No, not without reporting from the DNS service or another authorized component |
| Show real blocked-domain statistics         | Yes, if the DNS provider supplies the data                                     |
| Monitor while PWA is closed                 | Not reliably with an ordinary PWA                                              |
| Confirm all apps are protected              | No, not from the PWA's own checks                                              |
| Browser extension protection                | Only in compatible Android browsers where the extension is supported           |

## 5. Android versus iPhone

| Feature                                   | Android                                                 | iPhone                                           |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| Private DNS                               | System setting for a DNS hostname on supported versions | Uses supported DNS profiles or configurations    |
| PWA dashboard                             | Yes                                                     | Yes                                              |
| PWA reads system DNS setting              | No, not directly                                        | No, not directly                                 |
| Extension-based browser protection        | Depends on compatible browser                           | Safari requires a compatible iOS content blocker |
| Monitoring from DNS provider              | Possible if provider exposes data                       | Possible if provider exposes data                |
| Background PWA monitoring                 | Limited by OS lifecycle                                 | Limited by iOS lifecycle                         |
| Device-wide DNS visibility from PWA alone | No                                                      | No                                               |

## 6. What BYEADS needs to implement

For this experience to be real, BYEADS needs:

- A verified Android Private DNS hostname and clear configuration instructions.
- A DNS verification endpoint that distinguishes successful verification from an inconclusive result.
- A monitoring backend or DNS-provider integration that returns genuine statistics.
- Secure device or user association, with clear consent and privacy controls.
- Dashboard states that separate DNS connectivity, filtering enabled, monitoring availability and device-wide protection.
- A refresh strategy that respects Android's background restrictions and avoids implying continuous monitoring when the PWA is suspended.

The existing audit describes DNS configuration and a PWA dashboard, but does not establish that this complete Android auto-detection and live-monitoring system is already implemented or validated.

The intended experience: The user configures DNS once, adds BYEADS to the home screen, and opens it to see a dashboard that automatically checks the connection and displays genuine monitoring data. Android can support this workflow, but real device-wide monitoring requires a suitable DNS reporting service or a separate, properly authorized native component—not just the PWA.