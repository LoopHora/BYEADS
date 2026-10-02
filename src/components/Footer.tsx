// ===== FOOTER =====
// Styled with Inficy Universal Product Design Standard & Theme Toggle
// Matching Infini-Convert, infini-diagrams & inficy-gateway

import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Laptop, ShieldCheck } from 'lucide-react';
import { useTheme } from '../utils/theme';

export default function Footer() {
  const { theme, cycleTheme } = useTheme();
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-info">
            <div className="footer-brand-title">
              <img
                src="/logo.png"
                alt="BYEADS Logo"
                style={{
                  width: 28,
                  height: 28,
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                BYEADS
              </span>
            </div>
            <p className="footer-brand-desc">
              Free, open-source protection suite against intrusive ads, trackers, malware,
              phishing, and deceptive downloads across every device.
            </p>
          </div>

          <div className="footer-nav-cols">
            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-col-links">
                <Link to="/#shields" className="footer-col-link">Protection Shields</Link>
                <Link to="/docs/05" className="footer-col-link">DNS Shield</Link>
                <Link to="/docs/06" className="footer-col-link">Web Shield</Link>
                <Link to="/docs/07" className="footer-col-link">Download Guard</Link>
                <Link to="/docs/04" className="footer-col-link">Deception Engine</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Documentation</div>
              <div className="footer-col-links">
                <Link to="/docs" className="footer-col-link">All 30 Specs</Link>
                <Link to="/docs/01" className="footer-col-link">Product Spec</Link>
                <Link to="/docs/02" className="footer-col-link">System Architecture</Link>
                <Link to="/docs/12" className="footer-col-link">Tech Stack</Link>
                <Link to="/docs/23" className="footer-col-link">Installation Guide</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Community & Open Source</div>
              <div className="footer-col-links">
                <a
                  href="https://github.com/AzeemS24/BYEADS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-col-link"
                >
                  GitHub Repository
                </a>
                <Link to="/docs/20" className="footer-col-link">Contributing</Link>
                <Link to="/docs/25" className="footer-col-link">License (MPL-2.0)</Link>
                <Link to="/docs/16" className="footer-col-link">Security Disclosures</Link>
                <Link to="/docs/24" className="footer-col-link">Self-Hosting</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <span>© {new Date().getFullYear()} BYEADS by LoopHora. Free & Open Source under Mozilla Public License 2.0.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="badge badge-protection" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck style={{ width: 14, height: 14 }} />
              <span>Zero Server Telemetry · 100% On-Device Enforcement</span>
            </div>

            <button
              onClick={cycleTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                fontSize: '0.8125rem',
                color: 'var(--text-sub)',
                cursor: 'pointer',
              }}
              title="Cycle color theme"
            >
              <ThemeIcon style={{ width: 14, height: 14 }} />
              <span style={{ textTransform: 'capitalize' }}>{theme} mode</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
