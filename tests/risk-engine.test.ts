import { describe, it, expect } from 'vitest';
import { RiskDecisionEngine } from '../packages/core/src/risk-engine';

describe('Risk Decision Engine', () => {
  const engine = new RiskDecisionEngine();

  it('should fuse multiple signals into high-confidence block verdict', () => {
    const verdict = engine.fuse([
      {
        shield: 'deception',
        verdict: {
          action: 'warn',
          riskScore: 65,
          confidence: 'medium',
          reasons: [{
            code: 'DECEPTION_SIZE_MISMATCH',
            category: 'deception',
            weight: 65,
            message: 'Suspicious size mismatch'
          }],
          timestamp: Date.now(),
          target: 'sample.zip'
        }
      },
      {
        shield: 'download',
        verdict: {
          action: 'warn',
          riskScore: 50,
          confidence: 'medium',
          reasons: [{
            code: 'DOWNLOAD_DRIVE_BY_ATTEMPT',
            category: 'download',
            weight: 50,
            message: 'Unsolicited download'
          }],
          timestamp: Date.now(),
          target: 'sample.zip'
        }
      }
    ], 'https://malicious.test/sample.zip');

    expect(verdict.action).toBe('warn');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(60);
    expect(verdict.confidence).toBe('high');
    expect(verdict.reasons.length).toBe(2);
  });

  it('should enforce hard block when critical shield scores above 90', () => {
    const verdict = engine.fuse([
      {
        shield: 'deception',
        verdict: {
          action: 'block',
          riskScore: 90,
          confidence: 'high',
          reasons: [{
            code: 'DECEPTION_DOUBLE_EXTENSION',
            category: 'deception',
            weight: 90,
            message: 'Double extension detected'
          }],
          timestamp: Date.now(),
          target: 'test.pdf.exe'
        }
      }
    ], 'test.pdf.exe');

    expect(verdict.action).toBe('block');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(90);
  });

  it('should honor allowlist overrides across all shields', () => {
    const verdict = engine.fuse([
      {
        shield: 'dns',
        verdict: {
          action: 'allow',
          riskScore: 0,
          confidence: 'high',
          reasons: [{
            code: 'DNS_ALLOWLIST_OVERRIDE',
            category: 'dns',
            weight: 0,
            message: 'Explicitly allowed'
          }],
          timestamp: Date.now(),
          target: 'mycompany.com'
        }
      },
      {
        shield: 'redirect',
        verdict: {
          action: 'warn',
          riskScore: 50,
          confidence: 'low',
          reasons: [{
            code: 'REDIRECT_EXCESSIVE_CHAIN',
            category: 'redirect',
            weight: 50,
            message: 'Long chain'
          }],
          timestamp: Date.now(),
          target: 'mycompany.com'
        }
      }
    ], 'https://mycompany.com');

    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
    expect(verdict.reasons[0].code).toBe('DNS_ALLOWLIST_OVERRIDE');
  });
});
