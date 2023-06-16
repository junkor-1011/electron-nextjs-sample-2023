import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import tsconfig from '../tsconfig.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

esbuild.build({
  target: tsconfig.compilerOptions.target,
  logLevel: 'info',
  entryPoints: [
    path.join(__dirname, '../index.ts'),
    path.join(__dirname, '../preload.ts'),
  ],
  outbase: path.join(__dirname, '..'),
  outdir: path.join(__dirname, '../../main'),
  bundle: true,
  minify: true,
  // sourcemap: true,
  platform: 'node',
  external: ['electron'],
  tsconfig: path.join(__dirname, '../tsconfig.json'),
});

console.log('Done.');
