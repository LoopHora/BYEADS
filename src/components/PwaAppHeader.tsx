import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Smartphone, Globe, RefreshCw } from 'lucide-react';

export default function PwaAppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStandalone, setIsStandalone] = useState(false);
  const [deviceLabel, setDeviceLabel] = useState('Device');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
      setIsStandalone(standalone);

      const ua = navigator.userAgent;
      if (/iPhone|iPad/i.test(ua)) setDeviceLabel('Apple iOS');
      else if (/Android/i.test(ua)) setDeviceLabel('Android');
      else if (/Macintosh|Mac OS/i.test(ua)) setDeviceLabel('macOS');
      else setDeviceLabel('Windows');
    }
  }, []);

  const isRoot = location.pathname === '/' || location.pathname === '/dashboard';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return 'BYEADS Hub';
    if (location.pathname === '/dashboard') return 'Live Protection';
    if (location.pathname === '/install') return 'Add Device';
    if (location.pathname.startsWith('/docs')) return 'Specifications';
    return 'BYEADS';
  };

  return (
    <div className="pwa-top-appbar">
      <div className="pwa-top-appbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isRoot ? (
            <button
              onClick={handleBack}
              className="pwa-back-btn"
              title="Go back"
              aria-label="Back"
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Back</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="BYEADS" style={{ width: 24, height: 24, borderRadius: '6px' }} />
              <span style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                BYEADS
              </span>
            </div>
          )}
        </div>

        <div className="pwa-appbar-title">
          {getPageTitle()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="pwa-device-chip">
            <span className="pwa-pulse-dot" />
            <span>{deviceLabel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
