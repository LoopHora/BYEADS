# BYEADS — Risk Decision Engine v1.0

## Status
- Finalized planning baseline.
- Implementation must follow the shared BYEADS architecture.

1. Risk Engine produces allow, warn, or block.
2. Evidence is grouped by reputation, behavior, and consistency.
3. Strong signals have more influence than weak signals.
4. One weak signal should not produce a malicious verdict.
5. Multiple independent signals can increase confidence.
6. Verified malicious indicators can block.
7. Destination mismatch is contextual.
8. Redirect anomalies are contextual.
9. Download mismatch is contextual.
10. Type mismatch is contextual.
11. Popup anomalies are contextual.
12. User block policy can block.
13. User allow policy is reversible.
14. Emergency global blocks may override normal allow.
15. Reason codes are mandatory.
16. Confidence is represented explicitly.
17. Heuristic detections avoid false certainty.
18. Risk model versions are tracked.
19. Benign corpora are maintained.
20. Threat corpora are maintained.
21. Precision is measured.
22. Recall is measured.
23. False-positive rate is measured.
24. False-negative rate is monitored where possible.
25. Remote intelligence is cached.
26. Local decisions run first.
27. Decision latency is measured.
28. UI explanations use reason codes.
29. Security events should not store full history by default.
30. Policy precedence is documented.
31. Exceptions are audited locally where needed.
32. Rule updates can change decisions.
33. Rule version is recorded in diagnostics.
34. Model version is recorded in diagnostics.
35. Unknown state is allowed.
36. Fail-open versus fail-closed behavior is policy-specific.
37. Critical malicious infrastructure should use stronger enforcement.
38. Normal sites should not be disrupted by weak heuristics.
39. Download size alone is insufficient.
40. Filename alone is insufficient.
41. MIME alone is insufficient.
42. Redirect count alone is insufficient.
43. Popup alone is insufficient.
44. Reputation alone can be sufficient when verified.
45. Decision engine must be deterministic for the same policy and inputs.
46. Testing uses fixed fixtures.
47. Regression tests preserve security behavior.
48. Performance must meet budget.
49. Privacy constraints are enforced.
50. User explanations must remain understandable.
51. Policy semantics are shared across platforms.

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
