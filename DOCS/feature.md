You're right. I narrowed BYEADS too much toward DNS filtering in my previous response. Our original plan was to build a layered protection system that detects threats before, during and after a user's interaction with a website—not simply block ad domains.

# BYEADS — Our agreed product scope

Free · Open source · Privacy-first · Cross-platform · Maximum practical protection

# BYEADS

One protection system across devices

Detect · Analyze · Warn · Block · Explain

DNS Shield

Blocks known ad, tracker, phishing, scam and malicious domains.

Web Shield

Analyzes URLs, redirects, pop-ups and suspicious web activity.

Deception Engine

Identifies potentially fake buttons, deceptive ads and misleading download controls.

Download Guard

Checks download details, file reputation and possible inconsistencies.

Threat Intelligence

Uses maintained threat feeds, reputation signals and detection rules.

Protection Control

Manages profiles, exceptions, device settings and explanations.

These are the core modules we had discussed, with DNS as the shared foundation—not the entire product.&#x20;

## 1. How the protection should work

1. The user opens a website

   DNS Shield checks whether the requested domain is on known ad, tracker or threat lists. A listed domain can be blocked before the connection is made.
2. The website starts loading

   Where the browser extension has permission, Web Shield analyzes relevant navigation, URLs, page requests, pop-ups and redirects. It checks for known dangerous destinations and suspicious behavior.
3. The user sees a button or link

   Deception Engine examines signals such as the button's destination, surrounding text, visual context, redirect behavior and whether the action matches the website's stated download. It distinguishes a likely genuine action from a potentially misleading one.
4. The user initiates a download

   Download Guard compares available information such as the advertised filename and size, the observed response, file type and known reputation signals. It can warn when information conflicts or a file has a suspicious reputation.
5. BYEADS decides what to do

   The system returns an explainable decision: allow, warn or block. The user can see which signal caused the warning and can report a false positive.

## 2. Real versus fake download-button detection

This was a specific part of our original idea, and it should remain a core feature.

Illustrative analysis

Likely legitimate

Download document

Destination matches the page's stated download, with a consistent file type and plausible size.

Suspicious

Download now

Unexpected redirect, unrelated destination, mismatched file details or a known malicious domain.

These are example outcomes, not a claim that button appearance alone can prove legitimacy.

The engine should compare multiple characteristics, not just whether a button looks like a download button. A legitimate website can have third-party ads, and a fake button can imitate a real one. The decision therefore needs multiple signals and a confidence level.

### Advertised versus actual download size

For the example we discussed:

| Website says | Observed download | BYEADS response                                    |
| ------------ | ----------------- | -------------------------------------------------- |
| 300 MB       | 321 MB            | May be consistent with rounded or approximate size |
| 300 MB       | 275 MB            | Check compression, versions and metadata           |
| 300 MB       | 95 MB             | Flag a significant unexplained discrepancy         |
| 300 MB       | 300 MB            | Size is consistent, but not proof of safety        |

BYEADS should account for rounding, units, compression, different versions, partial downloads and redirects. A size mismatch is a warning signal, not proof that a file is malicious. The product should communicate the reason for concern without making unsupported accusations.

## 3. Redirect and pop-up protection

BYEADS should identify and handle:

- Known malicious and phishing destinations.
- Redirect chains that lead to suspicious or unrelated sites.
- Pop-ups and tabs opened without a clear user action, where browser APIs permit detection.
- Links whose actual destination differs from their visible description.
- Download prompts that lead to unrelated software or suspicious file types.
- Repeated redirects or suspicious navigation patterns.

DNS Shield can block known dangerous destination domains, while Web Shield can examine navigation context in supported browsers. Neither layer can reliably identify every new malicious redirect, particularly when the page uses encrypted connections, browser restrictions or platform-specific behavior.

## 4. Platform coverage — the actual product plan

| Platform                | BYEADS experience                                        | Intended protection                                                                                    |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| iOS / iPadOS            | Home-screen PWA plus user-approved encrypted DNS profile | DNS Shield, setup guidance, status and reporting; browser-level protection subject to iOS capabilities |
| Android                 | Home-screen PWA plus Android Private DNS                 | System-wide DNS filtering; optional browser extension where supported                                  |
| Windows                 | PWA, encrypted DNS setup and browser extension           | DNS Shield plus browser-level Web Shield and Deception Engine                                          |
| macOS                   | PWA, encrypted DNS profile and browser extension         | DNS Shield and supported browser-level protection                                                      |
| Chrome / Edge / Firefox | Open-source browser extension                            | URL and redirect checks, page-level filtering and deceptive-button warnings within permissions         |
| Home router             | DNS configuration                                        | Domain filtering for compatible devices on the network                                                 |

The PWA is the installation and management interface, not a replacement for operating-system networking permissions. Apple documents encrypted DNS settings separately from advanced content filtering and URL filtering. Some deeper system-wide filtering features require native Network Extension capabilities, appropriate entitlements or platform-specific distribution arrangements.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.apple.com\&sz=32)

Apple Support

+3



That means we can make the PWA the main entry point and avoid requiring an app-store release for the initial DNS service, but we must not claim that installing the PWA alone provides every protection layer.

## 5. What we build

### Shared protection core

- DNS resolver with encrypted DoH and DoT.
- Central policy engine for allow, warn and block decisions.
- Ad, tracker, phishing, scam and malicious-domain filtering.
- Threat-feed ingestion, validation and updates.
- Rule management and false-positive reporting.
- Minimal, privacy-preserving operational monitoring.

### Web and device protection

- Browser extension for navigation and page-level filtering.
- Redirect and pop-up analysis.
- Deceptive-button and fake-download detection.
- Download metadata comparison and reputation checks.
- Cross-platform PWA setup and protection dashboard.
- Native integration only where needed and supported by the platform.
  ### Trust and open-source infrastructure
- Public source code and self-hosting instructions.
- Reproducible builds and automated testing.
- Documented threat-feed sources and rule provenance.
- Clear privacy policy, retention limits and security reporting.
- Transparent warnings, exception controls and uninstall instructions.

## 6. What we must not lose from the original vision

- Maximum practical coverage: multiple layers, not DNS-only filtering.
- Mobile-first: prioritize the deceptive redirects, pop-ups and download traps that users encounter on phones.
- One shared engine: consistent policy and threat intelligence across platforms.
- No paid extension or subscription: core protection and source code remain free and open source.
- No unnecessary data collection: avoid building browsing profiles or retaining users' browsing history.
- No false guarantees: measure and disclose actual coverage, bypasses and unsupported cases.
- User agency: explain why a request was blocked or flagged, and provide carefully controlled exceptions.

## 7. The implementation order

1. Foundation: threat-rule format, DNS Shield, encrypted DNS, policy engine, performance testing and resolver verification.
2. PWA: BYEADS dashboard, install guidance, iOS profile workflow, Android Private DNS instructions, Windows and macOS configuration guides, and real connection checks.
3. Browser protection: extension, navigation and redirect checks, pop-up handling, cosmetic filtering and clear permission boundaries.
4. Deception Engine: page and button characteristics, destination comparison, suspicious interaction patterns and confidence-based warnings.
5. Download Guard: metadata checks, approximate-size tolerance, file-type checks, reputation and risk explanations.
6. Release readiness: cross-platform testing, false-positive review, privacy and security audit, self-hosting documentation and open-source release.

The final architecture should treat every module as a separately testable component. DNS filtering can work across the operating system, while the browser extension provides contextual detection that DNS cannot see. On iOS, we should accurately distinguish the capabilities of an installed DNS profile from those of a native filtering extension.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.apple.com\&sz=32)

Apple Support

+2



So, what we're building is not merely an AdGuard DNS alternative. BYEADS is a layered, open-source web safety and deception-detection platform, with DNS protection, browser intelligence, fake-button analysis, redirect protection and download-risk checks working together wherever each platform allows.