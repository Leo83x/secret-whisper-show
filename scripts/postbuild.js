import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const srcHtml = path.join(distDir, 'index.html');

if (fs.existsSync(srcHtml)) {
  const targets = ['edicao-especial', 'investigacao', 'terminal'];
  for (const t of targets) {
    const tDir = path.join(distDir, t);
    fs.mkdirSync(tDir, { recursive: true });
    fs.copyFileSync(srcHtml, path.join(tDir, 'index.html'));
    console.log('[postbuild] Successfully duplicated dist/index.html to dist/' + t + '/index.html');
  }
} else {
  console.error('[postbuild] Warning: dist/index.html not found!');
}
