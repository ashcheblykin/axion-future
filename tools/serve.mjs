/* A static file server, and nothing else. The prototype has no build step and
   makes no network calls, so this only has to hand back files.
   Usage: node tools/serve.mjs [port]                                          */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 5312;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  /* normalize() first, so a request cannot climb out of the repository */
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  try {
    const s = await stat(file);
    if (s.isDirectory()) throw new Error('directory');
    /* `no-cache` on everything meant the 1.4 MB backdrop and the 900 KB of
       footage came down again on every reload of every screen. A validator
       costs one conditional request and sends nothing when the file has not
       changed, which is what a prototype with a committed dataset wants:
       still never stale, and a reload that transfers the HTML and little
       else. Weak, because the body is not transformed and mtime+size is a
       true statement about this file rather than a hash of it. */
    const tag = `W/"${s.size.toString(16)}-${s.mtimeMs.toString(16)}"`;
    const since = Date.parse(req.headers['if-modified-since'] || '');
    if (req.headers['if-none-match'] === tag ||
        (!req.headers['if-none-match'] && since && s.mtimeMs <= since + 999)) {
      res.writeHead(304, { etag: tag, 'cache-control': 'no-cache' }).end();
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      /* revalidate every time, and send bytes only when they really changed */
      'cache-control': 'no-cache',
      etag: tag,
      'last-modified': new Date(s.mtimeMs).toUTCString(),
    }).end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found: ' + rel);
  }
}).listen(PORT, () => console.log('lens-vision on http://localhost:' + PORT));
