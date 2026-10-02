import React, { useState } from 'react';
import {
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  Server,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  ExternalLink,
  ChevronRight,
  FileCode,
  FolderArchive,
  Info,
  Layers,
  AlertCircle
} from 'lucide-react';

type PlatformId = 'chrome' | 'windows' | 'apple' | 'android' | 'docker';

export default function InstallPage() {
  const [activeTab, setActiveTab] = useState<PlatformId>('chrome');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const platforms = [
    { id: 'chrome' as PlatformId, name: 'Chrome / Brave / Edge', icon: Globe, badge: 'Implemented & Tested' },
    { id: 'windows' as PlatformId, name: 'Windows 11 / 10', icon: Monitor, badge: 'Implemented & Tested' },
    { id: 'apple' as PlatformId, name: 'macOS & iOS', icon: Laptop, badge: 'Implemented & Tested' },
    { id: 'android' as PlatformId, name: 'Android', icon: Smartphone, badge: 'Implemented & Tested' },
    { id: 'docker' as PlatformId, name: 'Docker / Self-Host', icon: Server, badge: 'Implemented & Tested' },
  ];

  return (
    <main style={{ flex: 1, padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div className="section-overline">
            <Download style={{ width: 14, height: 14 }} />
            <span>Install &amp; Setup Center</span>
          </div>
          <h1 className="section-title">Production Installation Guide</h1>
          <p className="section-desc">
            Production-ready setup guides and direct downloadable packages for every device.
            Zero third-party telemetry, 100% open-source under MPL-2.0.
          </p>
        </div>

        {/* Architectural Scope Notice */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-sub)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Info style={{ width: 20, height: 20, color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-main)' }}>Architectural Scope Notice:</strong> Installing this Web Dashboard (PWA) does NOT install an operating-system packet filter or system proxy. DNS Shield protection requires applying your platform's encrypted DNS settings (DoH/DoT or Apple profile). In-page deception detection and download interception require installing the BYEADS Browser Extension.
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-sub)',
        }}>
          {platforms.map((p) => {
            const Icon = p.icon;
            const isActive = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  border: isActive ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-sub)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon style={{ width: 16, height: 16, color: isActive ? 'var(--brand-primary)' : 'inherit' }} />
                <span>{p.name}</span>
                <span style={{
                  fontSize: '0.6875rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--bg-sidebar)' : 'transparent',
                  color: 'var(--badge-green-text)',
                  fontWeight: 600
                }}>
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="card-panel" style={{ padding: '36px', maxWidth: '920px', margin: '0 auto 40px' }}>
          {/* TAB: CHROME / BRAVE / EDGE */}
          {activeTab === 'chrome' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Chromium Manifest V3 Extension
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    Works on Google Chrome, Microsoft Edge, Brave, Opera, and Vivaldi.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Implemented &amp; Tested</span>
                </div>
              </div>

              {/* Direct Download Banner */}
              <div style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-sub)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <FolderArchive style={{ width: 32, height: 32, color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Download BYEADS Extension Archive
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                      Version 1.0.0 · Pre-packaged zip ready to unpack and load
                    </div>
                  </div>
                </div>

                <a
                  href="/byeads-extension-chromium.zip"
                  download="byeads-extension-chromium.zip"
                  className="btn btn-primary"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download .ZIP</span>
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-sub)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    flexShrink: 0
                  }}>1</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Unpack the Downloaded Archive
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                      Extract <code>byeads-extension-chromium.zip</code> into any folder on your computer.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-sub)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    flexShrink: 0
                  }}>2</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Open Browser Extensions
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                      Navigate to <code>chrome://extensions</code> (or <code>edge://extensions</code>, <code>brave://extensions</code>) and toggle <strong>Developer mode</strong> in the top-right corner.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-sub)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    flexShrink: 0
                  }}>3</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Load Unpacked Extension
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                      Click <strong>Load unpacked</strong> and select the extracted folder. BYEADS will activate immediately with Web Shield and Deception Engine enabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WINDOWS */}
          {activeTab === 'windows' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Windows 11 &amp; 10 Native DNS-over-HTTPS
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    System-wide encrypted DNS protection without requiring background daemons or VPN clients.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Implemented &amp; Tested</span>
                </div>
              </div>

              {/* Option A: One-Liner PowerShell Command */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Option A: One-Command PowerShell Setup (Run as Administrator)
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', marginBottom: '10px' }}>
                  Open PowerShell as Administrator and run the production script directly:
                </p>
                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  <code>
                    irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex
                  </code>
                  <button
                    onClick={() => handleCopy('irm https://raw.githubusercontent.com/AzeemS24/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex', 'ps_remote')}
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'absolute', right: '12px', top: '10px' }}
                  >
                    {copiedKey === 'ps_remote' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copiedKey === 'ps_remote' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Option B: Windows Settings GUI */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Option B: Windows 11 Settings GUI
                </h3>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-sub)', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li>Open <strong>Settings</strong> (<code>Win + I</code>) and click <strong>Network &amp; Internet</strong>.</li>
                  <li>Click your active connection (<strong>Wi-Fi</strong> or <strong>Ethernet</strong>).</li>
                  <li>Next to <strong>DNS server assignment</strong>, click <strong>Edit</strong>.</li>
                  <li>Switch from <em>Automatic (DHCP)</em> to <strong>Manual</strong> and enable <strong>IPv4</strong>.</li>
                  <li>Set <strong>Preferred DNS</strong> to <code>1.1.1.2</code> and select <strong>Encrypted only (DNS over HTTPS)</strong>.</li>
                  <li>Set <strong>Alternate DNS</strong> to <code>1.0.0.2</code> and click <strong>Save</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB: APPLE */}
          {activeTab === 'apple' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    macOS &amp; iOS Configuration Profile
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    1-click system configuration using Apple's native Encrypted DNS protocol (DoH/DoT).
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Implemented &amp; Tested</span>
                </div>
              </div>

              {/* Direct Download Profile */}
              <div style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-sub)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    byeads-encrypted-dns.mobileconfig
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Official Apple Managed Encrypted DNS Profile (iOS 14+ / macOS 11+)
                  </div>
                </div>

                <a
                  href="/byeads-encrypted-dns.mobileconfig"
                  download="byeads-encrypted-dns.mobileconfig"
                  className="btn btn-primary"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download Profile</span>
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Installation Steps (macOS)
                  </h3>
                  <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Download the profile above.</li>
                    <li>Double-click the downloaded <code>.mobileconfig</code> file.</li>
                    <li>Open <strong>System Settings</strong> &gt; <strong>Privacy &amp; Security</strong> &gt; <strong>Profiles</strong>.</li>
                    <li>Select <strong>BYEADS Encrypted DNS</strong> and click <strong>Install...</strong></li>
                  </ol>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Installation Steps (iOS / iPadOS)
                  </h3>
                  <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Tap Download Profile in Safari. Tap <strong>Allow</strong> when prompted.</li>
                    <li>Open <strong>Settings</strong> &gt; <strong>Profile Downloaded</strong> (or <strong>General</strong> &gt; <strong>VPN &amp; Device Management</strong>).</li>
                    <li>Tap <strong>Install</strong> and enter your passcode to confirm.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANDROID */}
          {activeTab === 'android' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Android Private DNS (DoT)
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    Native Android 9+ system encrypted DNS over TLS without installing any third-party app.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Implemented &amp; Tested</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Private DNS Hostname
                </h3>
                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  <code>security.cloudflare-dns.com</code>
                  <button
                    onClick={() => handleCopy('security.cloudflare-dns.com', 'dot_host')}
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'absolute', right: '12px', top: '10px' }}
                  >
                    {copiedKey === 'dot_host' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copiedKey === 'dot_host' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Or enter your private self-hosted BYEADS CoreDNS hostname (e.g. <code>dns.yourdomain.com</code>).
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Setup Steps
                </h3>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-sub)', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li>Open <strong>Settings</strong> on your Android phone.</li>
                  <li>Tap <strong>Network &amp; internet</strong> (or <strong>Connections</strong>).</li>
                  <li>Tap <strong>Private DNS</strong>.</li>
                  <li>Select <strong>Private DNS provider hostname</strong>.</li>
                  <li>Paste <code>security.cloudflare-dns.com</code> and tap <strong>Save</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB: DOCKER / SELF-HOST */}
          {activeTab === 'docker' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Docker &amp; Self-Host Stack
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    Run a dedicated CoreDNS resolver container with built-in ad/malware domain blocklists.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Implemented &amp; Tested</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  1. Clone and Deploy Stack
                </h3>
                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  <code>
                    git clone https://github.com/AzeemS24/BYEADS.git<br />
                    cd BYEADS/platforms/self-host<br />
                    docker compose up -d
                  </code>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  2. Verify Active Filtering
                </h3>
                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  <code>
                    # Query blocked domain (should return 0.0.0.0)<br />
                    nslookup doubleclick.net 127.0.0.1<br /><br />
                    # Query regular domain (should resolve normally)<br />
                    nslookup wikipedia.org 127.0.0.1
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Source Code Download Section */}
        <div className="card-panel" style={{ padding: '32px', maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FileCode style={{ width: 32, height: 32, color: 'var(--brand-primary)', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Auditor &amp; Developer Source Bundle
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                  Download the complete uncompiled source repository including all engines, extensions, scripts, and 37 automated tests.
                </p>
              </div>
            </div>

            <a
              href="/byeads-source-bundle.zip"
              download="byeads-source-bundle.zip"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download style={{ width: 14, height: 14 }} />
              <span>Download Source .ZIP</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
