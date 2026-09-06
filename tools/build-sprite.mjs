/* Builds assets/icons/sprite.svg from the Phosphor glyphs in assets/icons/ plus a few
   custom symbols. Every symbol is `#i-<file name>`, viewBox 0 0 256 256, fill currentColor,
   used as <svg class="ic"><use href="assets/icons/sprite.svg#i-plus"/></svg>.
   Usage: node tools/build-sprite.mjs                                                */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DIR = join(ROOT, 'assets', 'icons');

const custom = {
  /* the rail's first stop — the agent. A ring with one bright oval inside, as drawn in the frame */
  axi: `<circle cx="128" cy="128" r="114" fill="none" stroke="currentColor" stroke-width="18"/>
        <ellipse cx="162" cy="118" rx="29" ry="56" transform="rotate(32 162 118)"/>`,
  /* the sidebar's Library glyph — two plain books, the right one leaning, no spine lines (the
     design file's own Books, not Phosphor's) */
  'books-plain': `<rect x="50" y="22" width="64" height="192" rx="14" fill="none" stroke="currentColor" stroke-width="16"/>
        <rect x="142" y="22" width="60" height="192" rx="14" fill="none" stroke="currentColor" stroke-width="16" transform="rotate(-8 172 118)"/>`,
  /* the glyph beside "Ask Axsi" in the Library header — a ring with a quarter filled */
  'circle-quarter': `<circle cx="128" cy="128" r="100" fill="none" stroke="currentColor" stroke-width="16"/>
        <path d="M128 128 L128 40 A88 88 0 0 1 216 128 Z"/>`,
  /* a tiny filled dot, for the signal colours where Phosphor's ring is too faint */
  dot: `<circle cx="128" cy="128" r="40"/>`,
};

const files = (await readdir(DIR)).filter(f => f.endsWith('.svg') && f !== 'sprite.svg').sort();
let out = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="position:absolute">\n';
for (const f of files) {
  const svg = await readFile(join(DIR, f), 'utf8');
  const vb = /viewBox="([^"]+)"/.exec(svg)?.[1] || '0 0 256 256';
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  out += `<symbol id="i-${basename(f, '.svg')}" viewBox="${vb}">${inner}</symbol>\n`;
}
for (const [name, body] of Object.entries(custom)) {
  out += `<symbol id="i-${name}" viewBox="0 0 256 256">${body}</symbol>\n`;
}
out += '</svg>\n';
await writeFile(join(DIR, 'sprite.svg'), out);
console.log(`sprite: ${files.length + Object.keys(custom).length} symbols`);
