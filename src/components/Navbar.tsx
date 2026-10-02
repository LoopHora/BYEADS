// ===== HEADER =====
// Styled with Inficy Universal Product Design Standard & Theme Toggle
// Matching Infini-Convert, infini-diagrams & inficy-gateway

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Laptop, ShieldCheck, Menu, X } from 'lucide-react';
import { useTheme } from '../utils/theme';

export default function Navbar() {
  const { theme, cycleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/', label: 'Home', active: location.pathname === '/' },
    { to: '/dashboard', label: 'Dashboard', active: location.pathname === '/dashboard' },
    { to: '/install', label: 'Install', active: location.pathname === '/install' },
    { to: '/docs', label: 'Docs', active: location.pathname.startsWith('/docs') },
  ];

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="app-header">
        <div className="container header-inner">
          {/* Left: Brand Identity */}
          <Link to="/" className="brand-link">
            <img
              src="/logo.png"
              alt="BYEADS Logo"
              className="brand-logo-img"
            />
            <div>
              <span className="brand-kicker">
                LoopHora
              </span>
              <span className="brand-title">
                BYEADS
              </span>
            </div>
          </Link>

          {/* Center: Protection Status Pill Badge */}
          <div className="badge badge-protection header-center-badge">
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--badge-green-text)',
                display: 'inline-block',
                boxShadow: '0 0 6px var(--badge-green-text)',
              }}
            />
            <span>Real-Time Protection Active</span>
          </div>

          {/* Right: Desktop Navigation & Theme Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <nav className="desktop-nav">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`header-nav-link ${item.active ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div
              className="hide-mobile"
              style={{
                width: '1px',
                height: '18px',
                backgroundColor: 'var(--border-sub)',
                margin: '0 4px',
              }}
            />

            {/* GitHub Link */}
            <a
              href="https://github.com/AzeemS24/BYEADS"
              target="_blank"
              rel="noopener noreferrer"
              className="header-nav-link hide-mobile"
              title="View on GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              className="btn-icon"
              title={`Theme: ${theme.toUpperCase()} (Click to cycle Light / Dark / System)`}
              aria-label="Toggle theme"
            >
              <ThemeIcon style={{ width: '15px', height: '15px' }} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="brand-link" onClick={() => setMobileOpen(false)}>
            <img src="/logo.png" alt="BYEADS" className="brand-logo-img" />
            <span className="brand-title">BYEADS</span>
          </Link>
          <button
            className="btn-icon"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`mobile-nav-link ${item.active ? 'active' : ''}`}
                onClick={() => {
                  handleNavClick();
                  setMobileOpen(false);
                }}
              >
                {item.label}
              </Link>
          ))}
          <a
            href="https://github.com/AzeemS24/BYEADS"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            GitHub Repository
          </a>
        </div>

        <div className="mobile-nav-footer">
          <div className="badge badge-protection" style={{ width: '100%', justifyContent: 'center' }}>
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>Local Engine · Zero Telemetry</span>
          </div>
          <button
            onClick={cycleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              background: 'none',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-sub)',
              cursor: 'pointer',
            }}
          >
            <ThemeIcon style={{ width: 16, height: 16 }} />
            <span style={{ textTransform: 'capitalize' }}>{theme} Mode</span>
          </button>
        </div>
      </div>
    </>
  );
}
