import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('wBlock Custom Filter List Compatibility', () => {
  const root = path.resolve(__dirname, '..');
  const rulesPath = path.join(root, 'rules', 'byeads-wblock-filters.txt');
  const publicPath = path.join(root, 'public', 'byeads-wblock-filters.txt');

  it('byeads-wblock-filters.txt should exist and be identical in rules/ and public/', () => {
    expect(fs.existsSync(rulesPath)).toBe(true);
    expect(fs.existsSync(publicPath)).toBe(true);

    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    const publicContent = fs.readFileSync(publicPath, 'utf-8');
    expect(rulesContent).toBe(publicContent);
  });

  it('should have standard Adblock Plus header and compatibility notice', () => {
    const content = fs.readFileSync(rulesPath, 'utf-8');
    expect(content).toContain('[Adblock Plus 2.0]');
    expect(content).toContain('! Title: BYEADS Custom Filter List');
    expect(content).toContain('COMPATIBILITY NOTICE');
    expect(content).toContain('Unsupported in wBlock');
  });

  it('all network rules should follow valid declarative Content Blocker syntax', () => {
    const content = fs.readFileSync(rulesPath, 'utf-8');
    const lines = content.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('!') && !l.startsWith('['));

    expect(lines.length).toBeGreaterThanOrEqual(50);

    const networkRules = lines.filter((l) => l.startsWith('||'));
    const cosmeticRules = lines.filter((l) => l.startsWith('##'));

    expect(networkRules.length).toBeGreaterThanOrEqual(40);
    expect(cosmeticRules.length).toBeGreaterThanOrEqual(10);

    // Verify network rules format (e.g. ||doubleclick.net^ or ||youtube.com/api/stats/ads*)
    networkRules.forEach((rule) => {
      expect(rule).toMatch(/^\|\|[a-z0-9\-._/]+(\^|\*)$/i);
    });

    // Verify cosmetic rules format (e.g. ##.adsbygoogle or ##[class*="popup"])
    cosmeticRules.forEach((rule) => {
      expect(rule).toMatch(/^##[a-zA-Z0-9\-._:\[\]"=*^$#]+$/);
    });
  });

  it('must not contain procedural scriptlets (#%# or +js) which break Safari Content Blockers', () => {
    const content = fs.readFileSync(rulesPath, 'utf-8');
    expect(content).not.toContain('#%#');
    expect(content).not.toContain('+js(');
    expect(content).not.toContain('$scriptlet');
  });
});
