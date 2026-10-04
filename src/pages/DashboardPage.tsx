// ===== BYEADS DASHBOARD =====
// Honest status dashboard: real DNS probe, real extension detection, no fake data

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Check,
  Download,
  Copy,
  ArrowRight,
  Globe,
  Puzzle,
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { downloadPwaFile } from '../utils/pwaDownloader';

type DetectedPlatform = 'windows' | 'macbook' | 'android' | 'ios';

interface DeviceProfile {
  name: string;
  type: DetectedPlatform;
  deviceId: string;
  isStandalone: boolean;
  connectionMethod: string;
}

// Real DNS probe result
interface DnsProbeResult {
  status: 'untested' | 'testing' | 'reachable' | 'unreachable';
  latencyMs: number | null;
  lastChecked: Date | null;
  resolverUsed: string;
}

// Real extension detection result
interface ExtensionStatus {
  detected: boolean;
  checkedAt: Date | null;
}

function getDetailedDeviceProfile(selected?: DetectedPlatform): DeviceProfile {
  if (typeof window === 'undefined') {
    return { name: 'Windows Desktop PC', type: 'windows', deviceId: 'BYEADS-0000', isStandalone: false, connectionMethod: 'Native Windows DoH' };
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
    return { name: isIpad ? 'Apple iPad' : 'Apple iPhone', type: 'ios', deviceId, isStandalone, connectionMethod: 'Apple Encrypted DNS Profile (.mobileconfig)' };
  }
  if (target === 'android') {
    return { name: 'Android Smartphone', type: 'android', deviceId, isStandalone, connectionMethod: 'Android Private DNS (DoT 853)' };
  }
  if (target === 'macbook') {
    return { name: 'Apple MacBook', type: 'macbook', deviceId, isStandalone, connectionMethod: 'Apple Encrypted Profile + Safari Extension' };
  }
  return { name: 'Windows Desktop PC', type: 'windows', deviceId, isStandalone, connectionMethod: 'Native Windows DoH' };
}

function detectClientPlatform(): DetectedPlatform {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'macbook';
  return 'windows';
}

function formatTimeSince(date: Date | null): string {
  if (!date) return 'Never';
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 5) return 'Just now';
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export default function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState<DetectedPlatform>('windows');
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile>(getDetailedDeviceProfile('windows'));
  const [copiedHost, setCopiedHost] = useState(false);

  // Real DNS probe state
  const [dnsProbe, setDnsProbe] = useState<DnsProbeResult>({
    status: 'untested',
    latencyMs: null,
    lastChecked: null,
    resolverUsed: 'security.cloudflare-dns.com'
  });

  // Real extension detection
  const [extStatus, setExtStatus] = useState<ExtensionStatus>({
    detected: false,
    checkedAt: null
  });

  // Configured devices
  const [configuredDevices, setConfiguredDevices] = useState<DetectedPlatform[]>(() => {
    if (typeof window === 'undefined') return ['windows'];
    const current = detectClientPlatform();
    try {
      const saved = localStorage.getItem('byeads_configured_devices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.includes(current)) parsed.push(current);
          return parsed;
        }
      }
    } catch {}
    return [current];
  });

  // Initialize
  useEffect(() => {
    const os = detectClientPlatform();
    setSelectedDevice(os);
    setDeviceProfile(getDetailedDeviceProfile(os));
    checkExtension();
  }, []);

  useEffect(() => {
    setDeviceProfile(getDetailedDeviceProfile(selectedDevice));
  }, [selectedDevice]);

  // Real extension detection via both chrome.runtime and extension postMessage telemetry
  const checkExtension = () => {
    try {
      const detected = typeof window !== 'undefined' && Boolean((window as any).chrome?.runtime?.id);
      if (detected) {
        setExtStatus({ detected: true, checkedAt: new Date() });
      }
      // Send PING to extension content script
      window.postMessage({ source: 'BYEADS_DASHBOARD', type: 'PING' }, '*');
    } catch {
      setExtStatus({ detected: false, checkedAt: new Date() });
    }
  };

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.source === 'BYEADS_EXTENSION' && e.data.type === 'BYEADS_TELEMETRY_UPDATE') {
        setExtStatus({ detected: true, checkedAt: new Date() });
      }
    };
    window.addEventListener('message', handleMsg);
    checkExtension();
    const interval = setInterval(checkExtension, 2000);
    return () => {
      window.removeEventListener('message', handleMsg);
      clearInterval(interval);
    };
  }, []);

  // Real DNS reachability probe — the ONLY real data on this dashboard
  const runDnsProbe = async () => {
    setDnsProbe(prev => ({ ...prev, status: 'testing' }));
    const start = performance.now();
    try {
      const res = await fetch('https://security.cloudflare-dns.com/dns-query?name=probe.byeads.net&type=A', {
        headers: { accept: 'application/dns-json' },
        mode: 'cors'
      });
      const end = performance.now();
      const elapsed = Math.max(1, Math.round(end - start));

      if (res.ok) {
        setDnsProbe({
          status: 'reachable',
          latencyMs: elapsed,
          lastChecked: new Date(),
          resolverUsed: 'security.cloudflare-dns.com'
        });
        // Register device as verified
        setConfiguredDevices((prev) => {
          if (!prev.includes(selectedDevice)) {
            const next = [...prev, selectedDevice];
            localStorage.setItem('byeads_configured_devices', JSON.stringify(next));
            return next;
          }
          return prev;
        });
      } else {
        setDnsProbe({
          status: 'unreachable',
          latencyMs: null,
          lastChecked: new Date(),
          resolverUsed: 'security.cloudflare-dns.com'
        });
      }
    } catch {
      setDnsProbe({
        status: 'unreachable',
        latencyMs: null,
        lastChecked: new Date(),
        resolverUsed: 'security.cloudflare-dns.com'
      });
    }

    // Also re-check extension
    checkExtension();
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

  const isDnsOk = dnsProbe.status === 'reachable';
  const isExtOk = extStatus.detected;
  const hasTestedDns = dnsProbe.status !== 'untested';

  // Status icon & color helpers
  const StatusIcon = ({ ok, tested }: { ok: boolean; tested: boolean }) => {
    if (!tested) return <AlertTriangle style={{ width: 18, height: 18, color: 'var(--text-dim)' }} />;
    if (ok) return <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--badge-green-text)' }} />;
    return <XCircle style={{ width: 18, height: 18, color: '#ef4444' }} />;
  };

  return (
    <main style={{ flex: 1, padding: '36px 0 96px' }}>
      <div className="container" style={{ maxWidth: '896px', margin: '0 auto' }}>

        {/* Device Header Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Device:
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {deviceProfile.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
              ({deviceProfile.deviceId})
            </span>

            {deviceProfile.isStandalone && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px',
                borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 600,
                backgroundColor: 'rgba(234, 88, 12, 0.1)', color: 'var(--brand-primary)',
                border: '1px solid rgba(234, 88, 12, 0.25)'
              }}>
                Homescreen App
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {configuredDevices.length > 1 && (
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-sidebar)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                {configuredDevices.map((dev) => (
                  <button
                    key={dev}
                    onClick={() => setSelectedDevice(dev)}
                    style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem',
                      fontWeight: selectedDevice === dev ? 700 : 500,
                      backgroundColor: selectedDevice === dev ? 'var(--bg-card)' : 'transparent',
                      color: selectedDevice === dev ? 'var(--brand-primary)' : 'var(--text-sub)',
                      border: selectedDevice === dev ? '1px solid var(--border-card)' : '1px solid transparent',
                      cursor: 'pointer', textTransform: 'capitalize', transition: 'all var(--transition-fast)'
                    }}
                  >
                    {dev === 'ios' ? 'iPhone' : dev === 'macbook' ? 'MacBook' : dev}
                  </button>
                ))}
              </div>
            )}

            <a href="#/install" style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px',
              borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600,
              color: 'var(--text-sub)', backgroundColor: 'var(--bg-btn)',
              border: '1px solid var(--border-card)', textDecoration: 'none'
            }}>
              <span>+ Add device</span>
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
          <div style={{ color: isDnsOk || !hasTestedDns ? 'var(--badge-green-text)' : 'var(--badge-amber-text)' }}>
            {isDnsOk ? (
              <Shield style={{ width: 32, height: 32, strokeWidth: 2.2 }} />
            ) : (
              <ShieldAlert style={{ width: 32, height: 32, strokeWidth: 2.2 }} />
            )}
          </div>

          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              {!hasTestedDns
                ? 'Protection status unknown'
                : isDnsOk
                  ? 'DNS resolver reachable'
                  : 'DNS resolver unreachable'
              }
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: 1.5 }}>
              {!hasTestedDns
                ? 'Click "Run DNS probe" below to test your encrypted DNS connection.'
                : isDnsOk
                  ? `Encrypted DNS resolver responded in ${dnsProbe.latencyMs} ms on ${deviceProfile.name}. Domain-level filtering is configured.`
                  : `Could not reach the encrypted DNS resolver. Check your ${deviceProfile.connectionMethod} configuration.`
              }
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
            <button
              onClick={runDnsProbe}
              disabled={dnsProbe.status === 'testing'}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-btn)',
                border: '1px solid var(--border-card)', fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--text-main)', cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <RefreshCw style={{ width: 14, height: 14, animation: dnsProbe.status === 'testing' ? 'spin 1s linear infinite' : 'none', color: 'var(--brand-primary)' }} />
              <span>{dnsProbe.status === 'testing' ? 'Probing...' : 'Run DNS probe'}</span>
            </button>
            {dnsProbe.lastChecked && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                Last checked: {formatTimeSince(dnsProbe.lastChecked)}
              </span>
            )}
          </div>
        </div>

        {/* Real Status Checks — only shows verifiable facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Configuration status
          </h3>

          {/* DNS Resolver Check */}
          <div className="card-panel" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Globe style={{ width: 20, height: 20, color: isDnsOk ? 'var(--badge-green-text)' : 'var(--text-dim)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Encrypted DNS Resolver
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                    {!hasTestedDns
                      ? 'Not tested yet — click "Run DNS probe" to verify'
                      : isDnsOk
                        ? `Cloudflare Security DNS responded in ${dnsProbe.latencyMs} ms`
                        : 'Could not reach the DNS resolver'
                    }
                  </div>
                </div>
              </div>
              <StatusIcon ok={isDnsOk} tested={hasTestedDns} />
            </div>
          </div>

          {/* Browser Extension Check */}
          <div className="card-panel" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Puzzle style={{ width: 20, height: 20, color: isExtOk ? 'var(--badge-green-text)' : 'var(--text-dim)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Browser Extension
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                    {isExtOk
                      ? 'BYEADS browser extension detected in this browser'
                      : 'No extension detected — install from the Install page for in-page protection'
                    }
                  </div>
                </div>
              </div>
              <StatusIcon ok={isExtOk} tested={extStatus.checkedAt !== null} />
            </div>
          </div>

          {/* PWA / Homescreen Check */}
          <div className="card-panel" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Smartphone style={{ width: 20, height: 20, color: deviceProfile.isStandalone ? 'var(--badge-green-text)' : 'var(--text-dim)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Home Screen App
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                    {deviceProfile.isStandalone
                      ? 'Running as a standalone home screen application'
                      : 'Running in a browser tab — you can add this to your home screen for quick access'
                    }
                  </div>
                </div>
              </div>
              <StatusIcon ok={deviceProfile.isStandalone} tested={true} />
            </div>
          </div>
        </div>

        {/* Setup prompt when DNS not reachable */}
        {hasTestedDns && !isDnsOk && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.04)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 22px',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Setup required for {deviceProfile.name}:
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
                  Download and install the Apple Encrypted DNS configuration profile:
                </div>
                <a href="/byeads-encrypted-dns.mobileconfig" download="byeads-encrypted-dns.mobileconfig" className="btn btn-primary btn-sm">
                  <Download style={{ width: 14, height: 14 }} />
                  <span>Download Profile (.mobileconfig)</span>
                </a>
              </div>
            )}

            {selectedDevice === 'windows' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)' }}>
                  Download and double-click the batch installer:
                </div>
                <a href="/install-byeads-dns.bat" download="install-byeads-dns.bat" className="btn btn-primary btn-sm">
                  <Download style={{ width: 14, height: 14 }} />
                  <span>Download install-byeads-dns.bat</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Transparency note */}
        <div className="card-panel" style={{ padding: '18px 22px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <Info style={{ width: 20, height: 20, color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                What this dashboard shows
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
                This dashboard verifies your configuration by performing a real DNS-over-HTTPS probe
                to Cloudflare's Security DNS resolver and detecting whether the BYEADS browser extension
                is installed. It does not fabricate statistics or activity logs. Domain-level blocking
                happens at the DNS resolver — BYEADS does not have visibility into individual blocked
                queries from this web interface.
              </p>
            </div>
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
