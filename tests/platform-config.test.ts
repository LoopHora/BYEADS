import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Platform Artifacts & Configurations', () => {
  const root = path.resolve(__dirname, '..');

  it('Chromium manifest.json should be valid Manifest V3', () => {
    const manifestPath = path.join(root, 'apps', 'extension-chromium', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.permissions).toContain('declarativeNetRequest');
    expect(manifest.permissions).toContain('downloads');
    expect(manifest.background.service_worker).toBe('background.js');
  });

  it('Chromium rules.json should contain valid rules', () => {
    const rulesPath = path.join(root, 'apps', 'extension-chromium', 'rules.json');
    expect(fs.existsSync(rulesPath)).toBe(true);

    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    expect(Array.isArray(rules)).toBe(true);
    expect(rules.length).toBeGreaterThanOrEqual(10);
    expect(rules[0].action.type).toBe('block');
    expect(rules[0].condition.urlFilter).toBeDefined();
  });

  it('Apple .mobileconfig profile should be well-formed XML with payload keys', () => {
    const profilePath = path.join(root, 'platforms', 'apple', 'byeads-encrypted-dns.mobileconfig');
    expect(fs.existsSync(profilePath)).toBe(true);

    const content = fs.readFileSync(profilePath, 'utf-8');
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('com.apple.dnsSettings.managed');
    expect(content).toContain('DNSSettings');
    expect(content).toContain('dns-query');
  });

  it('Windows setup-windows-doh.ps1 should be present and executable', () => {
    const psPath = path.join(root, 'platforms', 'windows', 'setup-windows-doh.ps1');
    expect(fs.existsSync(psPath)).toBe(true);

    const script = fs.readFileSync(psPath, 'utf-8');
    expect(script).toContain('Set-DnsClientServerAddress');
    expect(script).toContain('Add-DnsClientDohServerAddress');
  });

  it('Android Private DNS configuration guide should specify valid DoT endpoints', () => {
    const androidPath = path.join(root, 'platforms', 'android', 'setup-android-private-dns.md');
    expect(fs.existsSync(androidPath)).toBe(true);

    const guide = fs.readFileSync(androidPath, 'utf-8');
    expect(guide).toContain('dns.byeads.net');
    expect(guide).toContain('private_dns_specifier');
  });

  it('Firefox WebExtension package should include content and background scripts', () => {
    const bgPath = path.join(root, 'apps', 'extension-firefox', 'background.js');
    const csPath = path.join(root, 'apps', 'extension-firefox', 'content.js');
    expect(fs.existsSync(bgPath)).toBe(true);
    expect(fs.existsSync(csPath)).toBe(true);
  });

  it('Firefox manifest.json should be valid WebExtension', () => {
    const ffPath = path.join(root, 'apps', 'extension-firefox', 'manifest.json');
    expect(fs.existsSync(ffPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(ffPath, 'utf-8'));
    expect(manifest.manifest_version).toBe(2);
    expect(manifest.permissions).toContain('webRequest');
    expect(manifest.permissions).toContain('webRequestBlocking');
  });

  it('PWA public/manifest.json should be standalone and valid', () => {
    const pwaPath = path.join(root, 'public', 'manifest.json');
    expect(fs.existsSync(pwaPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(pwaPath, 'utf-8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.name).toContain('BYEADS');
  });
});

