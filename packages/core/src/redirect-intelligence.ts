// ===== BYEADS REDIRECT INTELLIGENCE =====
// Multi-hop navigation chain inspection, loop detection, and hijacking analysis

import { ReasonCode, Verdict } from './policy';

export interface RedirectHop {
  url: string;
  statusCode?: number;
  delayMs?: number;
}

export interface NavigationChain {
  originUrl: string;
  finalUrl: string;
  hops: RedirectHop[];
}

export class RedirectIntelligence {
  private static MAX_NORMAL_HOPS = 4;

  public evaluate(chain: NavigationChain): Verdict {
    const reasons: ReasonCode[] = [];
    let riskScore = 0;
    const timestamp = Date.now();
    const hopCount = chain.hops.length;

    // 1. Redirect Loop detection
    const visitedUrls = new Set<string>();
    let hasLoop = false;
    for (const hop of chain.hops) {
      const cleanUrl = hop.url.split('#')[0];
      if (visitedUrls.has(cleanUrl)) {
        hasLoop = true;
        break;
      }
      visitedUrls.add(cleanUrl);
    }

    if (hasLoop) {
      riskScore += 80;
      reasons.push({
        code: 'REDIRECT_CIRCULAR_LOOP',
        category: 'redirect',
        weight: 80,
        message: 'Circular redirect loop detected in navigation chain.'
      });
    }

    // 2. Excessive redirect chain length (common in ad arbitrage and exploit kits)
    if (hopCount > RedirectIntelligence.MAX_NORMAL_HOPS) {
      const excess = hopCount - RedirectIntelligence.MAX_NORMAL_HOPS;
      const weight = Math.min(65, 40 + (excess - 1) * 10);
      riskScore += weight;
      reasons.push({
        code: 'REDIRECT_EXCESSIVE_CHAIN',
        category: 'redirect',
        weight,
        message: `Suspiciously long navigation chain (${hopCount} hops) often indicates malvertising or affiliate hijacking.`
      });
    }

    // 3. Domain hopping through known ad tracker / click-redirector domains
    const domainsInChain: string[] = [];
    for (const hop of chain.hops) {
      try {
        const domain = new URL(hop.url).hostname.replace(/^www\./, '');
        domainsInChain.push(domain);
      } catch {}
    }

    const uniqueDomains = new Set(domainsInChain);
    if (uniqueDomains.size >= 4) {
      riskScore += 45;
      reasons.push({
        code: 'REDIRECT_CROSS_DOMAIN_ARBITRAGE',
        category: 'redirect',
        weight: 45,
        message: `Chain passed through ${uniqueDomains.size} completely different top-level domains.`
      });
    }

    const cappedScore = Math.min(100, riskScore);
    const action = cappedScore >= 70 ? 'block' : cappedScore >= 40 ? 'warn' : 'allow';

    return {
      action,
      riskScore: cappedScore,
      confidence: reasons.length > 0 ? 'medium' : 'low',
      reasons,
      timestamp,
      target: chain.finalUrl,
    };
  }
}
