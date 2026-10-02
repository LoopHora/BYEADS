// ===== BYEADS DECEPTION ENGINE =====
// Detects deceptive downloads, fake buttons, and filename spoofing

import { ReasonCode, Verdict } from './policy';

export interface DownloadIntent {
  claimedName?: string;
  claimedType?: string;
  claimedSizeMb?: number;
  actualFilename: string;
  actualSizeMb?: number;
  sourceUrl: string;
  destinationUrl: string;
  buttonText?: string;
}

export class DeceptionEngine {
  private static DANGEROUS_EXTENSIONS = new Set([
    'exe', 'scr', 'bat', 'cmd', 'ps1', 'vbs', 'js', 'jse', 'wsf', 'msi', 'iso', 'dll'
  ]);

  private static DOCUMENT_EXTENSIONS = new Set([
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'mp4', 'mp3', 'jpg', 'png'
  ]);

  public analyze(intent: DownloadIntent): Verdict {
    const reasons: ReasonCode[] = [];
    let riskScore = 0;
    const filename = intent.actualFilename.trim();
    const timestamp = Date.now();

    // 1. Double extension detection (e.g. invoice.pdf.exe or file.mp4.scr)
    const parts = filename.split('.');
    if (parts.length >= 3) {
      const realExt = parts[parts.length - 1].toLowerCase();
      const fakeExt = parts[parts.length - 2].toLowerCase();

      if (DeceptionEngine.DANGEROUS_EXTENSIONS.has(realExt) && DeceptionEngine.DOCUMENT_EXTENSIONS.has(fakeExt)) {
        riskScore += 90;
        reasons.push({
          code: 'DECEPTION_DOUBLE_EXTENSION',
          category: 'deception',
          weight: 90,
          message: `Critical: Double extension detected ("${fakeExt}.${realExt}"). Masquerading as a harmless ${fakeExt.toUpperCase()} file.`
        });
      }
    }

    // 2. Whitespace padding evasion (e.g. setup       .exe)
    if (/\s{4,}\.[a-zA-Z0-9]+$/.test(filename)) {
      riskScore += 75;
      reasons.push({
        code: 'DECEPTION_WHITESPACE_PADDING',
        category: 'deception',
        weight: 75,
        message: 'Filename uses long whitespace padding to conceal executable extension.'
      });
    }

    // 3. Fake button text vs destination domain mismatch
    if (intent.buttonText) {
      const lowerBtn = intent.buttonText.toLowerCase();
      const isOfficialButtonClaim = lowerBtn.includes('download') || lowerBtn.includes('get installer');
      if (isOfficialButtonClaim) {
        try {
          const srcDomain = new URL(intent.sourceUrl).hostname.replace(/^www\./, '');
          const destDomain = new URL(intent.destinationUrl).hostname.replace(/^www\./, '');
          if (srcDomain && destDomain && srcDomain !== destDomain && !destDomain.endsWith(`.${srcDomain}`)) {
            riskScore += 45;
            reasons.push({
              code: 'DECEPTION_DESTINATION_MISMATCH',
              category: 'deception',
              weight: 45,
              message: `Button on ${srcDomain} redirects download to completely unrelated domain ${destDomain}.`
            });
          }
        } catch {
          // ignore url parse failure
        }
      }
    }

    // 4. File size contradiction (e.g. claims 500MB movie but downloads a 200KB exe)
    if (intent.claimedSizeMb && intent.actualSizeMb) {
      if (intent.claimedSizeMb > 50 && intent.actualSizeMb < 2) {
        riskScore += 65;
        reasons.push({
          code: 'DECEPTION_SIZE_MISMATCH',
          category: 'deception',
          weight: 65,
          message: `Suspicious size mismatch: claimed ~${intent.claimedSizeMb}MB, actual payload is only ${intent.actualSizeMb}MB.`
        });
      }
    }

    const cappedScore = Math.min(100, riskScore);
    const action = cappedScore >= 70 ? 'block' : cappedScore >= 40 ? 'warn' : 'allow';

    return {
      action,
      riskScore: cappedScore,
      confidence: reasons.length > 0 ? 'high' : 'low',
      reasons,
      timestamp,
      target: filename,
    };
  }
}
