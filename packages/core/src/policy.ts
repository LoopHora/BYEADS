// ===== BYEADS CORE POLICY TYPES & VERDICTS =====
// Canonical implementation of BYEADS Decision Engine specification

export type DecisionAction = 'allow' | 'warn' | 'block';

export interface ReasonCode {
  code: string;
  category: 'dns' | 'web' | 'deception' | 'download' | 'redirect' | 'reputation';
  weight: number;
  message: string;
}

export interface Verdict {
  action: DecisionAction;
  riskScore: number; // 0 - 100
  confidence: 'low' | 'medium' | 'high';
  reasons: ReasonCode[];
  timestamp: number;
  target: string;
}

export interface PolicyConfig {
  blockThreshold: number; // default 70
  warnThreshold: number;  // default 40
  allowlistOverrides: boolean;
}

export const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  blockThreshold: 70,
  warnThreshold: 40,
  allowlistOverrides: true,
};
