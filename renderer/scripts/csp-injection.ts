import path from 'node:path';
// import url from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';

// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

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
  const targets = findHtml()
  for (const target of targets) {
    injectCsp(target);
  }
  // const targetPath = path.join(__dirname, '../out/index.html')
  // const rawHtml = readFileSync(targetPath, 'utf-8')
  // const dom = new JSDOM(rawHtml)
  // 
  // // rewrite csp
  // const csp = dom.window.document.getElementById('_csp')
  // csp?.setAttribute('content', CSP_CONTENT)
  // 
  // const newHtml = dom.serialize()
  // writeFileSync(targetPath, newHtml)
}

main()
