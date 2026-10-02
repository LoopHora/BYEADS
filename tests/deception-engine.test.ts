import { describe, it, expect } from 'vitest';
import { DeceptionEngine } from '../packages/core/src/deception-engine';

describe('Deception Engine', () => {
  const engine = new DeceptionEngine();

  it('should detect and block double extensions masquerading as documents', () => {
    const verdict = engine.analyze({
      actualFilename: 'quarterly_report.pdf.exe',
      sourceUrl: 'https://example-downloads.com',
      destinationUrl: 'https://example-downloads.com/file'
    });

    expect(verdict.action).toBe('block');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(90);
    expect(verdict.reasons.some(r => r.code === 'DECEPTION_DOUBLE_EXTENSION')).toBe(true);
  });

  it('should detect double extension masquerading as media file', () => {
    const verdict = engine.analyze({
      actualFilename: 'movie_clip.mp4.scr',
      sourceUrl: 'https://video-share.net',
      destinationUrl: 'https://video-share.net/get'
    });

    expect(verdict.action).toBe('block');
    expect(verdict.reasons[0].code).toBe('DECEPTION_DOUBLE_EXTENSION');
  });

  it('should detect whitespace padding evasion', () => {
    const verdict = engine.analyze({
      actualFilename: 'invoice                .exe',
      sourceUrl: 'https://invoices-portal.com',
      destinationUrl: 'https://invoices-portal.com/dl'
    });

    expect(verdict.action).toBe('block');
    expect(verdict.reasons.some(r => r.code === 'DECEPTION_WHITESPACE_PADDING')).toBe(true);
  });

  it('should flag fake download buttons pointing to third-party domains', () => {
    const verdict = engine.analyze({
      actualFilename: 'setup.exe',
      buttonText: 'DIRECT DOWNLOAD FREE',
      sourceUrl: 'https://software-directory.org/tool',
      destinationUrl: 'https://cdn-ad-arbitrage.xyz/click?id=992'
    });

    expect(verdict.action).toBe('warn');
    expect(verdict.reasons.some(r => r.code === 'DECEPTION_DESTINATION_MISMATCH')).toBe(true);
  });

  it('should flag extreme size mismatch between claimed and actual file', () => {
    const verdict = engine.analyze({
      actualFilename: 'game-installer.zip',
      claimedSizeMb: 1200, // 1.2 GB
      actualSizeMb: 0.4,    // 400 KB (fake downloader / dropper)
      sourceUrl: 'https://games.com',
      destinationUrl: 'https://games.com/dl'
    });

    expect(verdict.action).toBe('warn');
    expect(verdict.reasons.some(r => r.code === 'DECEPTION_SIZE_MISMATCH')).toBe(true);
  });

  it('should allow legitimate clean downloads', () => {
    const verdict = engine.analyze({
      actualFilename: 'annual_report_2026.pdf',
      claimedSizeMb: 5,
      actualSizeMb: 5,
      sourceUrl: 'https://trusted-company.com/reports',
      destinationUrl: 'https://trusted-company.com/files/annual_report_2026.pdf'
    });

    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
  });
});
