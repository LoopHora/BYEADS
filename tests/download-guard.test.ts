import { describe, it, expect } from 'vitest';
import { DownloadGuard } from '../packages/core/src/download-guard';

describe('Download Guard', () => {
  const guard = new DownloadGuard();

  it('should detect executable MIME type masquerading under safe extension', () => {
    const verdict = guard.evaluate({
      filename: 'contract.pdf',
      mimeType: 'application/x-msdownload',
      url: 'https://files.com/contract.pdf',
      isUserInitiated: true
    });

    expect(verdict.action).toBe('block');
    expect(verdict.riskScore).toBeGreaterThanOrEqual(90);
    expect(verdict.reasons.some(r => r.code === 'DOWNLOAD_MIME_MISMATCH')).toBe(true);
  });

  it('should block file downloads with dangerous browser flag', () => {
    const verdict = guard.evaluate({
      filename: 'setup.exe',
      mimeType: 'application/x-msdownload',
      url: 'https://cdn.com/setup.exe',
      dangerType: 'dangerous_file',
      isUserInitiated: true
    });

    expect(verdict.action).toBe('block');
    expect(verdict.reasons.some(r => r.code === 'DOWNLOAD_BROWSER_DANGER_DANGEROUS_FILE')).toBe(true);
  });

  it('should warn on unsolicited drive-by downloads without user gesture', () => {
    const verdict = guard.evaluate({
      filename: 'player-update.iso',
      mimeType: 'application/octet-stream',
      url: 'https://cdn.com/player-update.iso',
      isUserInitiated: false
    });

    expect(verdict.action).toBe('warn');
    expect(verdict.reasons.some(r => r.code === 'DOWNLOAD_DRIVE_BY_ATTEMPT')).toBe(true);
  });

  it('should block executables downloaded directly from raw IP addresses', () => {
    const verdict = guard.evaluate({
      filename: 'malicious.exe',
      mimeType: 'application/x-msdownload',
      url: 'http://185.220.101.5/malicious.exe',
      isUserInitiated: true
    });

    expect(verdict.action).toBe('block');
    expect(verdict.reasons.some(r => r.code === 'DOWNLOAD_DIRECT_IP_EXECUTABLE')).toBe(true);
  });

  it('should allow legitimate PDF downloads with valid MIME type', () => {
    const verdict = guard.evaluate({
      filename: 'whitepaper.pdf',
      mimeType: 'application/pdf',
      url: 'https://docs.loophora.com/whitepaper.pdf',
      isUserInitiated: true
    });

    expect(verdict.action).toBe('allow');
    expect(verdict.riskScore).toBe(0);
  });

  describe('feature.md Section 2 — Advertised vs Actual Download Size Tolerance', () => {
    it('300 MB advertised vs 321 MB observed -> acceptable variance (rounded/approximate)', () => {
      const res = guard.evaluateSizeTolerance(300, 321);
      expect(res.status).toBe('acceptable_variance');
      expect(res.riskPenalty).toBe(0);
      expect(res.message).toContain('rounded or approximate');
    });

    it('300 MB advertised vs 275 MB observed -> acceptable variance (compression/metadata)', () => {
      const res = guard.evaluateSizeTolerance(300, 275);
      expect(res.status).toBe('acceptable_variance');
      expect(res.riskPenalty).toBe(0);
      expect(res.message).toContain('compression variance');
    });

    it('300 MB advertised vs 95 MB observed -> discrepancy flagged with warning', () => {
      const res = guard.evaluateSizeTolerance(300, 95);
      expect(res.status).toBe('discrepancy');
      expect(res.riskPenalty).toBeGreaterThanOrEqual(40);
      expect(res.message).toContain('Significant unexplained size discrepancy');

      // Integrated evaluate check
      const verdict = guard.evaluate({
        filename: 'large-package.zip',
        mimeType: 'application/zip',
        url: 'https://downloads.test/large-package.zip',
        isUserInitiated: true,
        advertisedSizeMb: 300,
        observedSizeMb: 95
      });
      expect(verdict.action).toBe('warn');
      expect(verdict.reasons.some(r => r.code === 'DOWNLOAD_SIZE_DISCREPANCY')).toBe(true);
    });

    it('300 MB advertised vs 300 MB observed -> consistent match', () => {
      const res = guard.evaluateSizeTolerance(300, 300);
      expect(res.status).toBe('consistent');
      expect(res.riskPenalty).toBe(0);
    });
  });
});

