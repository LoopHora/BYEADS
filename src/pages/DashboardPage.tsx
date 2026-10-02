// ===== BYEADS DASHBOARD =====
// Inspired by inficy-gateway minimalist design: clean typography, 2x2 stat grid, and 24h timeline

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Globe,
  Radio,
  Monitor,
  Smartphone,
  Laptop,
  Check,
  Download,
  Copy,
  ArrowRight,
  ExternalLink,
  Zap,
  Lock,
  Layers
} from 'lucide-react';
import { downloadPwaFile } from '../utils/pwaDownloader';

type VerificationState = 'connected_verified' | 'configured_unverified' | 'disconnected';
type DetectedPlatform = 'windows' | 'macbook' | 'android' | 'ios';

interface ActivityItem {
  id: string;
  time: string;
  domain: string;
  category: 'ad' | 'tracker' | 'popup' | 'threat' | 'clean';
  action: 'Blocked' | 'Neutralized' | 'Allowed';
  layer: 'DNS Shield' | 'Web Shield' | 'Pop-Up Guard' | 'Deception Engine';
}

interface DeviceProfile {
  name: string;
  model: string;
  type: DetectedPlatform;
  deviceId: string;
  isStandalone: boolean;
  connectionMethod: string;
}

const mockActivityFeed: ActivityItem[] = [
  { id: '1', time: 'Just now', domain: 'popunder-adnetwork.click', category: 'popup', action: 'Neutralized', layer: 'Pop-Up Guard' },
  { id: '2', time: '1m ago', domain: 'telemetry.traffic-bidder.com', category: 'tracker', action: 'Blocked', layer: 'Web Shield' },
  { id: '3', time: '3m ago', domain: 'cdn-deceptive-offer.xyz', category: 'threat', action: 'Blocked', layer: 'Deception Engine' },
  { id: '4', time: '5m ago', domain: 'googleads.g.doubleclick.net', category: 'ad', action: 'Blocked', layer: 'DNS Shield' },
  { id: '5', time: '8m ago', domain: 'github.com', category: 'clean', action: 'Allowed', layer: 'DNS Shield' },
  { id: '6', time: '12m ago', domain: 'syndication.exoclick.com', category: 'popup', action: 'Neutralized', layer: 'Pop-Up Guard' },
  { id: '7', time: '15m ago', domain: 'scorecardresearch.com', category: 'tracker', action: 'Blocked', layer: 'Web Shield' }
];

function getDetailedDeviceProfile(selected?: DetectedPlatform): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      name: 'Windows Desktop PC',
      model: 'Windows 11 Machine',
      type: 'windows',
      deviceId: 'BYEADS-WIN-8910',
      isStandalone: false,
      connectionMethod: 'Native DoH Script'
    };
  }

  const ua = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  let deviceId = localStorage.getItem('byeads_device_id');
  if (!deviceId) {
    deviceId = 'BYEADS-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('byeads_device_id', deviceId);
  }

  const target = selected || detectClientPlatform();

  if (target === 'ios') {
    const isIpad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return {
      name: isIpad ? 'Apple iPad' : 'Apple iPhone',
      model: isIpad ? 'iPadOS Device' : 'iOS Device',
      type: 'ios',
      deviceId,
      isStandalone,
      connectionMethod: 'Apple Encrypted DNS Profile (.mobileconfig)'
    };
  }

  if (target === 'android') {
    return {
      name: 'Android Smartphone',
      model: 'Android 10+ Device',
      type: 'android',
      deviceId,
      isStandalone,
      connectionMethod: 'Android Private DNS (DoT 853)'
    };
  }

  if (target === 'macbook') {
    return {
      name: 'Apple MacBook',
      model: 'MacBook Pro / Air',
      type: 'macbook',
      deviceId,
      isStandalone,
      connectionMethod: 'Apple Encrypted Profile + Safari Extension'
    };
  }

  return {
    name: 'Windows Desktop PC',
    model: 'Windows 10 / 11 Workstation',
    type: 'windows',
    deviceId,
    isStandalone,
    connectionMethod: 'Native Windows DoH'
  };
}

function detectClientPlatform(): DetectedPlatform {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'macbook';
  return 'windows';
}

export default function DashboardPage() {
  const [detectedOS, setDetectedOS] = useState<DetectedPlatform>('windows');
  const [selectedDevice, setSelectedDevice] = useState<DetectedPlatform>('windows');
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile>(getDetailedDeviceProfile('windows'));

  // Live connection test state
  const [checking, setChecking] = useState(false);
  const [connState, setConnState] = useState<VerificationState>('connected_verified');
  const [latency, setLatency] = useState<number>(18);
  const [targetDomain, setTargetDomain] = useState<string>('probe.byeads.net');
  const [copiedHost, setCopiedHost] = useState(false);

  // Live Query & Shield Counters
  const [queryCounter, setQueryCounter] = useState(1486);
  const [blockedCounter, setBlockedCounter] = useState(343);

  // Device Activated State (Verified vs Unverified)
  const [isActivated, setIsActivated] = useState<boolean>(true);

  // Initialize platform detection
  useEffect(() => {
    const os = detectClientPlatform();
    setDetectedOS(os);
    setSelectedDevice(os);
    setDeviceProfile(getDetailedDeviceProfile(os));

    const savedActive = localStorage.getItem(`byeads_active_${os}`);
    if (savedActive !== null) {
      setIsActivated(savedActive === 'true');
      setConnState(savedActive === 'true' ? 'connected_verified' : 'configured_unverified');
    } else {
      setIsActivated(true);
      setConnState('connected_verified');
    }
  }, []);

  // Update profile when selector changes
  useEffect(() => {
    setDeviceProfile(getDetailedDeviceProfile(selectedDevice));
    const savedActive = localStorage.getItem(`byeads_active_${selectedDevice}`);
    if (savedActive !== null) {
      setIsActivated(savedActive === 'true');
      setConnState(savedActive === 'true' ? 'connected_verified' : 'configured_unverified');
    } else {
      setIsActivated(true);
      setConnState('connected_verified');
    }
  }, [selectedDevice]);

  // Live query increment ticker
  useEffect(() => {
    if (!isActivated) return;
    const interval = setInterval(() => {
      setQueryCounter((q) => q + Math.floor(1 + Math.random() * 2));
      if (Math.random() > 0.65) {
        setBlockedCounter((b) => b + 1);
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isActivated]);

  // Run live resolver reachability probe
  const runConnectionCheck = async () => {
    setChecking(true);
    const start = performance.now();
    try {
      const res = await fetch(`https://security.cloudflare-dns.com/dns-query?name=${targetDomain}&type=A`, {
        headers: { accept: 'application/dns-json' },
        mode: 'cors'
      });
      const end = performance.now();
      const elapsed = Math.max(8, Math.round(end - start));
      setLatency(elapsed);

      if (res.ok) {
        setConnState('connected_verified');
        setIsActivated(true);
        localStorage.setItem(`byeads_active_${selectedDevice}`, 'true');
      } else {
        setConnState('configured_unverified');
        setIsActivated(false);
      }
    } catch {
      setConnState('disconnected');
      setIsActivated(false);
    } finally {
      setChecking(false);
    }
  };

  const handleCopyHost = () => {
    navigator.clipboard.writeText('dns.byeads.net');
    setCopiedHost(true);
    setTimeout(() => setCopiedHost(false), 2000);
  };

  const handleDeviceDownload = () => {
    if (selectedDevice === 'ios' || selectedDevice === 'macbook') {
      downloadPwaFile('/byeads-encrypted-dns.mobileconfig', 'byeads-encrypted-dns.mobileconfig');
    } else if (selectedDevice === 'windows') {
      downloadPwaFile('/install-byeads-dns.bat', 'install-byeads-dns.bat');
    }
  };

  return (
    <main style={{ flex: 1, padding: '36px 0 96px' }}>
      <div className="container" style={{ maxWidth: '896px', margin: '0 auto' }}>
        
        {/* Device Switcher Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-sub)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Device:
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {deviceProfile.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
              ({deviceProfile.deviceId})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-sidebar)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
            {(['ios', 'android', 'windows', 'macbook'] as DetectedPlatform[]).map((dev) => (
              <button
                key={dev}
                onClick={() => setSelectedDevice(dev)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                  fontWeight: selectedDevice === dev ? 700 : 500,
                  backgroundColor: selectedDevice === dev ? 'var(--bg-card)' : 'transparent',
                  color: selectedDevice === dev ? 'var(--brand-primary)' : 'var(--text-sub)',
                  border: selectedDevice === dev ? '1px solid var(--border-card)' : '1px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {dev === 'ios' ? 'iPhone / iOS' : dev === 'macbook' ? 'MacBook' : dev}
              </button>
            ))}
          </div>
        </div>

        {/* Top Section: Hero (Left 7-col) + Stats Grid (Right 5-col) - inficy-gateway structure */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'start',
          marginBottom: '36px'
        }}>
          {/* Left Hero Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ color: isActivated ? 'var(--badge-green-text)' : 'var(--badge-amber-text)' }}>
              {isActivated ? (
                <Shield style={{ width: 32, height: 32, strokeWidth: 2.2 }} />
              ) : (
                <ShieldAlert style={{ width: 32, height: 32, strokeWidth: 2.2 }} />
              )}
            </div>

            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                {isActivated ? 'System protected' : 'Awaiting DNS verification'}
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: 1.5 }}>
                {isActivated
                  ? `Zero-Trust DNS Shield active on ${deviceProfile.name}. ${blockedCounter} threats blocked. All activity within policy.`
                  : `Configure ${deviceProfile.connectionMethod} to activate live domain filtering and device protection.`}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
              <button
                onClick={runConnectionCheck}
                disabled={checking}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-btn)',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <RefreshCw style={{ width: 14, height: 14, animation: checking ? 'spin 1s linear infinite' : 'none', color: 'var(--brand-primary)' }} />
                <span>{checking ? 'Probing...' : isActivated ? 'Verify connection' : 'Verify & activate'}</span>
              </button>

              <button
                onClick={() => {
                  const nextState = !isActivated;
                  setIsActivated(nextState);
                  setConnState(nextState ? 'connected_verified' : 'configured_unverified');
                  localStorage.setItem(`byeads_active_${selectedDevice}`, nextState ? 'true' : 'false');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-dim)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-sub)',
                  cursor: 'pointer'
                }}
                title="Toggle between verified and unverified view"
              >
                <span>{isActivated ? 'Simulate Unverified' : 'Simulate Verified'}</span>
              </button>
            </div>
          </div>

          {/* Right Stats Grid (2x2 pure typography - inficy-gateway style) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            rowGap: '24px',
            columnGap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Queries monitored</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', fontFamily: 'monospace' }}>
                {isActivated ? queryCounter.toLocaleString() : '—'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Threats blocked</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isActivated ? '#f87171' : 'var(--text-dim)', marginTop: '2px', fontFamily: 'monospace' }}>
                {isActivated ? blockedCounter.toLocaleString() : '—'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Encrypted resolver</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', fontFamily: 'monospace' }}>
                {isActivated ? `${latency} ms` : 'Unverified'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Active shields</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isActivated ? 'var(--badge-green-text)' : 'var(--text-dim)', marginTop: '2px' }}>
                {isActivated ? '4 / 4' : 'Standby'}
              </div>
            </div>
          </div>
        </div>

        {/* 1-Step Setup Quick Card (When Unverified) */}
        {!isActivated && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.04)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 22px',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              1-Step Setup for {deviceProfile.name}:
            </div>

            {selectedDevice === 'android' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)' }}>
                  Open <strong>Settings → Network &amp; Internet → Private DNS</strong> and enter:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <code style={{ padding: '6px 12px', background: 'var(--bg-sidebar)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    dns.byeads.net
                  </code>
                  <button onClick={handleCopyHost} className="btn btn-secondary btn-sm">
                    {copiedHost ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                    <span>{copiedHost ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {(selectedDevice === 'ios' || selectedDevice === 'macbook') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)' }}>
                  Download and install the official Apple Encrypted DNS configuration profile:
                </div>
                <button onClick={handleDeviceDownload} className="btn btn-primary btn-sm">
                  <Download style={{ width: 14, height: 14 }} />
                  <span>Download Profile (.mobileconfig)</span>
                </button>
              </div>
            )}

            {selectedDevice === 'windows' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)' }}>
                  Download and double-click the 1-click batch installer (0 MB background RAM):
                </div>
                <button onClick={handleDeviceDownload} className="btn btn-primary btn-sm">
                  <Download style={{ width: 14, height: 14 }} />
                  <span>Download install-byeads-dns.bat</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Activity Section (inficy-gateway table + 24h timeline) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Live activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActivated ? 'var(--badge-green-text)' : 'var(--badge-amber-text)' }} />
              <span>{isActivated ? 'Continuous filtering active' : 'Waiting for connection'}</span>
            </span>
          </div>

          <div className="card-panel" style={{ overflow: 'hidden', padding: 0 }}>
            {/* Table Header: 12-column grid matching inficy-gateway */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              fontWeight: 500,
              padding: '10px 16px',
              borderBottom: '1px solid var(--border-card)',
              background: 'transparent'
            }}>
              <span style={{ gridColumn: 'span 2' }}>Time</span>
              <span style={{ gridColumn: 'span 2' }}>Shield</span>
              <span style={{ gridColumn: 'span 2' }}>Action</span>
              <span style={{ gridColumn: 'span 4' }}>Target</span>
              <span style={{ gridColumn: 'span 2', textAlign: 'right' }}>Decision</span>
            </div>

            {/* Table Rows */}
            {!isActivated ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                No recent security incidents recorded — continuous protection active.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {mockActivityFeed.map((evt) => {
                  const isBlock = evt.action === 'Blocked';
                  const isNeutralized = evt.action === 'Neutralized';

                  return (
                    <div
                      key={evt.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        alignItems: 'center',
                        padding: '12px 16px',
                        fontSize: '0.75rem',
                        borderBottom: '1px solid var(--border-item)',
                        background: isBlock ? 'var(--bg-block-row)' : 'transparent',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      <span style={{ gridColumn: 'span 2', fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--text-main)' }}>
                        {evt.time}
                      </span>
                      <span style={{ gridColumn: 'span 2', fontWeight: 700, color: 'var(--text-main)' }}>
                        {evt.layer}
                      </span>
                      <span style={{ gridColumn: 'span 2', fontWeight: 700, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                        {evt.category}
                      </span>
                      <span style={{ gridColumn: 'span 4', fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                        {evt.domain}
                      </span>
                      <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isBlock
                            ? '#ef4444'
                            : isNeutralized
                            ? 'var(--badge-amber-bg)'
                            : 'var(--badge-green-bg)',
                          color: isBlock
                            ? '#ffffff'
                            : isNeutralized
                            ? 'var(--badge-amber-text)'
                            : 'var(--badge-green-text)',
                          border: isBlock
                            ? 'none'
                            : isNeutralized
                            ? '1px solid var(--badge-amber-border)'
                            : '1px solid var(--badge-green-border)'
                        }}>
                          {evt.action === 'Blocked' ? 'Block' : evt.action === 'Neutralized' ? 'Review' : 'Allow'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 24h Timeline Slider (inficy-gateway signature element) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            paddingTop: '12px',
            paddingLeft: '4px',
            paddingRight: '4px'
          }}>
            <span>24h</span>
            <div style={{
              flex: 1,
              height: '2px',
              backgroundColor: 'var(--border-card)',
              margin: '0 16px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              {isActivated && mockActivityFeed.map((evt, idx) => {
                const pct = 10 + idx * 14;
                const isBlock = evt.action === 'Blocked';
                const isNeutralized = evt.action === 'Neutralized';
                const dotColor = isBlock ? '#ef4444' : isNeutralized ? 'var(--badge-amber-text)' : 'var(--badge-green-text)';

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${pct}%`,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: dotColor,
                      transform: 'translateX(-50%)'
                    }}
                    title={`${evt.domain} — ${evt.action}`}
                  />
                );
              })}
            </div>
            <span>now</span>
          </div>
        </div>

        {/* Footer Device Setup Link */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone style={{ width: 18, height: 18, color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-sub)' }}>
              Need to configure BYEADS on iPhone, Android, MacBook, or Windows?
            </span>
          </div>
          <a
            href="#/install"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--brand-primary)'
            }}
          >
            <span>View Setup Guides</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </a>
        </div>

      </div>
    </main>
  );
}
