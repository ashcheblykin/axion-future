/* Screenshot the page with Playwright (borrowed from ../lens-vision/node_modules) and print
   console errors. For the agents that verify the build against docs/figma/*.png.
   Usage: node tools/shot.mjs <url> <out.png> [--w 1920] [--h 1080] [--wait 1500]
                                            [--click "css"]... [--type "css=text"] [--key Escape]
                                            [--eval "js"] [--full]                                   */
import { createRequire } from 'node:module';
const require = createRequire('/Users/alexander/Documents/DEV/lens-vision/node_modules/');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const url = args.shift(), out = args.shift();
const opt = { w: 1920, h: 1080, wait: 1500, steps: [], full: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--w') opt.w = +args[++i]; else if (a === '--h') opt.h = +args[++i]; else if (a === '--wait') opt.wait = +args[++i];
  else if (a === '--click') opt.steps.push(['click', args[++i]]); else if (a === '--type') opt.steps.push(['type', args[++i]]);
  else if (a === '--key') opt.steps.push(['key', args[++i]]); else if (a === '--eval') opt.steps.push(['eval', args[++i]]);
  else if (a === '--hover') opt.steps.push(['hover', args[++i]]); else if (a === '--sleep') opt.steps.push(['sleep', +args[++i]]);
  else if (a === '--full') opt.full = true;
}
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: opt.w, height: opt.h }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
page.on('response', r => { if (r.status() >= 400) errors.push(`[${r.status()}] ${r.url()}`); });
page.on('requestfailed', r => errors.push(`[failed] ${r.url()} ${r.failure()?.errorText || ''}`));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(opt.wait);
for (const [k, v] of opt.steps) {
  try {
    if (k === 'click') await page.click(v, { timeout: 4000 });
    else if (k === 'hover') await page.hover(v, { timeout: 4000 });
    else if (k === 'type') { const [sel, text] = v.split('='); await page.fill(sel, text); }
    else if (k === 'key') await page.keyboard.press(v);
    else if (k === 'eval') console.log('eval →', JSON.stringify(await page.evaluate(v)));
    else if (k === 'sleep') await page.waitForTimeout(v);
    await page.waitForTimeout(350);
  } catch (e) { errors.push(`[step ${k} ${v}] ${e.message.split('\n')[0]}`); }
}
await page.screenshot({ path: out, fullPage: opt.full });
console.log('shot →', out);
if (errors.length) { console.log('console:'); for (const e of errors) console.log('  ' + e); } else console.log('console: clean');
await browser.close();
