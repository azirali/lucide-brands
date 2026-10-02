// Renders .github/preview-{light,dark}.svg (the icon grid shown in the README) from svg/*.svg.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = (await readdir(join(root, 'svg'))).filter((f) => f.endsWith('.svg')).sort();
const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const COLS = 6;
const CELL_W = 136;
const CELL_H = 104;
const PAD = 24;
const rows = Math.ceil(files.length / COLS);
const width = COLS * CELL_W + PAD * 2;
const height = rows * CELL_H + PAD * 2;

const themes = {
  light: { bg: '#ffffff', border: '#d0d7de', icon: '#1f2328', label: '#59636e' },
  dark: { bg: '#0d1117', border: '#30363d', icon: '#f0f6fc', label: '#9198a1' },
};

await mkdir(join(root, '.github'), { recursive: true });
for (const [theme, c] of Object.entries(themes)) {
  const cells = await Promise.all(
    files.map(async (file, i) => {
      const svg = await readFile(join(root, 'svg', file), 'utf8');
      const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
      const x = PAD + (i % COLS) * CELL_W;
      const y = PAD + Math.floor(i / COLS) * CELL_H;
      return `  <g transform="translate(${x + CELL_W / 2 - 16} ${y + 18}) scale(1.3333)" fill="none" stroke="${c.icon}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
  <text x="${x + CELL_W / 2}" y="${y + 82}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13" fill="${c.label}">${pascal(file.replace('.svg', ''))}</text>`;
    }),
  );
  await writeFile(
    join(root, `.github/preview-${theme}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
${cells.join('\n')}
</svg>
`,
  );
}
console.log(`Rendered preview for ${files.length} icons.`);
