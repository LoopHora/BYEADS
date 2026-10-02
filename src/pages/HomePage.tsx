// ===== HOME PAGE =====
// Styled with Inficy Universal Product Design Standard
// Matching Infini-Convert, infini-diagrams & inficy-gateway

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Shield,
  EyeOff,
  Package,
  Link2,
  Monitor,
  ShieldCheck,
  ArrowRight,
  Download,
  Activity,
  FileText,
  Sliders,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

const protectionModules = [
  {
    title: 'DNS Shield',
    description: 'System-wide encrypted DNS resolution via DoH & DoT',
    icon: Globe,
    color: '#38bdf8',
    items: [
      { label: 'DoH Encrypted Resolver', path: '/docs/05' },
      { label: 'DoT Private DNS Endpoint', path: '/docs/05' },
      { label: 'Indexed Domain Blocklists', path: '/docs/05' },
      { label: 'Cryptographic Rule Signing', path: '/docs/09' },
    ],
  },
  {
    title: 'Web Shield',
    description: 'In-browser declarative request and redirect filtering',
    icon: Shield,
    color: '#10b981',
    items: [
      { label: 'Manifest V3 declarativeNetRequest', path: '/docs/06' },
      { label: 'Ad & Tracker Request Blocker', path: '/docs/06' },
      { label: 'Navigation & Redirect Guard', path: '/docs/08' },
      { label: 'Pop-Up & Overlay Blocker', path: '/docs/06' },
    ],
  },
  {
    title: 'Deception Engine',
    description: 'Detects fake buttons, deceptive ads & destination mismatches',
    icon: EyeOff,
    color: '#f59e0b',
    items: [
      { label: 'Fake Download Button Scanner', path: '/dashboard' },
      { label: 'Destination Mismatch Analysis', path: '/docs/04' },
      { label: 'Double Extension Detection (.pdf.exe)', path: '/docs/04' },
      { label: 'Whitespace Padding Evasion Check', path: '/docs/04' },
    ],
  },
  {
    title: 'Download Guard',
    description: 'Metadata verification and approximate-size tolerance',
    icon: Package,
    color: '#f97316',
    items: [
      { label: 'Size Tolerance Checker (300 vs 95MB)', path: '/dashboard' },
      { label: 'Executable MIME Type Inspector', path: '/docs/07' },
      { label: 'Unsolicited Drive-By Interceptor', path: '/docs/07' },
      { label: 'Raw IP Hosting Flag', path: '/docs/07' },
    ],
  },
  {
    title: 'Redirect Intelligence',
    description: 'Chain inspection, loop detection and affiliate hopping',
    icon: Link2,
    color: '#818cf8',
    items: [
      { label: 'Circular Redirect Loop Blocker', path: '/docs/08' },
      { label: 'Excessive Hop Throttling (>4 Hops)', path: '/docs/08' },
      { label: 'Cross-Domain Arbitrage Detector', path: '/docs/08' },
      { label: 'Verified CDN Whitelist', path: '/docs/08' },
    ],
  },
  {
    title: 'Cross-Platform Setups',
    description: 'Verified installation guides for every operating system',
    icon: Monitor,
    color: '#a855f7',
    items: [
      { label: 'Chromium MV3 Extension (Chrome/Edge/Brave)', path: '/install' },
      { label: 'Firefox WebExtension (about:debugging)', path: '/install' },
      { label: 'Windows 11/10 Native DoH PowerShell', path: '/install' },
      { label: 'Apple macOS & iOS .mobileconfig Profile', path: '/install' },
      { label: 'Android Private DNS Guide', path: '/install' },
      { label: 'Self-Hosted Docker CoreDNS Stack', path: '/install' },
    ],
  },
];

export const HomePage: React.FC = () => {
  return (
    <PageWrapper
      title="Bye Ads. Hello Security."
      description="Free, open-source layered protection against ads, trackers, scams, and deceptive downloads across devices."
    >
      {/* Central Hero: Simple, focused, product-first */}
      <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 44px', position: 'relative' }}>
        <div className="animate-fade-in">
          <span className="badge badge-protection" style={{ marginBottom: '14px' }}>
            <ShieldCheck style={{ width: 14, height: 14 }} />
            Open Source (MPL-2.0) · Layered Web Safety
          </span>
        </div>

        <h1 className="animate-fade-in" style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--text-main)',
          marginBottom: '12px',
        }}>
          Bye Ads. Hello <span className="gradient-text">Security.</span>
        </h1>

        <p className="animate-fade-in" style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
          color: 'var(--text-sub)',
          fontWeight: 400,
          marginBottom: '24px',
        }}>
          One unified system across devices. DNS Shield, Web Shield, Deception Engine,
          and Download Guard working together wherever each platform allows.
        </p>

        {/* Live Protection Status Bar */}
        <div className="card-panel" style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Probe Verified (RFC 8484)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>5,240 Core Rules</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Validated Local Bundle</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--badge-green-text)' }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Privacy First</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Zero User Browsing Logs</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/install" className="btn btn-primary btn-lg">
            <Download style={{ width: 18, height: 18 }} />
            <span>Install &amp; Setup</span>
          </Link>

          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            <Activity style={{ width: 18, height: 18 }} />
            <span>Protection Dashboard</span>
          </Link>

          <Link to="/docs" className="btn btn-ghost btn-lg">
            <FileText style={{ width: 18, height: 18 }} />
            <span>Architecture Specs</span>
          </Link>
        </div>
      </div>

      {/* Task-First Protection Modules Explorer */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Explore Protection Modules &amp; Subsystems
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            Each module is independently testable and documented across our 30 architecture specifications
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
              <div key={mod.title} className="card-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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
                  }}>
                    <Icon style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>{mod.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{mod.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '12px' }}>
                  {mod.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
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
                      <ArrowRight style={{ width: 13, height: 13, opacity: 0.6 }} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Architecture Banner (Standard LoopHora format) */}
      <div style={{
        maxWidth: '740px',
        margin: '40px auto 0',
        textAlign: 'center',
      }}>
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck style={{ width: 18, height: 18, color: 'var(--badge-green-text)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
              100% Client-Side Privacy &amp; Open Source
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
            BYEADS never collects browsing histories, passwords, or personal credentials.
            Licensed under Mozilla Public License 2.0. Built by LoopHora.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
