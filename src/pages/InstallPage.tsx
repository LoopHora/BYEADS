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
    { id: 'apple' as PlatformId, name: 'macOS & iOS', icon: Laptop, badge: 'wBlock hybrid + filter list' },
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
                    irm https://raw.githubusercontent.com/LoopHora/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex
                  </code>
                  <button
                    onClick={() => handleCopy('irm https://raw.githubusercontent.com/LoopHora/BYEADS/main/platforms/windows/setup-windows-doh.ps1 | iex', 'ps_remote')}
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
                    Apple iOS &amp; macOS (wBlock Hybrid Setup)
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                    Zero-cost open-source architecture: Install wBlock from the App Store and subscribe to BYEADS's verified filter list.
                  </p>
                </div>
                <div className="badge badge-protection">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>wBlock Compatible · Zero Cost</span>
                </div>
              </div>

              {/* Hybrid Architecture Strategy Notice */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.035)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}>
                <Info style={{ width: 22, height: 22, color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Transparent Architecture Decision:</strong> BYEADS does not ship a closed, paid Apple App Store app or native proxy. Instead, we use <strong>wBlock</strong>—a free, open-source, high-performance Safari Content Blocker (GPL-3.0)—paired with the official <strong>BYEADS Declarative Filter List</strong>. This keeps development and hosting 100% free while delivering native WebKit-compiled blocking on iOS and macOS.
                </div>
              </div>

              {/* Step 1: Install wBlock App */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '24px',
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
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Globe style={{ width: 24, height: 24, color: '#60a5fa' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Step 1: Install wBlock for Safari</span>
                      <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>Free &amp; Open Source</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      Supports iOS 15+, iPadOS 15+, and macOS 12+ (Monterey, Ventura, Sonoma, Sequoia)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href="https://apps.apple.com/app/wblock-fast-adblock-for-safari/id6477748432"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <ExternalLink style={{ width: 16, height: 16 }} />
                    <span>wBlock on App Store</span>
                  </a>
                  <a
                    href="https://github.com/0x00dev/wBlock"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    <span>Source on GitHub</span>
                  </a>
                </div>
              </div>

              {/* Step 2: Subscribe to BYEADS Custom Filter List */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src="/logo.png"
                      alt="BYEADS Logo"
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        borderRadius: '10px',
                        filter: 'drop-shadow(0 4px 16px rgba(249, 115, 22, 0.45))',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Step 2: Add BYEADS Custom Filter List in wBlock</span>
                        <span className="badge badge-protection" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>Adblock Plus Syntax</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Tested for Safari Content Blocker compatibility (declarative domain rules + cosmetic CSS hiding)
                      </div>
                    </div>
                  </div>

                  <a
                    href={getGithubDownloadUrl('/byeads-wblock-filters.txt')}
                    download="byeads-wblock-filters.txt"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadPwaFile('/byeads-wblock-filters.txt', 'byeads-wblock-filters.txt');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    title="Direct download filter text file"
                  >
                    <Download style={{ width: 14, height: 14 }} />
                    <span>Download .TXT</span>
                  </a>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', marginBottom: '8px' }}>
                  Copy this subscription URL and paste it into wBlock:
                </div>

                <div style={{
                  background: 'var(--bg-sidebar)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  position: 'relative',
                  overflowX: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <code style={{ wordBreak: 'break-all' }}>
                    https://raw.githubusercontent.com/LoopHora/BYEADS/main/public/byeads-wblock-filters.txt
                  </code>
                  <button
                    onClick={() => handleCopy('https://raw.githubusercontent.com/LoopHora/BYEADS/main/public/byeads-wblock-filters.txt', 'wblock_url')}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    {copiedKey === 'wblock_url' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copiedKey === 'wblock_url' ? 'Copied' : 'Copy Filter URL'}</span>
                  </button>
                </div>

                <div style={{ marginTop: '16px', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-sub)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    How to add the URL in wBlock:
                  </div>
                  <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8125rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>Launch the <strong>wBlock</strong> app on your iPhone, iPad, or Mac.</li>
                    <li>Navigate to <strong>Filter Lists</strong> (or <strong>Custom Rules</strong>).</li>
                    <li>Tap <strong>+ Add Custom List</strong>, paste the URL above, and tap <strong>Save / Update</strong>.</li>
                  </ol>
                </div>
              </div>

              {/* Step 3: Enable Safari Extension Permissions */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                  Step 3: Enable wBlock in Safari Settings
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-sidebar)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-sub)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Smartphone style={{ width: 16, height: 16, color: 'var(--brand-primary)' }} />
                      <span>On iPhone / iPad (iOS 15+)</span>
                    </div>
                    <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8125rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Open the iOS <strong>Settings</strong> app.</li>
                      <li>Scroll down and tap <strong>Safari</strong> &gt; <strong>Extensions</strong>.</li>
                      <li>Locate <strong>wBlock</strong> content blockers and toggle them to <strong>ON</strong>.</li>
                      <li>In Safari, refresh any website to activate content blocking.</li>
                    </ol>
                  </div>

                  <div style={{ background: 'var(--bg-sidebar)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-sub)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Laptop style={{ width: 16, height: 16, color: 'var(--brand-primary)' }} />
                      <span>On Mac (macOS 12+ / Safari 15+)</span>
                    </div>
                    <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8125rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Launch <strong>Safari</strong> on your Mac.</li>
                      <li>Go to <strong>Safari</strong> in the menu bar &gt; <strong>Settings</strong> (or <strong>Preferences</strong>).</li>
                      <li>Click the <strong>Extensions</strong> tab.</li>
                      <li>Check the boxes next to <strong>wBlock</strong> to activate them.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Transparent Capability Matrix */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                  Platform Capability Transparency Matrix
                </h3>
                <div style={{
                  overflowX: 'auto',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-sub)',
                  backgroundColor: 'var(--bg-card)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-sub)', backgroundColor: 'var(--bg-sidebar)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-main)', fontWeight: 700 }}>Protection Feature</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--text-main)', fontWeight: 700 }}>Apple (wBlock + Safari)</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--text-main)', fontWeight: 700 }}>Chrome / Firefox Extension</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-main)', fontWeight: 700 }}>Technical Mechanism</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-sub)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>Domain &amp; Tracker Blocking</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>WebKit Declarative JSON / declarativeNetRequest</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-sub)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>Cosmetic Element Hiding</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>Native WebKit CSS rule injection (##.ad-banner)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-sub)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>Deception Engine (Fake Buttons)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-amber-text)' }}>Not Available</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>Requires procedural MutationObserver (Chrome/FF only)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-sub)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>In-Stream Video Ad Defusion</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-amber-text)' }}>Not Available</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>Requires active JavaScript speed manipulation</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>Download Guard Double Extension Trap</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-amber-text)' }}>Not Available</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--badge-green-text)', fontWeight: 600 }}>Supported</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>Requires chrome.downloads API interception</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Optional Section: System-Wide Encrypted DNS */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-sub)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Server style={{ width: 20, height: 20, color: 'var(--badge-amber-text)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      Optional: System-Wide Encrypted DNS Filtering
                    </h3>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>Optional · Does not block video ads</span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '14px' }}>
                  If you want system-wide domain filtering across all apps (outside of Safari), you can configure an established encrypted DNS provider. DNS filtering operates strictly at domain lookup resolution and does not inspect HTTPS payloads or alter in-stream video.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-sidebar)', border: '1px solid var(--border-sub)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '4px' }}>Option A: NextDNS (Recommended)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>Established encrypted DNS with official iOS / macOS app and configurable blocklists.</div>
                    <a href="https://nextdns.io" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>visit nextdns.io</span> <ExternalLink style={{ width: 12, height: 12 }} />
                    </a>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-sidebar)', border: '1px solid var(--border-sub)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '4px' }}>Option B: Cloudflare 1.1.1.2</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>Global DoH/DoT blocking malware and known phishing domains.</div>
                    <a href="https://one.one.one.one" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>visit 1.1.1.1</span> <ExternalLink style={{ width: 12, height: 12 }} />
                    </a>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-sidebar)', border: '1px solid var(--border-sub)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '4px' }}>Option C: BYEADS .mobileconfig</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>Native Apple Configuration Profile routing to dns.byeads.net.</div>
                    <a
                      href={getGithubDownloadUrl('/byeads-encrypted-dns.mobileconfig')}
                      download="byeads-encrypted-dns.mobileconfig"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadPwaFile('/byeads-encrypted-dns.mobileconfig', 'byeads-encrypted-dns.mobileconfig');
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Download style={{ width: 12, height: 12 }} /> <span>Download Profile</span>
                    </a>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px solid var(--border-sub)', paddingTop: '10px' }}>
                  Note on Apple OS Profiles: On iOS 14+ / macOS 11+, downloaded .mobileconfig profiles require manual authorization in Settings &gt; Profile Downloaded. Apple periodically updates profile installation workflows in major OS releases; always verify in system settings.
                </div>
              </div>

              {/* Removal & Uninstallation Guide */}
              <div style={{
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-sub)'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  How to Remove or Disable
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8125rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Disable Filter List:</strong> In the wBlock app, go to Filter Lists and toggle off or delete the BYEADS list.</li>
                  <li><strong>Remove wBlock:</strong> Delete the wBlock application from your device just like any other app.</li>
                  <li><strong>Remove DNS Profile (if installed):</strong> On iOS, go to Settings &gt; General &gt; VPN &amp; Device Management &gt; select profile &gt; Remove. On Mac, go to System Settings &gt; Privacy &amp; Security &gt; Profiles &gt; Remove.</li>
                </ul>
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
