// ===== HOME PAGE =====
// LoopHora Home Page Component

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Shield,
  EyeOff,
  Package,
  Link2,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Download,
  Activity,
  FileText,
  CheckCircle2,
  Info,
  Layers,
  AlertCircle
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

interface ModuleItem {
  label: string;
  path: string;
  status?: 'Implemented' | 'Tested' | 'Planned' | 'Configuration';
}

interface ProtectionModule {
  title: string;
  description: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  color: string;
  statusBadge: string;
  statusType: 'verified' | 'detected' | 'info';
  items: ModuleItem[];
}

const protectionModules: ProtectionModule[] = [
  {
    title: 'DNS Shield',
    description: 'Helps block requests to known unwanted or harmful domains through an encrypted DNS provider.',
    icon: Globe,
    color: '#38bdf8',
    statusBadge: 'Configured Provider',
    statusType: 'verified',
    items: [
      { label: 'DNS-over-HTTPS (DoH RFC 8484)', path: '/docs/05', status: 'Implemented' },
      { label: 'DNS-over-TLS (DoT Private DNS)', path: '/docs/05', status: 'Configuration' },
      { label: 'Cloudflare Security 1.1.1.2 Resolver', path: '/install', status: 'Implemented' },
      { label: 'Domain-Level Threat Filtering', path: '/docs/05', status: 'Tested' },
    ],
  },
  {
    title: 'Web Shield',
    description: 'Uses browser extension rules to filter selected web requests and navigation activity.',
    icon: Shield,
    color: '#10b981',
    statusBadge: 'Extension Active',
    statusType: 'detected',
    items: [
      { label: 'Manifest V3 declarativeNetRequest', path: '/docs/06', status: 'Implemented' },
      { label: '14 Built-In Filter Rules', path: '/docs/06', status: 'Tested' },
      { label: 'Tracker & Telemetry Request Blocker', path: '/docs/06', status: 'Implemented' },
      { label: 'Pop-Up & Overlay Request Guard', path: '/docs/08', status: 'Implemented' },
    ],
  },
  {
    title: 'Deception Engine',
    description: 'Uses page and destination signals to identify potentially misleading buttons and links.',
    icon: EyeOff,
    color: '#f59e0b',
    statusBadge: 'Tested Engine',
    statusType: 'verified',
    items: [
      { label: 'Fake Download Button Scanner', path: '/dashboard', status: 'Tested' },
      { label: 'Destination Mismatch Analysis', path: '/docs/04', status: 'Tested' },
      { label: 'Double Extension Detection (.pdf.exe)', path: '/docs/04', status: 'Tested' },
      { label: 'Whitespace Padding Evasion Check', path: '/docs/04', status: 'Tested' },
    ],
  },
  {
    title: 'Download Guard',
    description: 'Checks available download metadata and selected filename patterns for warning signs.',
    icon: Package,
    color: '#f97316',
    statusBadge: 'Tested Engine',
    statusType: 'verified',
    items: [
      { label: 'Approximate-Size Tolerance Verification', path: '/dashboard', status: 'Tested' },
      { label: 'Dangerous Executable Extension Check', path: '/docs/07', status: 'Tested' },
      { label: 'Unsolicited Download Interceptor', path: '/docs/07', status: 'Implemented' },
      { label: 'Raw IP Hosting Flag', path: '/docs/07', status: 'Implemented' },
    ],
  },
  {
    title: 'Redirect Intelligence',
    description: 'Evaluates supported redirect signals to identify suspicious navigation patterns.',
    icon: Link2,
    color: '#818cf8',
    statusBadge: 'Tested Engine',
    statusType: 'verified',
    items: [
      { label: 'Circular Redirect Loop Blocker', path: '/docs/08', status: 'Tested' },
      { label: 'Excessive Hop Throttling (>4 Hops)', path: '/docs/08', status: 'Tested' },
      { label: 'Cross-Domain Navigation Anomaly Detector', path: '/docs/08', status: 'Tested' },
      { label: 'Legitimate CDN Whitelist', path: '/docs/08', status: 'Tested' },
    ],
  },
  {
    title: 'Risk Engine',
    description: 'Combines supported detection signals to help determine whether an action should be allowed, warned about, or blocked.',
    icon: Cpu,
    color: '#a855f7',
    statusBadge: 'Tested Engine',
    statusType: 'verified',
    items: [
      { label: 'Multi-Signal Heuristic Aggregator', path: '/docs/03', status: 'Tested' },
      { label: 'Evidence-Based Action Thresholds', path: '/docs/03', status: 'Tested' },
      { label: 'Explainable Warning Codes', path: '/docs/03', status: 'Tested' },
      { label: 'Zero-Telemetry Local Verdicts', path: '/docs/13', status: 'Implemented' },
    ],
  },
];

export const HomePage: React.FC = () => {
  return (
    <PageWrapper
      title="Browse with more control."
      description="BYEADS is a free, open-source web protection project by LoopHora combining encrypted DNS and browser tools."
    >
      {/* Central Hero: Clear, focused, product-first */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px', position: 'relative' }}>
        <div className="animate-fade-in">
          <span className="badge badge-protection" style={{ marginBottom: '14px' }}>
            <ShieldCheck style={{ width: 14, height: 14 }} />
            Free &amp; Open Source · LoopHora
          </span>
        </div>

        <h1 className="animate-fade-in" style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--text-main)',
          marginBottom: '14px',
        }}>
          Browse with more <span className="gradient-text">control.</span>
        </h1>

        <p className="animate-fade-in" style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
          color: 'var(--text-sub)',
          fontWeight: 400,
          marginBottom: '12px',
          lineHeight: 1.6,
        }}>
          BYEADS is a free, open-source web protection project by LoopHora. It combines encrypted DNS
          configuration with browser-based tools to help reduce unwanted ads, tracking requests, deceptive
          links, suspicious redirects, and potentially unsafe downloads.
        </p>

        <p className="animate-fade-in" style={{
          fontSize: '0.9375rem',
          color: 'var(--text-dim)',
          fontWeight: 600,
          marginBottom: '28px',
        }}>
          Understand your protection. Stay in control.
        </p>

        {/* Live Protection Status Bar */}
        <div className="card-panel" style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'center',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--badge-green-text)',
              boxShadow: '0 0 8px var(--badge-green-text)'
            }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>DNS-over-HTTPS</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Encrypted DoH &amp; DoT</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>6 Core Engines</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>37 Passing Test Specifications</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--badge-green-text)' }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Local Heuristics</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>No User Browsing Logs</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/install" className="btn btn-primary btn-lg">
            <Download style={{ width: 18, height: 18 }} />
            <span>Get Started</span>
          </Link>

          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            <Activity style={{ width: 18, height: 18 }} />
            <span>Explore Dashboard</span>
          </Link>

          <Link to="/docs" className="btn btn-ghost btn-lg">
            <FileText style={{ width: 18, height: 18 }} />
            <span>Architecture Specs</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Protection at Different Layers */}
      <div id="shields" style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            Protection at different layers
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', maxWidth: '640px', margin: '0 auto' }}>
            BYEADS separates network-level filtering from browser-level inspection, applying the right tool at each boundary.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          maxWidth: '1120px',
          margin: '0 auto',
        }}>
          {protectionModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.title} className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: mod.color,
                      flexShrink: 0
                    }}>
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>{mod.title}</h3>
                    </div>
                  </div>
                  <span className={mod.statusType === 'verified' ? 'badge badge-protection' : 'badge badge-amber'} style={{ fontSize: '0.6875rem' }}>
                    {mod.statusBadge}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                  {mod.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid var(--border-sub)', paddingTop: '10px' }}>
                  {mod.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--text-sub)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-nav-hover)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-sub)';
                      }}
                    >
                      <span>{item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.status && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                            {item.status}
                          </span>
                        )}
                        <ArrowRight style={{ width: 13, height: 13, opacity: 0.6 }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: One product, different levels of protection */}
      <div style={{ maxWidth: '920px', margin: '0 auto 40px' }}>
        <div className="card-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <Layers style={{ width: 22, height: 22, color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                One product, different levels of protection
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                DNS configuration provides domain-level filtering across all applications on your device.
                Browser extensions add browser-specific inspection and filtering capabilities (such as deceptive button
                detection, double-extension interception, and declarative ad blocking). The features available depend
                on the platform, browser, permissions, and configuration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Privacy and transparency */}
      <div style={{ maxWidth: '920px', margin: '0 auto 40px' }}>
        <div className="card-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <Info style={{ width: 22, height: 22, color: 'var(--badge-green-text)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Privacy and transparency
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '8px' }}>
                BYEADS uses local rules and heuristics for supported checks. It does not collect browsing histories,
                passwords, or personal credentials.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                DNS requests configured through a third-party resolver (such as Cloudflare Security DNS at 1.1.1.2)
                are processed by that provider under its privacy policy. BYEADS does not claim to replace antivirus software
                or provide complete protection against every threat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
