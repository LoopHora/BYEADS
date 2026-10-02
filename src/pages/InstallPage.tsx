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
  FolderArchive,
  Info,
  Layers,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { getGithubDownloadUrl, downloadPwaFile } from '../utils/pwaDownloader';

type PlatformId = 'chrome' | 'firefox' | 'windows' | 'apple' | 'android';

export default function InstallPage() {
  const [activeTab, setActiveTab] = useState<PlatformId>('chrome');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const platforms = [
    { id: 'chrome' as PlatformId, name: 'Chrome / Brave / Edge', icon: Globe, badge: 'Extension package available' },
    { id: 'firefox' as PlatformId, name: 'Mozilla Firefox', icon: Globe, badge: 'Extension package available' },
    { id: 'windows' as PlatformId, name: 'Windows 11 / 10', icon: Monitor, badge: 'DoH setup script available' },
    { id: 'apple' as PlatformId, name: 'macOS & iOS', icon: Laptop, badge: 'Mobileconfig profile available' },
    { id: 'android' as PlatformId, name: 'Android', icon: Smartphone, badge: 'Private DNS instructions available' },
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
          <h1 className="section-title">Install BYEADS</h1>
          <p className="section-desc">
            Choose your device or browser to see the available setup instructions. BYEADS uses two distinct protection layers: encrypted DNS for domain-level filtering and browser extensions for supported in-page and browser-level checks. The layers have different capabilities and must be configured separately.
          </p>
        </div>

        {/* Architectural Scope Notice */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-sub)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 22px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <AlertCircle style={{ width: 22, height: 22, color: 'var(--badge-amber-text)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-main)' }}>Dual-Layer Architecture:</strong> System-level DNS profiles configure encrypted queries routed to <strong>BYEADS Anycast DNS Shield (<code>dns.byeads.net</code>)</strong>, blocking ad and tracker domains network-wide across all apps. Browser extensions provide in-page protection (DOM fake button detection, video/audio ad fast-forwarding, and download interception). For full protection, apply both your device's DNS settings and the browser extension.
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
                  <span>Extension locally tested</span>
                </div>
              </div>

              {/* Direct Download Banner (Apple-style Glassmorphic) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src="/logo.png"
                    alt="BYEADS Logo"
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: 'contain',
                      borderRadius: '10px',
                      filter: 'drop-shadow(0 4px 16px rgba(249, 115, 22, 0.45))',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Download BYEADS Chromium Archive</span>
                      <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>v1.0.0</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Official Chromium Manifest V3 Package · Compatible with Chrome, Brave &amp; Edge
                    </div>
                  </div>
                </div>

                <a
                  href={getGithubDownloadUrl('/byeads-extension-chromium.zip')}
                  download="byeads-extension-chromium.zip"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadPwaFile('/byeads-extension-chromium.zip', 'byeads-extension-chromium.zip');
                  }}
                  className="btn btn-primary"
                  style={{
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  title="Direct download from GitHub"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download .ZIP (GitHub)</span>
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
                  <span>Script available</span>
                </div>
              </div>

              {/* Architecture Scope Notice: No EXE needed */}
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Info style={{ width: 20, height: 20, color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Why No .EXE Installer or Duplicate Windows Extension?</strong><br />
                  • <strong>Browser Protection:</strong> Extensions are cross-platform by nature. On Windows, simply install the official <strong>Chromium Extension</strong> (for Chrome, Edge, Brave) or <strong>Firefox Extension</strong>.<br />
                  • <strong>System Protection:</strong> An <code>.exe</code> background program is unnecessary and wastes 80–150MB of RAM. Instead, Windows 10/11 natively includes kernel-level <strong>DNS-over-HTTPS (DoH)</strong>. Our lightweight script registers <code>dns.byeads.net</code> with <strong>0 MB background RAM usage</strong> and zero SmartScreen/Antivirus warnings.
                </div>
              </div>

              {/* 1-Click Batch Installer Card (Glassmorphic) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                    flexShrink: 0
                  }}>
                    <Terminal style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>install-byeads-dns.bat</span>
                      <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>1-Click Setup</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Double-click to run · Configures native Windows 11/10 DoH for all network adapters (Wi-Fi &amp; Ethernet)
                    </div>
                  </div>
                </div>

                <a
                  href={getGithubDownloadUrl('/install-byeads-dns.bat')}
                  download="install-byeads-dns.bat"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadPwaFile('/install-byeads-dns.bat', 'install-byeads-dns.bat');
                  }}
                  className="btn btn-primary"
                  style={{
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  title="Direct download from GitHub"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download .BAT (GitHub)</span>
                </a>
              </div>

              {/* Option A: One-Liner PowerShell Command */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Option A: Automated PowerShell Setup (Run as Administrator)
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', marginBottom: '10px' }}>
                  Open PowerShell as Administrator and run the remote setup command:
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
                  overflowX: 'auto',
                  marginBottom: '12px'
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

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Or if running from a downloaded repository / source bundle:
                </p>
                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto'
                }}>
                  <code>
                    powershell -ExecutionPolicy Bypass -File .\platforms\windows\setup-windows-doh.ps1
                  </code>
                  <button
                    onClick={() => handleCopy('powershell -ExecutionPolicy Bypass -File .\\platforms\\windows\\setup-windows-doh.ps1', 'ps_local')}
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'absolute', right: '12px', top: '8px' }}
                  >
                    {copiedKey === 'ps_local' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copiedKey === 'ps_local' ? 'Copied' : 'Copy'}</span>
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
                  <span>Profile available</span>
                </div>
              </div>

              {/* Direct Download Profile (Apple-style Glassmorphic) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src="/logo.png"
                    alt="BYEADS Logo"
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: 'contain',
                      borderRadius: '10px',
                      filter: 'drop-shadow(0 4px 16px rgba(249, 115, 22, 0.45))',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>byeads-encrypted-dns.mobileconfig</span>
                      <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>Apple Signed</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Official Apple Managed Encrypted DNS Profile (iOS 14+ / macOS 11+) · System-Wide Ad &amp; Tracker Blocking via DoH
                    </div>
                  </div>
                </div>

                <a
                  href={getGithubDownloadUrl('/byeads-encrypted-dns.mobileconfig')}
                  download="byeads-encrypted-dns.mobileconfig"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadPwaFile('/byeads-encrypted-dns.mobileconfig', 'byeads-encrypted-dns.mobileconfig');
                  }}
                  className="btn btn-primary"
                  style={{
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  title="Direct download from GitHub"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download Profile (GitHub)</span>
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

                {/* In-Stream Media Boundary Note for iOS */}
                <div style={{
                  marginTop: '12px',
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Scope &amp; In-Stream Video Limitations on iOS
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                    The encrypted DNS profile provides system-wide domain filtering against known ad, tracker, and malware domains across all iOS apps. Because encrypted DNS operates at the network resolution level, it cannot inspect encrypted HTTPS payloads or alter in-stream video playback (such as YouTube pre-rolls or sponsored segments).
                  </p>
                </div>

                {/* Safari WebExtension Package for MacBook / macOS */}
                <div style={{
                  marginTop: '20px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src="/logo.png"
                      alt="BYEADS Logo"
                      style={{
                        width: 44,
                        height: 44,
                        objectFit: 'contain',
                        borderRadius: '10px',
                        filter: 'drop-shadow(0 4px 16px rgba(249, 115, 22, 0.45))',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Safari WebExtension Package (macOS)</span>
                        <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>v1.0.0</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                        In-page DOM Shield, YouTube ad defuser, and Deception Engine for Safari 15.4+ on macOS
                      </div>
                    </div>
                  </div>

                  <a
                    href={getGithubDownloadUrl('/byeads-extension-safari.zip')}
                    download="byeads-extension-safari.zip"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadPwaFile('/byeads-extension-safari.zip', 'byeads-extension-safari.zip');
                    }}
                    className="btn btn-primary"
                    style={{
                      boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)'
                    }}
                    title="Direct download from GitHub"
                  >
                    <Download style={{ width: 16, height: 16 }} />
                    <span>Download Safari .ZIP (GitHub)</span>
                  </a>
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
                  <span>Instructions available</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Private DNS Provider Hostname
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Hostname 1: Ad & Tracker Blocker (Recommended) */}
                  <div style={{
                    background: 'var(--bg-sidebar)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-sub)',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--badge-green-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Recommended: BYEADS System-Wide Ad &amp; Tracker Blocker
                    </div>
                    <code style={{ fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 600 }}>dns.byeads.net</code>
                    <button
                      onClick={() => handleCopy('dns.byeads.net', 'dot_adblock')}
                      className="btn btn-secondary btn-sm"
                      style={{ position: 'absolute', right: '12px', top: '12px' }}
                    >
                      {copiedKey === 'dot_adblock' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      <span>{copiedKey === 'dot_adblock' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Official BYEADS Anycast Private DNS. Blocks in-app banner ads, popups, and telemetry trackers across all Android apps and games.
                    </div>
                  </div>

                  {/* Hostname 2: Security & Malware Only */}
                  <div style={{
                    background: 'var(--bg-sidebar)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-sub)',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Alternative: BYEADS Malware &amp; Threat Shield Only
                    </div>
                    <code style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>security.byeads.net</code>
                    <button
                      onClick={() => handleCopy('security.byeads.net', 'dot_security')}
                      className="btn btn-secondary btn-sm"
                      style={{ position: 'absolute', right: '12px', top: '12px' }}
                    >
                      {copiedKey === 'dot_security' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      <span>{copiedKey === 'dot_security' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Blocks known malware, phishing gateways, and deceptive fraud servers.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Setup Steps
                </h3>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-sub)', paddingLeft: '20px', listStyleType: 'decimal' }}>
                  <li>Open <strong>Settings</strong> on your Android phone.</li>
                  <li>Tap <strong>Network &amp; internet</strong> (or <strong>Connections</strong>).</li>
                  <li>Tap <strong>Private DNS</strong> (often located under More Connection Settings).</li>
                  <li>Select <strong>Private DNS provider hostname</strong>.</li>
                  <li>Paste <code>dns.byeads.net</code> and tap <strong>Save</strong>.</li>
                </ol>
              </div>

              {/* In-Stream Media & Mobile Extension Boundary Note */}
              <div style={{
                background: 'rgba(249, 115, 22, 0.08)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
              }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Mobile Scope &amp; In-Stream Video Ad Boundaries
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '10px' }}>
                  <strong>DNS Resolution Scope:</strong> Android Private DNS blocks network requests to known advertising and telemetry servers system-wide. Because YouTube in-stream video ads share the same content delivery hostnames (<code>*.googlevideo.com</code>) as the media stream itself, network-level DNS cannot filter video ads without breaking playback.
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
                  <strong>Browser Extension Support on Android:</strong> In-page scriptlet defusion (such as fast-forwarding or DOM filtering) requires a mobile browser that supports user extensions (such as Kiwi Browser or Firefox Developer/Nightly). Adding a website as a Home Screen shortcut (PWA) creates a standalone launcher, but standalone PWAs may run in isolated webviews where extension injection is restricted by the operating system. Always verify extension status in your browser's extension manager.
                </p>
              </div>
            </div>
          )}

          {/* TAB: MOZILLA FIREFOX */}
          {activeTab === 'firefox' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Mozilla Firefox WebExtension
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    Open-source WebExtension implementing Web Shield, Deception Engine, and Download Guard.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Extension locally tested</span>
                </div>
              </div>

              {/* Direct Download Banner (Apple-style Glassmorphic) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src="/logo.png"
                    alt="BYEADS Logo"
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: 'contain',
                      borderRadius: '10px',
                      filter: 'drop-shadow(0 4px 16px rgba(249, 115, 22, 0.45))',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Download Firefox Extension Package</span>
                      <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>v1.0.0</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Official WebExtension Package · Compatible with Mozilla Firefox
                    </div>
                  </div>
                </div>

                <a
                  href={getGithubDownloadUrl('/byeads-extension-firefox.zip')}
                  download="byeads-extension-firefox.zip"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadPwaFile('/byeads-extension-firefox.zip', 'byeads-extension-firefox.zip');
                  }}
                  className="btn btn-primary"
                  style={{
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  title="Direct download from GitHub"
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download .ZIP (GitHub)</span>
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
                      Extract <code>byeads-extension-firefox.zip</code> into a directory on your machine.
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
                      Open Firefox Debugging
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                      In Firefox, navigate to <code>about:debugging#/runtime/this-firefox</code> in the address bar.
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
                      Load Temporary Add-on
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                      Click <strong>Load Temporary Add-on...</strong> and select the extracted <code>manifest.json</code>. BYEADS will load into Firefox with immediate protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verify your setup */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-sub)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <CheckCircle2 style={{ width: 22, height: 22, color: 'var(--badge-green-text)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Verify your setup
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
                After configuration, return to the <a href="#/dashboard" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Protection Dashboard</a> to check DNS connectivity and extension detection separately. Available checks depend on your platform and browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
