import path from 'node:path';
import esbuild from 'esbuild';

esbuild.build({
  logLevel: 'info',
  entryPoints: [
    path.join(__dirname, '../index.ts'),
    path.join(__dirname, '../preload.ts'),
  ],
  outbase: path.join(__dirname, '..'),
  outdir: path.join(__dirname, '../../main'),
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  external: ['electron'],
  tsconfig: path.join(__dirname, '../tsconfig.json'),
});

console.log('Done.');
