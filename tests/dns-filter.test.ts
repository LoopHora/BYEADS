import { describe, it, expect, beforeEach } from 'vitest';
import { DnsFilterEngine } from '../packages/core/src/dns-filter';

describe('DNS Shield Filter Engine', () => {
  let engine: DnsFilterEngine;

  beforeEach(() => {
    engine = new DnsFilterEngine();
    engine.addRule({
      domain: 'doubleclick.net',
      action: 'block',
      reasonCode: 'DNS_BLOCK_AD',
      category: 'ad'
    });
    engine.addRule({
      domain: '*.trackers.org',
      action: 'block',
      reasonCode: 'DNS_BLOCK_TRACKER',
      category: 'tracker'
    });
    engine.addRule({
      domain: 'phishing-login-secure.xyz',
      action: 'block',
      reasonCode: 'DNS_BLOCK_PHISHING',
      category: 'phishing'
    });
  });

  it('should block exact domain matches', () => {
    const verdict = engine.evaluate('doubleclick.net');
    expect(verdict.action).toBe('block');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(80);
    expect(verdict.reasons[0].code).toBe('DNS_BLOCK_AD');
  });

  it('should be case-insensitive and handle trailing dots', () => {
    const verdict = engine.evaluate('DOUBLECLICK.NET.');
    expect(verdict.action).toBe('block');
  });

  it('should block subdomains of blocked domains', () => {
    const verdict = engine.evaluate('ad.doubleclick.net');
    expect(verdict.action).toBe('block');
    expect(verdict.reasons[0].code).toBe('DNS_PARENT_DOMAIN_BLOCKED');
  });

  it('should block wildcard rules', () => {
    const verdict = engine.evaluate('user-telemetry.trackers.org');
    expect(verdict.action).toBe('block');
    expect(verdict.reasons[0].code).toBe('DNS_WILDCARD_MATCH');
  });

  it('should allow legitimate clean domains', () => {
    const verdict = engine.evaluate('wikipedia.org');
    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
    expect(verdict.reasons.length).toBe(0);
  });

  it('should prioritize user allowlist over blocklist', () => {
    engine.addAllowlist('doubleclick.net');
    const verdict = engine.evaluate('doubleclick.net');
    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
    expect(verdict.reasons[0].code).toBe('DNS_ALLOWLIST_OVERRIDE');
  });

  it('should honor parent allowlist for subdomains', () => {
    engine.addAllowlist('partner-site.com');
    expect(engine.isAllowlisted('api.partner-site.com')).toBe(true);
    expect(engine.isAllowlisted('cdn.us.partner-site.com')).toBe(true);
  });
});
