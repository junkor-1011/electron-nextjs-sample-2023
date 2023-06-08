import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';

const CSP_CONTENT = "default-src 'self' 'unsafe-inline';";

function findHtml(): readonly string[] {
  const targetDir = path.join(__dirname, '../out');
  const targetPattern = path.join(targetDir, '/**/*.html');

  const result = globSync(targetPattern)
  return result
}

/**
 * @param target - path of html file.
 */
function injectCsp(target: string): void {
  const rawHtml = readFileSync(target, 'utf-8');
  const dom = new JSDOM(rawHtml);

  const head = dom.window.document.querySelector('head');

  const csp = dom.window.document.createElement('meta');
  csp.setAttribute('http-equiv', 'content-security-policy');
  csp.setAttribute('content', CSP_CONTENT);

  head?.appendChild(csp)

  const newHtml = dom.serialize();
  writeFileSync(target, newHtml);
}

function main() {
  console.warn('DEPRECATED.');

  const targets = findHtml()
  for (const target of targets) {
    injectCsp(target);
  }
}

main()
