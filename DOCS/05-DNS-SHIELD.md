# BYEADS — DNS Shield v1.0

## Status
- Finalized planning baseline.
- Implementation must follow the shared BYEADS architecture.

1. DNS Shield is the first system-wide protection layer.
2. DoH is supported by the service.
3. DoT is supported by the service.
4. Plain DNS may exist for compatibility but secure transport is preferred.
5. Requests are normalized before rule lookup.
6. Domain rules are indexed.
7. Allowed queries use configured upstream resolution.
8. Blocked queries use a documented response strategy.
9. Advertising domains can be blocked.
10. Tracking domains can be blocked.
11. Malware domains can be blocked.
12. Phishing domains can be blocked.
13. Scam domains can be blocked.
14. Telemetry domains can be blocked.
15. User blocklists are supported.
16. User allowlists are supported.
17. Rules contain provenance.
18. Rules contain confidence.
19. Rules contain expiration.
20. Rules contain version metadata.
21. DNS cache is bounded.
22. DNS cache uses TTL.
23. Resolver health is monitored.
24. Upstream failure has documented behavior.
25. Encrypted transport is preferred.
26. Administrative endpoints are isolated.
27. Public resolver endpoints need abuse controls.
28. Rate limiting is required where appropriate.
29. DNS packets are validated.
30. Rule updates are atomic.
31. Rule bundles are signed.
32. Bad bundles are rejected.
33. Last known-good bundles remain available.
34. Full DNS histories are not retained by default.
35. Operational logs are minimized.
36. Android Private DNS is a supported configuration path.
37. Apple DNS Settings is a supported configuration path.
38. Windows 11 DoH is a supported configuration path.
39. macOS DNS Settings is a supported configuration path.
40. DNS cannot perform all page-level filtering.
41. Web Shield is required for deeper browser protection.
42. DNS must be low latency.
43. Local rule lookup should be fast.
44. Remote intelligence is not required for every query.
45. Rule updates should use deltas.
46. Public infrastructure should support horizontal scaling.
47. Self-hosting is supported.
48. Configuration is documented.
49. Diagnostic status is required.

## Implementation notes
- This document is normative unless another document explicitly defines a more specific interface.
- Security-sensitive behavior must be covered by regression tests.
- Product claims must remain consistent with measured capabilities.
- Platform limitations must be documented rather than hidden.
- Public infrastructure must not require users to surrender unnecessary browsing data.
- The software remains intended as free/open-source defensive tooling.
- Maintenance requirement 64: keep this document synchronized with the canonical BYEADS implementation and release tests.
- Maintenance requirement 65: keep this document synchronized with the canonical BYEADS implementation and release tests.
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
