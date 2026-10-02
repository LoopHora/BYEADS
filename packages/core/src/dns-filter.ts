// ===== BYEADS DNS SHIELD FILTER ENGINE =====
// Fast indexed domain matching with wildcard and sub-domain support

import { ReasonCode, Verdict, DEFAULT_POLICY_CONFIG, PolicyConfig } from './policy';

export interface DnsRule {
  domain: string;
  action: 'block' | 'allow';
  reasonCode: string;
  category: 'ad' | 'tracker' | 'malware' | 'phishing' | 'scam';
}

export class DnsFilterEngine {
  private blocklist: Map<string, DnsRule> = new Map();
  private allowlist: Set<string> = new Set();
  private wildcardBlocklist: string[] = [];
  private config: PolicyConfig;

  constructor(config: PolicyConfig = DEFAULT_POLICY_CONFIG) {
    this.config = config;
  }

  public addRule(rule: DnsRule): void {
    const normalized = this.normalizeDomain(rule.domain);
    if (rule.action === 'allow') {
      this.allowlist.add(normalized);
      return;
    }

    if (normalized.startsWith('*.')) {
      this.wildcardBlocklist.push(normalized.slice(2));
    } else {
      this.blocklist.set(normalized, rule);
    }
  }

  public addAllowlist(domain: string): void {
    this.allowlist.add(this.normalizeDomain(domain));
  }

  public isAllowlisted(domain: string): boolean {
    const norm = this.normalizeDomain(domain);
    if (this.allowlist.has(norm)) return true;

    // Check parent domains in allowlist
    const parts = norm.split('.');
    for (let i = 1; i < parts.length - 1; i++) {
      const parent = parts.slice(i).join('.');
      if (this.allowlist.has(parent)) return true;
    }
    return false;
  }

  public evaluate(domain: string): Verdict {
    const normalized = this.normalizeDomain(domain);
    const timestamp = Date.now();

    // 1. Check Allowlist override
    if (this.config.allowlistOverrides && this.isAllowlisted(normalized)) {
      return {
        action: 'allow',
        riskScore: 0,
        confidence: 'high',
        reasons: [{
          code: 'DNS_ALLOWLIST_OVERRIDE',
          category: 'dns',
          weight: 0,
          message: `Domain ${normalized} is explicitly allowed by user policy.`
        }],
        timestamp,
        target: normalized,
      };
    }

    const reasons: ReasonCode[] = [];
    let riskScore = 0;

    // 2. Exact match check
    if (this.blocklist.has(normalized)) {
      const rule = this.blocklist.get(normalized)!;
      riskScore = rule.category === 'malware' || rule.category === 'phishing' ? 95 : 85;
      reasons.push({
        code: `DNS_BLOCK_${rule.category.toUpperCase()}`,
        category: 'dns',
        weight: riskScore,
        message: `Exact match for known ${rule.category} domain (${rule.domain}).`
      });
    } else {
      // 3. Subdomain / Wildcard check
      const parts = normalized.split('.');
      for (let i = 1; i < parts.length - 1; i++) {
        const parent = parts.slice(i).join('.');
        if (this.blocklist.has(parent)) {
          const rule = this.blocklist.get(parent)!;
          riskScore = 80;
          reasons.push({
            code: 'DNS_PARENT_DOMAIN_BLOCKED',
            category: 'dns',
            weight: 80,
            message: `Parent domain ${parent} is blocked (${rule.category}).`
          });
          break;
        }

        if (this.wildcardBlocklist.includes(parent)) {
          riskScore = 85;
          reasons.push({
            code: 'DNS_WILDCARD_MATCH',
            category: 'dns',
            weight: 85,
            message: `Matched wildcard rule *.${parent}.`
          });
          break;
        }
      }
    }

    let action: 'allow' | 'warn' | 'block' = 'allow';
    if (riskScore >= this.config.blockThreshold) {
      action = 'block';
    } else if (riskScore >= this.config.warnThreshold) {
      action = 'warn';
    }

    return {
      action,
      riskScore,
      confidence: reasons.length > 0 ? 'high' : 'low',
      reasons,
      timestamp,
      target: normalized,
    };
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase().replace(/\.$/, '');
  }
}
