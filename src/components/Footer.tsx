// ===== FOOTER =====
// LoopHora Footer Component & Theme Selector

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
                BYEADS by LoopHora
              </span>
            </div>
            <p className="footer-brand-desc">
              Free and open-source web protection tools designed to give users more control over unwanted
              requests, deceptive links, and suspicious downloads.
            </p>
          </div>

          <div className="footer-nav-cols">
            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-col-links">
                <Link to="/" className="footer-col-link">Home</Link>
                <Link to="/dashboard" className="footer-col-link">Dashboard</Link>
                <Link to="/install" className="footer-col-link">Install</Link>
                <Link to="/#shields" className="footer-col-link">Protection Modules</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Documentation</div>
              <div className="footer-col-links">
                <Link to="/docs/23" className="footer-col-link">Getting Started</Link>
                <Link to="/docs/02" className="footer-col-link">System Architecture</Link>
                <Link to="/docs/13" className="footer-col-link">Privacy</Link>
                <Link to="/docs/03" className="footer-col-link">Security Requirements</Link>
                <Link to="/docs" className="footer-col-link">All Specifications</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Community</div>
              <div className="footer-col-links">
                <a
                  href="https://github.com/LoopHora/BYEADS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-col-link"
                >
                  GitHub
                </a>
                <Link to="/docs/20" className="footer-col-link">Contributing</Link>
                <Link to="/docs/25" className="footer-col-link">License</Link>
                <Link to="/docs/16" className="footer-col-link">Security Disclosures</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <span>© 2026 BYEADS by LoopHora. MPL-2.0 licensing and public source availability are subject to the project's release status.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="badge badge-protection" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck style={{ width: 14, height: 14 }} />
              <span>Local Heuristics · Encrypted DNS · Transparent Protection</span>
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
