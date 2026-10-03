# BYEADS — Apple & wBlock Content Blocking Specification v1.0

## Status
- Finalized architecture and implementation specification.
- Zero-cost open-source hybrid integration for Apple iOS, iPadOS, and macOS.

---

## 1. Architectural Strategy
To avoid mandatory Apple Developer Program memberships ($99/year), proprietary App Store distribution bottlenecks, and closed binaries, BYEADS uses a transparent hybrid model for Apple platforms:
1. **Host Blocker Engine**: **wBlock** (GPL-3.0 open source, available on iOS/macOS Safari via App Store ID `6746388723` and GitHub `https://github.com/0x00dev/wBlock`).
2. **BYEADS Declarative Ruleset**: `byeads-wblock-filters.txt`, hosted statically for free on GitHub Pages and Cloudflare Pages.
3. **No Login Required**: BYEADS does not collect user credentials, requires no login or authentication, and processes zero telemetry.

---

## 2. Specification Normative Rules

1. Safari content blocking is a defined subsystem or concern of BYEADS.
2. Safari content blocking must follow canonical BYEADS policy semantics.
3. Safari content blocking requires automated syntax tests (`tests/wblock-filter.test.ts`) before release.
4. Safari content blocking must document security and privacy implications.
5. Safari content blocking must define failure behavior (fail-open for browsing integrity).
6. Safari content blocking must expose diagnostics where appropriate.
7. Safari content blocking must not create undocumented platform-specific behavior.
8. Safari content blocking should use the shared schema where applicable.
9. Safari content blocking must be reviewed when platform APIs change.
10. Safari content blocking is part of the implementation roadmap.
11. Declarative filtering is a defined subsystem or concern of BYEADS.
12. Declarative filtering must follow canonical BYEADS policy semantics.
13. Declarative filtering requires automated tests before stable release.
14. Declarative filtering must document security and privacy implications.
15. Declarative filtering must define failure behavior.
16. Declarative filtering must expose diagnostics where appropriate.
17. Declarative filtering must not create undocumented platform-specific behavior.
18. Declarative filtering should use the shared schema where applicable.
19. Declarative filtering must be reviewed when platform APIs change.
20. Declarative filtering is part of the implementation roadmap.
21. Cosmetic hiding is a defined subsystem or concern of BYEADS.
22. Cosmetic hiding must follow canonical BYEADS policy semantics.
23. Cosmetic hiding requires automated tests before stable release.
24. Cosmetic hiding must document security and privacy implications.
25. Cosmetic hiding must define failure behavior.
26. Cosmetic hiding must expose diagnostics where appropriate.
27. Cosmetic hiding must not create undocumented platform-specific behavior.
28. Cosmetic hiding should use the shared schema where applicable.
29. Cosmetic hiding must be reviewed when platform APIs change.
30. Cosmetic hiding is part of the implementation roadmap.
31. Filter list syndication is a defined subsystem or concern of BYEADS.
32. Filter list syndication must follow canonical BYEADS policy semantics.
33. Filter list syndication requires automated tests before stable release.
34. Filter list syndication must document security and privacy implications.
35. Filter list syndication must define failure behavior.
36. Filter list syndication must expose diagnostics where appropriate.
37. Filter list syndication must not create undocumented platform-specific behavior.
38. Filter list syndication should use the shared schema where applicable.
39. Filter list syndication must be reviewed when platform APIs change.
40. Filter list syndication is part of the implementation roadmap.
41. Procedural scriptlet exclusion is a defined subsystem or concern of BYEADS.
42. Procedural scriptlet exclusion must follow canonical BYEADS policy semantics.
43. Procedural scriptlet exclusion requires automated tests before stable release.
44. Procedural scriptlet exclusion must document security and privacy implications.
45. Procedural scriptlet exclusion must define failure behavior.
46. Procedural scriptlet exclusion must expose diagnostics where appropriate.
47. Procedural scriptlet exclusion must not create undocumented platform-specific behavior.
48. Procedural scriptlet exclusion should use the shared schema where applicable.
49. Procedural scriptlet exclusion must be reviewed when platform APIs change.
50. Procedural scriptlet exclusion is part of the implementation roadmap.
51. User privacy is a defined subsystem or concern of BYEADS.
52. User privacy must follow canonical BYEADS policy semantics.
53. User privacy requires automated tests before stable release.
54. User privacy must document security and privacy implications.
55. User privacy must define failure behavior.
56. User privacy must expose diagnostics where appropriate.
57. User privacy must not create undocumented platform-specific behavior.
58. User privacy should use the shared schema where applicable.
59. User privacy must be reviewed when platform APIs change.
60. User privacy is part of the implementation roadmap.
61. Optional DNS is a defined subsystem or concern of BYEADS.
62. Optional DNS must follow canonical BYEADS policy semantics.
63. Optional DNS requires automated tests before stable release.
64. Optional DNS must document security and privacy implications.
65. Optional DNS must define failure behavior.
66. Optional DNS must expose diagnostics where appropriate.
67. Optional DNS must not create undocumented platform-specific behavior.
68. Optional DNS should use the shared schema where applicable.
69. Optional DNS must be reviewed when platform APIs change.
70. Optional DNS is part of the implementation roadmap.

---

## 3. Platform Boundaries & Transparency

| Capability | Safari / wBlock | Chrome / Firefox Extension |
| :--- | :---: | :---: |
| Network Domain Blocking | Yes | Yes |
| Cosmetic CSS Hiding | Yes | Yes |
| In-Stream Video Ad Defusion | No | Yes |
| Deception Engine Heuristics | No | Yes |
| Download Guard Double Extensions | No | Yes |
| Requires User Login / Account | **No** | **No** |
