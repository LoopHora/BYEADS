// ===== BYEADS RISK DECISION ENGINE =====
// Multi-signal fusion, weight calculation, and explainable verdict synthesis

import { Verdict, ReasonCode, PolicyConfig, DEFAULT_POLICY_CONFIG } from './policy';

export interface ShieldSignal {
  shield: 'dns' | 'web' | 'deception' | 'download' | 'redirect';
  verdict: Verdict;
}

export class RiskDecisionEngine {
  private config: PolicyConfig;

  constructor(config: PolicyConfig = DEFAULT_POLICY_CONFIG) {
    this.config = config;
  }

  public fuse(signals: ShieldSignal[], targetUrlOrFile: string): Verdict {
    const timestamp = Date.now();
    const allReasons: ReasonCode[] = [];

    // Check if any shield had an explicit hard-block or allowlist override
    let hasHardBlock = false;
    let hasAllowOverride = false;
    let maxRisk = 0;
    let accumulatedScore = 0;

    for (const sig of signals) {
      for (const r of sig.verdict.reasons) {
        allReasons.push(r);
        if (r.code === 'DNS_ALLOWLIST_OVERRIDE') {
          hasAllowOverride = true;
        }
      }

      if (sig.verdict.action === 'block' && sig.verdict.riskScore >= 90) {
        hasHardBlock = true;
      }

      maxRisk = Math.max(maxRisk, sig.verdict.riskScore);
      accumulatedScore += sig.verdict.riskScore * 0.4;
    }

    if (this.config.allowlistOverrides && hasAllowOverride) {
      return {
        action: 'allow',
        riskScore: 0,
        confidence: 'high',
        reasons: allReasons.filter(r => r.code === 'DNS_ALLOWLIST_OVERRIDE'),
        timestamp,
        target: targetUrlOrFile,
      };
    }

    // Weighted fusion: primary weight to strongest single signal + auxiliary weight to correlated signals
    let finalRisk = Math.min(100, Math.round(maxRisk * 0.75 + accumulatedScore * 0.25));

    if (hasHardBlock) {
      finalRisk = Math.max(finalRisk, 90);
    }

    let action: 'allow' | 'warn' | 'block' = 'allow';
    if (finalRisk >= this.config.blockThreshold) {
      action = 'block';
    } else if (finalRisk >= this.config.warnThreshold) {
      action = 'warn';
    }

    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (signals.length >= 2 || finalRisk >= 80) {
      confidence = 'high';
    } else if (signals.length === 1 && finalRisk >= 40) {
      confidence = 'medium';
    }

    return {
      action,
      riskScore: finalRisk,
      confidence,
      reasons: allReasons,
      timestamp,
      target: targetUrlOrFile,
    };
  }
}
