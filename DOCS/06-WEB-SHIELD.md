# BYEADS — Web Shield v1.0

## Status
- Finalized planning baseline.
- Implementation must follow the shared BYEADS architecture.

1. Web Shield is the browser-level protection layer.
2. Chromium is the first browser target.
3. Manifest V3 is used.
4. TypeScript is used.
5. Service worker architecture is used.
6. declarativeNetRequest is the primary request filtering mechanism.
7. Static rules handle stable global rules.
8. Dynamic rules handle user policy.
9. Session rules handle temporary state.
10. Host permissions are minimized.
11. Request blocking is declarative where practical.
12. Redirect rules are declarative where practical.
13. HTTPS upgrade rules may be used.
14. Header modification is used only where necessary.
15. Page instrumentation is limited.
16. Navigation context is short-lived.
17. Popup behavior can be correlated with clicks where APIs permit.
18. Download metadata can be analyzed where exposed.
19. URL reputation is integrated.
20. Domain reputation is integrated.
21. Redirect intelligence is integrated.
22. Deception Engine is integrated.
23. Download Guard is integrated.
24. User interface is minimal.
25. Status shows protection state.
26. Status shows relevant blocked counts.
27. Allowlist is available.
28. Blocklist is available.
29. False-positive reporting is available.
30. Permissions are documented.
31. Remote code is not used.
32. Content Security Policy is enforced.
33. Messages between extension components are validated.
34. Browser APIs have limits.
35. Firefox will use a separate adapter.
36. Safari will use a separate adapter.
37. Core policy remains shared.
38. Rules are versioned.
39. Rules are signed.
40. Rule updates are atomic.
41. Extension startup should be lightweight.
42. Page CPU impact must be measured.
43. Memory impact must be measured.
44. Ruleset limits are respected.
45. Regex rules are minimized.
46. Large rulesets are partitioned.
47. Declarative rules are preferred over constant polling.
48. Browser tests cover positive and negative cases.
49. Security tests cover permission boundaries.
50. Privacy tests cover unnecessary data access.
51. Release requires browser regression tests.

## Implementation notes
- This document is normative unless another document explicitly defines a more specific interface.
- Security-sensitive behavior must be covered by regression tests.
- Product claims must remain consistent with measured capabilities.
- Platform limitations must be documented rather than hidden.
- Public infrastructure must not require users to surrender unnecessary browsing data.
- The software remains intended as free/open-source defensive tooling.
- Maintenance requirement 66: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 67: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 68: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 69: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 70: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 71: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 72: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 73: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 74: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 75: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 76: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 77: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 78: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 79: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 80: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 81: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 82: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 83: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 84: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 85: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 86: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 87: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 88: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 89: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 90: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 91: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 92: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 93: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 94: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 95: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 96: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 97: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 98: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 99: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 100: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 101: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 102: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 103: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 104: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 105: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 106: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 107: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 108: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 109: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 110: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 111: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 112: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 113: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 114: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 115: keep this document synchronized with the canonical BYEADS implementation and release tests.
