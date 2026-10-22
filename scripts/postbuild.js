import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const edicaoEspecialDir = path.join(distDir, 'edicao-especial');
fs.mkdirSync(edicaoEspecialDir, { recursive: true });

const srcHtml = path.join(distDir, 'index.html');
const dstHtml = path.join(edicaoEspecialDir, 'index.html');

if (fs.existsSync(srcHtml)) {
  fs.copyFileSync(srcHtml, dstHtml);
  console.log('[postbuild] Successfully duplicated dist/index.html to dist/edicao-especial/index.html');
} else {
  console.error('[postbuild] Warning: dist/index.html not found!');
}
