import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText, CheckCircle2, Menu, Search, X } from 'lucide-react';

/* ===== Document Registry ===== */
interface DocEntry {
  id: string;
  alias?: string;
  title: string;
  category: string;
  content: DocContent;
}

interface DocContent {
  heading: string;
  status: string;
  sections: { title: string; items: string[] }[];
}

const docs: DocEntry[] = [
  {
    id: '01',
    title: 'Product Specification',
    category: 'Overview',
    content: {
      heading: 'BYEADS — Product Specification v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Core Principles',
          items: [
            'BYEADS is a free, open-source LoopHora protection product',
            'Primary goal: reduce ads, trackers, malicious destinations, deceptive redirects, and unsafe download behavior',
            'Combines DNS protection with browser-level protection',
            'Mobile protection is a first-class priority',
            'User control and privacy are core requirements',
          ],
        },
        {
          title: 'Security Posture',
          items: [
            'Must not claim perfect or universal detection',
            'Known threats and heuristic observations must be clearly distinguished',
            'Security decisions should be explainable',
            'Not an antivirus replacement',
            'Does not secretly break TLS or bypass OS security controls',
            'Does not collect credentials',
          ],
        },
        {
          title: 'Architecture Principles',
          items: [
            'DNS is the first layer, not the entire product',
            'Web Shield handles browser-level behavior',
            'Deception Engine compares page claims with observed outcomes',
            'Download Guard evaluates download metadata and context',
            'Redirect Intelligence evaluates navigation chains',
            'Threat Intelligence provides normalized indicators',
            'Risk Engine combines independent signals',
          ],
        },
        {
          title: 'Policy & Rules',
          items: [
            'Allow, warn, and block are the primary decisions',
            'Warnings should explain the evidence',
            'False positives must have a recovery path',
            'Rules should be signed before distribution',
            'Invalid updates must be rejected',
            'Previous good rules must remain available for rollback',
          ],
        },
        {
          title: 'Performance & Privacy',
          items: [
            'Domain rules should be indexed for fast lookup',
            'Remote intelligence should be cached',
            'Normal browsing should not depend on remote request for every resource',
            'Browser rules should prefer declarative enforcement',
            'Mobile battery impact must be treated as a performance requirement',
            'Privacy telemetry should be minimized',
          ],
        },
      ],
    },
  },
  {
    id: '02',
    title: 'System Architecture',
    category: 'Overview',
    content: {
      heading: 'BYEADS — System Architecture v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Core Architecture',
          items: [
            'Shared BYEADS Core is the center of the architecture',
            'Core modules: policy, rules, intelligence, reputation, redirect analysis, deception, download analysis, decisions, explanations',
            'Platform adapters translate shared semantics into native enforcement',
          ],
        },
        {
          title: 'Architectural Planes',
          items: [
            'DNS Plane handles encrypted DNS requests',
            'Browser Plane handles request and navigation protection',
            'Intelligence Plane manages normalized indicators',
            'Decision Plane combines signals',
            'Control Plane manages user policy',
          ],
        },
        {
          title: 'Performance & Reliability',
          items: [
            'Local checks preferred on hot paths',
            'Caches reduce remote latency',
            'Incremental rule updates reduce bandwidth',
            'Atomic rule activation prevents partial updates',
            'Signed bundles protect rule integrity',
            'Failure preserves last known-good configuration',
          ],
        },
        {
          title: 'Technology Assignments',
          items: [
            'Browser extensions use service workers (Manifest V3 for Chromium)',
            'Firefox and Safari use adapters',
            'Android uses Kotlin, Apple apps use Swift',
            'Rust is the shared security-sensitive core language',
            'TypeScript for web and extension interfaces',
            'PostgreSQL optional for durable intelligence metadata',
            'Redis optional for cache and coordination',
          ],
        },
      ],
    },
  },
  {
    id: '03',
    title: 'Threat Model',
    category: 'Security',
    content: {
      heading: 'BYEADS — Threat Model v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Threat Actors in Scope',
          items: [
            'Malvertising operators',
            'Phishing operators',
            'Scam operators',
            'Deceptive download operators',
            'Redirect abuse actors',
            'Compromised advertising infrastructure',
          ],
        },
        {
          title: 'Attack Surfaces',
          items: [
            'Malicious domains',
            'Fake store pages',
            'Mobile-specific deceptive flows',
            'DNS query manipulation at network boundary',
            'Rule poisoning (supply-chain threat)',
            'Click hijacking',
          ],
        },
        {
          title: 'Key Detection Signals',
          items: [
            'Destination mismatch',
            'Download mismatch (size, filename, MIME, type)',
            'Redirect count and behavior',
            'Popup behavior',
            'Browser danger signals',
          ],
        },
        {
          title: 'Security Guarantees',
          items: [
            'Threat decisions must be explainable',
            'Risk levels must reflect evidence strength',
            'Allowlisting must be reversible',
            'Update signatures protect integrity',
            'Rate limiting and input validation protect APIs',
            'Dependency scanning reduces supply-chain risk',
          ],
        },
      ],
    },
  },
  {
    id: '04',
    title: 'Deception Engine',
    category: 'Shields',
    content: {
      heading: 'BYEADS — Deception Engine v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Detection Model',
          items: [
            'Compares a page claim with an observed outcome',
            'Model: Claim → Action → Navigation → Result → Consistency',
            'Claims include filenames, file sizes, file types, application names, destinations',
            'Claims are untrusted page metadata',
          ],
        },
        {
          title: 'Analysis Capabilities',
          items: [
            'Filename comparison is normalized',
            'Extension changes are notable',
            'Large unexplained size differences increase risk',
            'Size alone never proves maliciousness',
            'Destination mismatch increases risk',
            'Multiple unrelated redirects increase risk',
          ],
        },
        {
          title: 'Decision Outcomes',
          items: [
            'Known malicious destinations → block',
            'Medium-confidence deception → warning',
            'Low-confidence inconsistency → inform only',
            'Risk signals should be independent where possible',
          ],
        },
        {
          title: 'Test Categories',
          items: [
            'Fake download buttons (primary positive test)',
            'Legitimate CDN redirects (required negative test)',
            'Authentication, language, regional redirects (negative tests)',
            'Popup-triggered downloads, unexpected executables (positive tests)',
            'Claimed-versus-actual filename/type/destination tests',
          ],
        },
      ],
    },
  },
  {
    id: '05',
    title: 'DNS Shield',
    category: 'Shields',
    content: {
      heading: 'BYEADS — DNS Shield v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Core DNS Features',
          items: [
            'First system-wide protection layer',
            'DoH (DNS-over-HTTPS) supported',
            'DoT (DNS-over-TLS) supported',
            'Requests normalized before rule lookup',
            'Domain rules indexed for fast lookup',
          ],
        },
        {
          title: 'Blocking Categories',
          items: [
            'Advertising domains',
            'Tracking domains',
            'Malware domains',
            'Phishing domains',
            'Scam domains',
            'Telemetry domains',
            'User blocklists and allowlists',
          ],
        },
        {
          title: 'Rule Integrity',
          items: [
            'Rules contain provenance, confidence, expiration, version metadata',
            'Rule updates are atomic',
            'Rule bundles are signed',
            'Bad bundles are rejected',
            'Last known-good bundles remain available',
          ],
        },
        {
          title: 'Platform Support',
          items: [
            'Android Private DNS',
            'Apple DNS Settings',
            'Windows 11 DoH',
            'macOS DNS Settings',
            'Self-hosting supported',
          ],
        },
      ],
    },
  },
  {
    id: '06',
    title: 'Web Shield',
    category: 'Shields',
    content: {
      heading: 'BYEADS — Web Shield v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Browser Extension Architecture',
          items: [
            'Chromium is the first browser target',
            'Manifest V3, TypeScript, service worker architecture',
            'declarativeNetRequest is the primary filtering mechanism',
            'Static rules for stable global rules, dynamic for user policy, session for temporary state',
          ],
        },
        {
          title: 'Protection Features',
          items: [
            'Request blocking and redirect rules (declarative)',
            'URL and domain reputation integration',
            'Redirect Intelligence integration',
            'Deception Engine and Download Guard integration',
            'Popup behavior correlation',
          ],
        },
        {
          title: 'Security & Privacy',
          items: [
            'Host permissions minimized',
            'No remote code execution',
            'Content Security Policy enforced',
            'Messages between extension components validated',
            'Page CPU and memory impact measured',
          ],
        },
        {
          title: 'Cross-Browser',
          items: [
            'Firefox uses separate adapter',
            'Safari uses separate adapter',
            'Core policy remains shared across all browsers',
          ],
        },
      ],
    },
  },
  {
    id: '07',
    title: 'Download Guard',
    category: 'Shields',
    content: {
      heading: 'BYEADS — Download Guard v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Analysis Inputs',
          items: [
            'Source page context, original URL, final URL',
            'Filename, MIME type, received/total bytes',
            'Browser danger state where exposed',
            'Redirect chain and popup behavior',
          ],
        },
        {
          title: 'Detection Capabilities',
          items: [
            'Filename normalization and extension comparison',
            'Double extensions flagged',
            'MIME treated as untrusted metadata',
            'Expected document vs. executable is a strong mismatch',
            'Size tolerance is configurable',
          ],
        },
        {
          title: 'Privacy Guarantees',
          items: [
            'Downloaded file contents not uploaded by default',
            'Passwords never collected',
            'Private documents not uploaded',
            'Tests use benign synthetic files',
          ],
        },
      ],
    },
  },
  {
    id: '08',
    title: 'Redirect Intelligence',
    category: 'Shields',
    content: {
      heading: 'BYEADS — Redirect Intelligence v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Chain Analysis',
          items: [
            'Every chain has a source and may contain multiple destinations',
            'Chain length, domain changes, reputation are all contextual',
            'Normal redirects (HTTPS, CDN, regional, auth, language) are allowed',
            'Unrelated destinations increase risk',
          ],
        },
        {
          title: 'Detection Features',
          items: [
            'Click hijacking detection (visible link vs. actual destination)',
            'Redirect loops detected',
            'Analysis state is bounded — never hangs a tab',
            'Redirect-to-download/popup/phishing/malware are high-priority cases',
          ],
        },
      ],
    },
  },
  {
    id: '09',
    title: 'Threat Intelligence',
    category: 'Intelligence',
    content: {
      heading: 'BYEADS — Threat Intelligence Pipeline v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Intelligence Sources',
          items: [
            'Sources require provenance, license review, update metadata',
            'Sources have confidence levels',
            'Domains normalized, duplicates removed, malformed rejected',
            'Categories: ads, trackers, malware, phishing, scams, redirects, telemetry, unwanted software',
          ],
        },
        {
          title: 'Indicator Management',
          items: [
            'Indicators expire; stale indicators removed or downgraded',
            'Conflicting sources preserved with provenance',
            'Verified internal indicators can take precedence',
            'Community reports are not automatic blocks',
          ],
        },
        {
          title: 'Distribution',
          items: [
            'Rule bundles signed with validated schema',
            'Updates are atomic with rollback available',
            'Delta updates reduce bandwidth',
            'Distribution uses TLS with abuse controls and rate limits',
            'Every source treated as evidence, not truth',
          ],
        },
      ],
    },
  },
  {
    id: '10',
    title: 'Risk Decision Engine',
    category: 'Intelligence',
    content: {
      heading: 'BYEADS — Risk Decision Engine v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Decision Model',
          items: [
            'Produces: allow, warn, or block',
            'Evidence grouped by: reputation, behavior, consistency',
            'Strong signals have more influence than weak ones',
            'One weak signal should not produce a malicious verdict',
            'Multiple independent signals can increase confidence',
          ],
        },
        {
          title: 'Contextual Signals',
          items: [
            'Destination mismatch, redirect anomalies, download mismatch',
            'Type mismatch, popup anomalies, browser danger signals',
            'Reputation alone can be sufficient when verified',
            'Size, filename, MIME, redirect count, popup — each insufficient alone',
          ],
        },
        {
          title: 'Quality & Measurement',
          items: [
            'Precision, recall, false-positive rate measured',
            'Benign and threat corpora maintained',
            'Decision engine must be deterministic for same policy and inputs',
            'Risk model versions tracked in diagnostics',
          ],
        },
      ],
    },
  },
  {
    id: '11',
    title: 'Platform Deployment',
    category: 'Infrastructure',
    content: {
      heading: 'BYEADS — Platform Deployment v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Deployment Models',
          items: [
            'Container deployment supported (Docker)',
            'Self-hosting is a supported model',
            'Public infrastructure for DNS resolution',
            'Horizontal scaling supported',
            'Health checks required for public services',
          ],
        },
      ],
    },
  },
  {
    id: '12',
    title: 'Technology Stack',
    category: 'Infrastructure',
    content: {
      heading: 'BYEADS — Technology Stack v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Core Technologies',
          items: [
            'Rust — shared security-sensitive core',
            'TypeScript — web and extension interfaces',
            'React — UI components',
            'Vite — build tooling',
          ],
        },
        {
          title: 'Platform Technologies',
          items: [
            'Manifest V3 — Chromium extension',
            'Kotlin — Android app',
            'Swift — Apple apps (iOS/macOS)',
            'Windows integration — native APIs',
          ],
        },
        {
          title: 'Infrastructure',
          items: [
            'PostgreSQL — optional durable metadata',
            'Redis — optional cache and coordination',
            'Containers — Docker deployment',
            'GitHub Actions — CI/CD',
          ],
        },
        {
          title: 'Build & Test',
          items: [
            'Cargo — Rust package manager',
            'pnpm — JavaScript package manager',
            'Gradle — Android build',
            'Xcode — Apple builds',
            'Playwright — browser testing',
            'XCTest — Apple testing',
          ],
        },
      ],
    },
  },
  {
    id: '13',
    title: 'Repository Structure',
    category: 'Infrastructure',
    content: {
      heading: 'BYEADS — Repository Structure v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Top-Level Directories',
          items: [
            'apps/ — Platform applications (browser extensions, mobile, desktop)',
            'crates/ — Rust crates (shared core modules)',
            'packages/ — TypeScript/JavaScript packages',
            'services/ — Backend services (DNS resolver, intelligence API)',
            'rules/ — Rule definitions and threat feed configuration',
            'tests/ — Integration and end-to-end tests',
            'docs/ — Documentation',
            'scripts/ — Build and release scripts',
          ],
        },
        {
          title: 'CI & Release',
          items: [
            'CI workflows for automated testing and security checks',
            'Release artifacts for each platform',
            'Security files (SECURITY.md, SBOM)',
          ],
        },
      ],
    },
  },
  {
    id: '14',
    title: 'API Specification',
    category: 'Infrastructure',
    content: {
      heading: 'BYEADS — API Specification v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'API Endpoints',
          items: [
            'DNS — public resolver endpoints (DoH/DoT)',
            'Control API — user policy management',
            'Intelligence API — threat feed queries',
            'Decision API — risk evaluation',
            'Download Context API — file analysis metadata',
          ],
        },
        {
          title: 'API Design',
          items: [
            'Authentication required for administrative endpoints',
            'Rate limits enforced',
            'Error responses standardized',
            'API versioning with backward compatibility',
            'Privacy constraints enforced on all endpoints',
          ],
        },
      ],
    },
  },
  {
    id: '15',
    title: 'Data Privacy',
    category: 'Security',
    content: {
      heading: 'BYEADS — Data Privacy v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Privacy Principles',
          items: [
            'Full DNS histories not retained by default',
            'Operational logs minimized',
            'Page contents not uploaded by default',
            'Passwords never collected',
            'Private documents not uploaded',
            'Telemetry minimized and opt-in where practical',
            'Browsing history not transmitted to remote servers',
          ],
        },
      ],
    },
  },
  {
    id: '16',
    title: 'Security Requirements',
    category: 'Security',
    content: {
      heading: 'BYEADS — Security Requirements v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Security Controls',
          items: [
            'Rule bundles signed and validated',
            'Atomic rule updates with rollback',
            'Administrative APIs isolated from public DNS',
            'Rate limiting on all public endpoints',
            'Input validation on all parsers',
            'Fuzzing on protocol boundaries',
            'Dependency scanning and SBOMs',
            'Responsible disclosure process',
          ],
        },
      ],
    },
  },
  {
    id: '17',
    title: 'Testing & Quality',
    category: 'Development',
    content: {
      heading: 'BYEADS — Testing & Quality v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Test Strategy',
          items: [
            'Unit tests per subsystem',
            'Integration tests cover cross-module flows',
            'End-to-end tests cover user journeys',
            'Threat regression tests cover security bugs',
            'Benign and threat corpora maintained',
            'Precision, recall, and false-positive rates measured',
            'Browser tests for positive and negative cases',
            'Performance profiling with budgets',
          ],
        },
      ],
    },
  },
  {
    id: '18',
    title: 'Performance',
    category: 'Development',
    content: {
      heading: 'BYEADS — Performance v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Performance Requirements',
          items: [
            'DNS lookup must be low latency',
            'Local rule lookup should be fast',
            'Remote intelligence not required for every query',
            'Extension startup should be lightweight',
            'Page CPU and memory impact measured',
            'Mobile battery impact treated as a performance requirement',
            'Decision latency measured',
            'Ruleset limits respected',
          ],
        },
      ],
    },
  },
  {
    id: '19',
    title: 'UX & Warnings',
    category: 'Development',
    content: {
      heading: 'BYEADS — UX & Warning System v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'User Interface Components',
          items: [
            'Protection status display',
            'Warning system with evidence explanations',
            'Deception warnings for fake download detection',
            'Download warnings with safe actions',
            'User-facing language avoids false certainty',
            'Security status understandable on small screens',
            'Accessibility is part of release quality',
            'Dashboard for protection overview',
            'Internationalization support',
          ],
        },
      ],
    },
  },
  {
    id: '20',
    title: 'Open Source Governance',
    category: 'Community',
    content: {
      heading: 'BYEADS — Open Source Governance v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Governance Principles',
          items: [
            'Software remains free and open-source defensive tooling',
            'Reproducible builds required',
            'Security documentation required for releases',
            'Third-party rule sources require license review',
            'SBOMs improve release transparency',
            'Responsible disclosure process available',
            'Community contributions welcome',
          ],
        },
      ],
    },
  },
  {
    id: '21',
    title: 'Execution Roadmap',
    category: 'Community',
    content: {
      heading: 'BYEADS — Execution Roadmap v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Phase 1 — Specification & Core',
          items: [
            'Finalize all specification documents',
            'Build shared core modules in Rust',
            'Implement DNS resolver (DoH/DoT)',
            'Create threat intelligence pipeline',
          ],
        },
        {
          title: 'Phase 2 — Browser & Engines',
          items: [
            'Chromium extension (MV3)',
            'Deception Engine',
            'Download Guard',
          ],
        },
        {
          title: 'Phase 3 — Mobile & Cross-Platform',
          items: [
            'Android app (Kotlin)',
            'Windows desktop integration',
            'Apple apps (Swift)',
            'Firefox and Safari extensions',
          ],
        },
        {
          title: 'Phase 4 — Infrastructure & Release',
          items: [
            'Self-hosting documentation and tooling',
            'Public infrastructure deployment',
            'Stable v1.0 release',
          ],
        },
      ],
    },
  },
  {
    id: '22',
    title: 'Security Research Basis',
    category: 'Security',
    content: {
      heading: 'BYEADS — Security Research Basis v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Research Principles',
          items: [
            'Threat research defines testable requirements',
            'Research does not prove every future threat can be detected',
            'Research findings become tests only when safely reproducible',
            'Product documentation is the source of truth for implementation',
          ],
        },
      ],
    },
  },
  {
    id: '23',
    title: 'Installation Guide',
    category: 'Getting Started',
    content: {
      heading: 'BYEADS — Installation Guide v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Prerequisites',
          items: [
            'Rust toolchain (latest stable)',
            'Node.js 20+ with pnpm',
            'Docker (optional, for self-hosting)',
          ],
        },
        {
          title: 'Quick Start',
          items: [
            'Clone the repository: git clone https://github.com/LoopHora/BYEADS',
            'Install dependencies: pnpm install',
            'Build the core: cargo build --release',
            'Build the extension: pnpm build',
            'Load the extension in Chrome from dist/ folder',
          ],
        },
        {
          title: 'DNS Configuration',
          items: [
            'Configure Android Private DNS with BYEADS resolver',
            'Configure Apple DNS Settings profile',
            'Configure Windows 11 DoH settings',
            'Or deploy your own resolver via Docker',
          ],
        },
      ],
    },
  },
  {
    id: '24',
    title: 'Self-Hosting',
    category: 'Getting Started',
    content: {
      heading: 'BYEADS — Self-Hosting v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Self-Hosting Features',
          items: [
            'Full DNS resolver with your own rule sources',
            'Container deployment (Docker Compose)',
            'PostgreSQL for durable intelligence metadata',
            'Redis for cache and coordination',
            'Isolated services with health checks',
            'Compatible with public feed ingestion',
            'Configuration fully documented',
          ],
        },
      ],
    },
  },
  {
    id: '25',
    title: 'Open Source Release',
    category: 'Community',
    content: {
      heading: 'BYEADS — Open Source Release v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Release Requirements',
          items: [
            'Reproducible builds',
            'Signed release artifacts',
            'Security documentation included',
            'SBOM (Software Bill of Materials)',
            'Dependency scanning completed',
            'All regression tests passing',
            'Performance benchmarks documented',
          ],
        },
      ],
    },
  },
  {
    id: '26',
    title: 'Roadmap Milestones',
    category: 'Community',
    content: {
      heading: 'BYEADS — Roadmap Milestones v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Milestones',
          items: [
            'M1: Core specification complete',
            'M2: DNS resolver operational',
            'M3: Chromium extension functional',
            'M4: Deception Engine + Download Guard operational',
            'M5: Android app beta',
            'M6: Self-hosting documentation complete',
            'M7: Public infrastructure deployed',
            'M8: Stable v1.0 release',
          ],
        },
      ],
    },
  },
  {
    id: '27',
    title: 'Password Utility',
    category: 'Development',
    content: {
      heading: 'BYEADS — Password Utility v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Password Utility Features',
          items: [
            'Generates strong, cryptographically random passwords',
            'Supports configurable length and character sets',
            'Client-side only — no data leaves the device',
            'Utility feature, not core security module',
          ],
        },
      ],
    },
  },
  {
    id: '28',
    title: 'Implementation Checklist',
    category: 'Development',
    content: {
      heading: 'BYEADS — Final Implementation Checklist v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Pre-Release Checklist',
          items: [
            'All specification documents reviewed',
            'Security regression tests passing',
            'Privacy tests passing',
            'Performance benchmarks within budget',
            'Browser extension permissions minimized',
            'Rule signing verified',
            'Rollback mechanism tested',
            'Documentation complete',
            'SBOM generated',
            'Responsible disclosure process documented',
          ],
        },
      ],
    },
  },
  {
    id: '29',
    title: 'Research Sources',
    category: 'Security',
    content: {
      heading: 'BYEADS — Research Sources v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Research Domains',
          items: [
            'Malvertising behavior patterns',
            'Phishing infrastructure analysis',
            'Deceptive download techniques',
            'Redirect chain abuse',
            'Mobile-specific attack vectors',
            'DNS abuse patterns',
            'Browser extension security models',
          ],
        },
      ],
    },
  },
  {
    id: '30',
    title: 'README',
    category: 'Overview',
    content: {
      heading: 'BYEADS — README v1.0',
      status: 'Finalized planning baseline',
      sections: [
        {
          title: 'Project Overview',
          items: [
            'BYEADS is a free, open-source LoopHora protection product',
            'Multi-platform: browser extensions, mobile apps, desktop, DNS',
            'Six protection shields working in concert',
            'Privacy-first, explainable security decisions',
          ],
        },
        {
          title: 'Key Components',
          items: [
            'DNS Shield — system-wide domain filtering',
            'Web Shield — browser-level protection',
            'Deception Engine — fake download detection',
            'Download Guard — file context analysis',
            'Redirect Intelligence — navigation chain analysis',
            'Risk Decision Engine — evidence-based verdicts',
          ],
        },
        {
          title: 'Getting Started',
          items: [
            'See Installation Guide (Doc 23)',
            'See Self-Hosting Guide (Doc 24)',
            'See Architecture Overview (Doc 02)',
            'See Technology Stack (Doc 12)',
          ],
        },
      ],
    },
  },
  {
    id: '31',
    alias: 'windows',
    title: 'Windows Desktop Architecture',
    category: 'Platform Architectures',
    content: {
      heading: 'BYEADS — Windows: How It Works & User Workflow',
      status: 'Finalized Architecture Specification',
      sections: [
        {
          title: 'How BYEADS Works on Windows 10 & 11',
          items: [
            'Windows PC architecture combines dual-layer defense: Chromium MV3 / Firefox MV2 browser extensions and system-level DNS-over-HTTPS (DoH)',
            'Browser extension applies in-page element defusal, synthetic click trapping, video/audio ad fast-forwarding, and heuristic deception scoring',
            'DNS filtering routes system-wide domain lookups through BYEADS Anycast DNS Shield (dns.byeads.net), dropping malware, ad, and tracker domains before network transmission',
            'BYEADS Dashboard / PWA continuously checks resolver reachability and establishes a secure window.postMessage bridge with active browser extensions',
            'Independent status reporting: Browser extension connectivity and DNS filtering are verified and reported independently',
          ],
        },
        {
          title: 'Windows User Workflow',
          items: [
            '1. Install Browser Extension: User installs the Chromium MV3 (Chrome, Edge, Brave) or Firefox MV2 package from the Install Center',
            '2. Configure Encrypted DNS: User runs the automated PowerShell setup script (setup-windows-doh.ps1) or configures manual DoH under Windows 11 Network Settings',
            '3. Open BYEADS Dashboard: Dashboard auto-detects Windows 10/11 desktop OS and performs real-time RFC 8484 DNS reachability probes',
            '4. Browse with God-Level Defense: Web Shield neutralizes deceptive buttons, TeraBox modals, and popunders while DNS blocks ad domains system-wide',
            '5. Verify Protection & Allowlisting: User inspects live blocking telemetry in the dashboard or extension popup, with domain-level allowlist override',
          ],
        },
        {
          title: 'Capabilities & Expectations on Windows',
          items: [
            'Browser-level filtering: Guaranteed auto-skipping and unmuting on YouTube and Spotify, TeraBox overlay removal, and social media ad defusal',
            'Domain blocking: System-wide across all native Windows applications, background updaters, and games using system DNS',
            'Popunder defusal: document_start window proxying intercepts synthetic anchor clicks and transparent zero-opacity overlay traps',
            'Privacy & Zero Telemetry: 100% local heuristic analysis without remote browsing history transmission or telemetry logging',
          ],
        },
        {
          title: 'Automatic Device Detection & Live Monitoring',
          items: [
            'Dashboard auto-identifies Windows desktop clients via user-agent detection',
            'Browser extension communicates with localhost/byeads.net dashboards via secure bidirectional postMessage handshake',
            'Extension streams live blocked-in-tab metrics, active rule counts (77+ rules), and active defense flags directly to the dashboard',
            'DNS probe validates resolver reachability with millisecond latency measurement without false positive assumptions',
          ],
        },
      ],
    },
  },
  {
    id: '32',
    alias: 'smartphone',
    title: 'Smartphone (Android & iOS) Architecture',
    category: 'Platform Architectures',
    content: {
      heading: 'BYEADS — Smartphone (Android & iOS): How It Works & User Workflow',
      status: 'Finalized Architecture Specification',
      sections: [
        {
          title: 'How BYEADS Works on Android',
          items: [
            'Three distinct approaches: Android Private DNS (DoT), mobile browser extensions, and the BYEADS Progressive Web App (PWA)',
            'Android Private DNS (Android 9+): Enter dns.byeads.net under Network & Internet → Private DNS for system-wide ad and tracker blocking on port 853',
            'Mobile Browser Extension: Supported on mobile browsers with extension APIs (Kiwi, Lemur, Firefox for Android) for in-page YouTube/Spotify defusal',
            'BYEADS PWA: Add to Home Screen provides app-like dashboard access and connection diagnostics without requiring Google Play Store services',
            'System boundary: PWA is a dashboard interface; it cannot independently inspect other apps or inject extensions into Chrome mobile',
          ],
        },
        {
          title: 'How BYEADS Works on iPhone (iOS)',
          items: [
            'Three distinct approaches: Encrypted DNS Profile (.mobileconfig), Safari content blocker / WebExtension, and BYEADS PWA',
            'Apple Encrypted DNS: Signed byeads-encrypted-dns.mobileconfig profile enables system-wide DoH/DoT across Wi-Fi and Cellular LTE/5G networks',
            'Safari Protection: Safari WebExtension format enforces declarative content blocking rules matching desktop ad-blocking engines',
            'Home Screen PWA: Installed via Safari Share → Add to Home Screen for convenient status verification and live telemetry display',
            'iOS boundary: Safari content blocker rules do not apply to third-party native apps; DNS profile handles network-level domain filtering',
          ],
        },
        {
          title: 'Verification & Scope Boundaries on Mobile',
          items: [
            'DNS verified status confirms the test probe used the expected DNS path; it does not guarantee third-party apps with hardcoded DNS are filtered',
            'Lifecycle realities: Mobile operating systems aggressively suspend background PWA execution to preserve battery life',
            'While PWA is in foreground, live probe and telemetry refresh in real time; while suspended, DNS filtering continues seamlessly at the OS level',
            'YouTube on Mobile: In-stream video ads share CDN domains with media; DNS alone cannot filter them—mobile Firefox/Kiwi with BYEADS extension is recommended',
          ],
        },
        {
          title: 'Automatic Device Detection & Real-Time Dashboard',
          items: [
            'Dashboard auto-identifies Android and iOS mobile devices dynamically',
            'Interactive device selector card explains mobile-specific delivery mechanisms and lifecycle constraints',
            'Live probe provides immediate visual feedback on encrypted resolver latency and connection integrity',
            'Clear separation of states: Connected & Verified vs Configured Unverified vs Needs Setup',
          ],
        },
      ],
    },
  },
  {
    id: '33',
    alias: 'macbook',
    title: 'MacBook (macOS) Architecture',
    category: 'Platform Architectures',
    content: {
      heading: 'BYEADS — MacBook (macOS): Automatic Device Detection & Live Monitoring',
      status: 'Finalized Architecture Specification',
      sections: [
        {
          title: 'How BYEADS Works on MacBook (macOS)',
          items: [
            'macOS multi-layer integration: Safari WebExtension, Chromium & Firefox desktop extensions, and Apple Encrypted DNS configuration',
            'Browser extension provides browser-level filtering, DOM zapper, synthetic redirect interception, and video/audio ad fast-forwarding',
            'Apple Encrypted DNS Profile: Signed byeads-encrypted-dns.mobileconfig installs into macOS System Settings → Privacy & Security → Profiles',
            'BYEADS PWA / Dashboard: Can be added to the macOS Dock via Safari (macOS Sonoma+) or Chrome for native-app convenience',
            'Verified Protection Status: Independently validates browser extension handshake and DNS resolver reachability',
          ],
        },
        {
          title: 'MacBook User Workflow',
          items: [
            '1. Open BYEADS on MacBook in Safari, Chrome, or Firefox',
            '2. Install Browser Extension: Install Safari WebExtension package or Chrome/Firefox archive from Install Center',
            '3. Install DNS Profile: Download byeads-encrypted-dns.mobileconfig and approve in macOS System Settings',
            '4. Add to Dock: Add BYEADS dashboard to Dock for quick access to telemetry and diagnostics',
            '5. Automatic Verification: Dashboard automatically identifies macOS, verifies DNS probe, and establishes live extension bridge',
            '6. Live Monitoring: View real-time blocked counts, active DNR rules, and threat defusal streams',
          ],
        },
        {
          title: 'Safari WebExtension Implementation',
          items: [
            'Fully compatible Safari WebExtension Manifest V3 package located in apps/extension-safari/',
            'Enforces 77+ declarativeNetRequest rules matching Chromium and Firefox distributions',
            'Content scripts defuse YouTube/Spotify ads, TeraBox modals, popunder traps, and social media trackers in Safari tabs',
            'Native packaging script generates byeads-extension-safari.zip ready for Safari extension testing and deployment',
          ],
        },
        {
          title: 'macOS Detection & Monitoring Engine',
          items: [
            'Dashboard auto-detects macOS platform via navigator.userAgent inspection',
            'Secure extension bridge uses window.postMessage with strict origin checks on localhost and byeads.net',
            'Real-time telemetry reports extension version, tab blocked counts, active rules, and individual shield states',
            'Controlled RFC 8484 DNS test query measures resolver response time and validates active filtering',
          ],
        },
      ],
    },
  },
];

/* ===== Category groupings ===== */
const categories = [
  { name: 'Getting Started', ids: ['01', '23', '24', '30'] },
  { name: 'Platform Architectures', ids: ['31', '32', '33'] },
  { name: 'Protection', ids: ['04', '05', '06', '07', '08', '09', '10'] },
  { name: 'Privacy', ids: ['13', '19'] },
  { name: 'Security', ids: ['03', '15', '16', '22', '29'] },
  { name: 'Architecture', ids: ['02', '11', '12', '14', '28'] },
  { name: 'Development & Community', ids: ['17', '18', '20', '21', '25', '26', '27'] },
];

/* ===== Component ===== */
export default function DocsPage() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const activeId = docId || '01';
  const activeDoc = docs.find((d) => d.id === activeId || d.alias === activeId) || docs[0];

  const handleDocClick = (id: string) => {
    navigate(`/docs/${id}`);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return docs.filter(d => d.title.toLowerCase().includes(q) || d.id.includes(q));
  }, [searchQuery]);

  return (
    <div className="container">
      <div className="docs-layout">
        {/* Sidebar */}
        <aside className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 12px', borderBottom: '1px solid var(--border-sub)', marginBottom: '12px' }}>
            <FileText style={{ width: 16, height: 16, color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Documentation Specs</span>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', marginBottom: '14px', padding: '0 4px' }}>
            <Search style={{ width: 14, height: 14, color: 'var(--text-dim)', position: 'absolute', left: '14px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filter specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 28px 6px 30px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-sub)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-dim)',
                  padding: 0
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>

          {filteredDocs ? (
            <div className="docs-sidebar-section">
              <div className="docs-sidebar-title">Search Results ({filteredDocs.length})</div>
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`docs-sidebar-link ${activeId === doc.id ? 'active' : ''}`}
                  onClick={() => handleDocClick(doc.id)}
                >
                  <span>{doc.id}. {doc.title}</span>
                </div>
              ))}
              {filteredDocs.length === 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', padding: '8px 12px' }}>
                  No specifications match your search.
                </div>
              )}
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.name} className="docs-sidebar-section">
                <div className="docs-sidebar-title">{cat.name}</div>
                {cat.ids.map((id) => {
                  const doc = docs.find((d) => d.id === id);
                  if (!doc) return null;
                  return (
                    <div
                      key={id}
                      className={`docs-sidebar-link ${activeId === id ? 'active' : ''}`}
                      onClick={() => handleDocClick(id)}
                    >
                      <span>{doc.id}. {doc.title}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </aside>

        {/* Content */}
        <div className="docs-content">
          <div className="badge badge-protection" style={{ marginBottom: '16px' }}>
            <CheckCircle2 style={{ width: 13, height: 13 }} />
            <span>{activeDoc.content.status}</span>
          </div>

          <h1>{activeDoc.content.heading}</h1>

          {activeDoc.content.sections.map((section, i) => (
            <div key={i}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-3xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border-sub)',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            {(() => {
              const allIds = docs.map(d => d.id);
              const currentIndex = docs.findIndex(d => d.id === activeDoc.id);
              const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
              const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;
              return (
                <>
                  {prevDoc ? (
                    <button className="btn btn-secondary" onClick={() => handleDocClick(prevDoc.id)}>
                      <ChevronLeft style={{ width: 16, height: 16 }} />
                      <span>{prevDoc.title}</span>
                    </button>
                  ) : <div />}
                  {nextDoc ? (
                    <button className="btn btn-secondary" onClick={() => handleDocClick(nextDoc.id)}>
                      <span>{nextDoc.title}</span>
                      <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
