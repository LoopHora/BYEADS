import { describe, it, expect } from 'vitest';
import { RedirectIntelligence } from '../packages/core/src/redirect-intelligence';

describe('Redirect Intelligence', () => {
  const intel = new RedirectIntelligence();

  it('should detect and block circular redirect loops', () => {
    const verdict = intel.evaluate({
      originUrl: 'https://site.com/start',
      finalUrl: 'https://site.com/loop-a',
      hops: [
        { url: 'https://site.com/start' },
        { url: 'https://site.com/loop-a' },
        { url: 'https://site.com/loop-b' },
        { url: 'https://site.com/loop-a' }
      ]
    });

    expect(verdict.action).toBe('block');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(70);
    expect(verdict.reasons.some(r => r.code === 'REDIRECT_CIRCULAR_LOOP')).toBe(true);
  });

  it('should warn on excessive redirect chains (>4 hops)', () => {
    const verdict = intel.evaluate({
      originUrl: 'https://ad-net.com/click',
      finalUrl: 'https://ad-net.com/product',
      hops: [
        { url: 'https://ad-net.com/click' },
        { url: 'https://ad-net.com/r1' },
        { url: 'https://ad-net.com/r2' },
        { url: 'https://ad-net.com/r3' },
        { url: 'https://ad-net.com/r4' },
        { url: 'https://ad-net.com/product' }
      ]
    });

    expect(verdict.action).toBe('warn');
    expect(verdict.reasons.some(r => r.code === 'REDIRECT_EXCESSIVE_CHAIN')).toBe(true);
  });

  it('should warn on cross-domain arbitrage across many unrelated domains', () => {
    const verdict = intel.evaluate({
      originUrl: 'https://alpha.com',
      finalUrl: 'https://delta.com',
      hops: [
        { url: 'https://alpha.com/go' },
        { url: 'https://beta.com/track' },
        { url: 'https://gamma.com/redirect' },
        { url: 'https://delta.com/landing' }
      ]
    });

    expect(verdict.action).toBe('warn');
    expect(verdict.reasons.some(r => r.code === 'REDIRECT_CROSS_DOMAIN_ARBITRAGE')).toBe(true);
  });

  it('should allow normal 1-2 hop CDN/Authentication redirects', () => {
    const verdict = intel.evaluate({
      originUrl: 'http://docs.loophora.com',
      finalUrl: 'https://docs.loophora.com/en',
      hops: [
        { url: 'http://docs.loophora.com' },
        { url: 'https://docs.loophora.com' },
        { url: 'https://docs.loophora.com/en' }
      ]
    });

    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
  });
});
