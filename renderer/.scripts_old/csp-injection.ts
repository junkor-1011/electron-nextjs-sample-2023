import path from 'node:path';
import url from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CSP_CONTENT = "default-src 'self'";

function main() {
  const targetPath = path.join(__dirname, '../dist/index.html')
  const rawHtml = readFileSync(targetPath, 'utf-8')
  const dom = new JSDOM(rawHtml)

  // rewrite csp
  const csp = dom.window.document.getElementById('_csp')
  csp?.setAttribute('content', CSP_CONTENT)

  const newHtml = dom.serialize()
  writeFileSync(targetPath, newHtml)
}

main()
