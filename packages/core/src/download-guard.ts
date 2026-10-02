// ===== BYEADS DOWNLOAD GUARD =====
// Context-aware file payload, MIME-type, and approximate-size tolerance inspector
// Implements exact specification from DOCS/feature.md (Section 2 & 5)

import { ReasonCode, Verdict } from './policy';

export interface DownloadContext {
  url: string;
  filename: string;
  mimeType: string;
  contentLength?: number;
  dangerType?: string; // from Chrome/browser download API: 'dangerous_file' | 'uncommon' | 'safe'
  referrerUrl?: string;
  isUserInitiated: boolean;
  advertisedSizeMb?: number;
  observedSizeMb?: number;
}

export interface SizeCheckResult {
  status: 'consistent' | 'acceptable_variance' | 'discrepancy';
  message: string;
  riskPenalty: number;
}

export class DownloadGuard {
  private static EXECUTABLE_MIMES = new Set([
    'application/x-msdownload',
    'application/x-dosexec',
    'application/x-msi',
    'application/octet-stream',
    'application/x-executable',
    'application/x-sh'
  ]);

  private static DOCUMENT_MIMES = new Set([
    'application/pdf',
    'text/plain',
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'video/mp4'
  ]);

  /**
   * Evaluates advertised vs observed download size with tolerance for
   * rounding, compression, and versions as specified in feature.md.
   */
  public evaluateSizeTolerance(advertisedMb: number, observedMb: number): SizeCheckResult {
    if (advertisedMb <= 0 || observedMb <= 0) {
      return { status: 'consistent', message: 'Size details not specified.', riskPenalty: 0 };
    }

    if (advertisedMb === observedMb) {
      return {
        status: 'consistent',
        message: 'Observed size matches advertised size exactly (note: consistent size is not alone proof of safety).',
        riskPenalty: 0
      };
    }

    const diffRatio = (observedMb - advertisedMb) / advertisedMb;

    // Up to +15% or -15% is normal rounding, package overhead, or minor version diff
    if (diffRatio >= -0.15 && diffRatio <= 0.15) {
      if (observedMb > advertisedMb) {
        return {
          status: 'acceptable_variance',
          message: `Observed size (${observedMb} MB) is consistent with rounded or approximate advertised size (${advertisedMb} MB).`,
          riskPenalty: 0
        };
      } else {
        return {
          status: 'acceptable_variance',
          message: `Observed size (${observedMb} MB) is within normal compression variance of advertised size (${advertisedMb} MB).`,
          riskPenalty: 0
        };
      }
    }

    // Significant unexplained discrepancy (e.g. 300MB advertised, 95MB observed = -68%)
    if (diffRatio < -0.30 || diffRatio > 1.0) {
      return {
        status: 'discrepancy',
        message: `Significant unexplained size discrepancy: page claims ${advertisedMb} MB, but observed payload is only ${observedMb} MB. Possible stub downloader, adware dropper, or incomplete transfer.`,
        riskPenalty: 55
      };
    }

    // Moderate variance (e.g. -20% or +25%)
    return {
      status: 'acceptable_variance',
      message: `Minor size variance detected between stated (${advertisedMb} MB) and observed (${observedMb} MB) download.`,
      riskPenalty: 15
    };
  }

  public evaluate(ctx: DownloadContext): Verdict {
    const reasons: ReasonCode[] = [];
    let riskScore = 0;
    const timestamp = Date.now();
    const filename = ctx.filename.toLowerCase();
    const ext = filename.split('.').pop() || '';

    // 1. Browser danger signals integration
    if (ctx.dangerType && ctx.dangerType !== 'safe') {
      const weight = ctx.dangerType === 'dangerous_file' ? 95 : 60;
      riskScore += weight;
      reasons.push({
        code: `DOWNLOAD_BROWSER_DANGER_${ctx.dangerType.toUpperCase()}`,
        category: 'download',
        weight,
        message: `Browser flagged file download as ${ctx.dangerType}.`
      });
    }

    // 2. MIME type mismatch check (e.g. extension says .pdf but MIME is application/x-msdownload)
    if (['pdf', 'docx', 'xlsx', 'txt'].includes(ext) && DownloadGuard.EXECUTABLE_MIMES.has(ctx.mimeType)) {
      riskScore += 90;
      reasons.push({
        code: 'DOWNLOAD_MIME_MISMATCH',
        category: 'download',
        weight: 90,
        message: `Critical: File extension is .${ext}, but server sent binary executable MIME type (${ctx.mimeType}).`
      });
    }

    // 3. Advertised vs actual size evaluation (feature.md specification)
    if (ctx.advertisedSizeMb && ctx.observedSizeMb) {
      const sizeResult = this.evaluateSizeTolerance(ctx.advertisedSizeMb, ctx.observedSizeMb);
      if (sizeResult.riskPenalty > 0) {
        riskScore += sizeResult.riskPenalty;
        reasons.push({
          code: 'DOWNLOAD_SIZE_DISCREPANCY',
          category: 'download',
          weight: sizeResult.riskPenalty,
          message: sizeResult.message
        });
      }
    }

    // 4. Unsolicited / Drive-by download (not user initiated)
    if (!ctx.isUserInitiated) {
      riskScore += 50;
      reasons.push({
        code: 'DOWNLOAD_DRIVE_BY_ATTEMPT',
        category: 'download',
        weight: 50,
        message: 'Download was initiated automatically without direct user click interaction.'
      });
    }

    // 5. Executable downloaded from IP address directly rather than domain
    try {
      const urlObj = new URL(ctx.url);
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(urlObj.hostname) && ['exe', 'scr', 'bat', 'msi', 'iso'].includes(ext)) {
        riskScore += 70;
        reasons.push({
          code: 'DOWNLOAD_DIRECT_IP_EXECUTABLE',
          category: 'download',
          weight: 70,
          message: `Executable download hosted on raw IP address (${urlObj.hostname}) without valid domain reputation.`
        });
      }
    } catch {
      // URL parsing fallback
    }

    const cappedScore = Math.min(100, riskScore);
    const action = cappedScore >= 70 ? 'block' : cappedScore >= 40 ? 'warn' : 'allow';

    return {
      action,
      riskScore: cappedScore,
      confidence: reasons.length > 0 ? 'high' : 'low',
      reasons,
      timestamp,
      target: ctx.filename,
    };
  }
}
