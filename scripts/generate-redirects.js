/**
 * generate-redirects.js
 *
 * GitHub Pages does NOT support Netlify's `_redirects` syntax. To preserve the
 * 301 redirects we declared in `_redirects`, this script materializes each rule
 * as a tiny HTML file with a meta-refresh + canonical link. Google treats a
 * 0-second meta refresh plus a canonical pointing at the target as a permanent
 * (301-style) redirect.
 *
 * Rules are read from the root `_redirects` file (Netlify syntax), but the
 * generated files are plain HTML so they work on GitHub Pages.
 *
 * Files that already exist in _site (pages produced by Eleventy, e.g. the
 * homepage index.html) are never overwritten.
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://chinahospitalsguide.com';
const REDIRECTS_FILE = path.join(__dirname, '..', '_redirects');
const OUTPUT_DIR = path.join(__dirname, '..', '_site');

function parseRules(content) {
  const rules = [];
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    rules.push({ source: parts[0], dest: parts[1] });
  }
  return rules;
}

// Map a source path to an output file under _site.
//   /foo/bar.html          -> _site/foo/bar.html
//   /foo/bar/              -> _site/foo/bar/index.html
//   /foo/bar (no extension) -> _site/foo/bar/index.html (pretty URL)
//   /                      -> null (can't materialize root)
function resolveOutputPath(source) {
  let s = source.startsWith('/') ? source.slice(1) : source;
  if (s === '') return null;
  if (s.endsWith('/')) return path.join(OUTPUT_DIR, s, 'index.html');
  if (path.extname(s) !== '') return path.join(OUTPUT_DIR, s);
  return path.join(OUTPUT_DIR, s, 'index.html');
}

function buildHtml(dest) {
  const canonical = /^https?:\/\//.test(dest)
    ? dest
    : BASE + (dest.startsWith('/') ? dest : '/' + dest);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=${dest}">
<link rel="canonical" href="${canonical}">
<title>Redirecting…</title>
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved to <a href="${dest}">${dest}</a>.</p>
<script>location.replace(${JSON.stringify(dest)});</script>
</body>
</html>
`;
}

function main() {
  const content = fs.readFileSync(REDIRECTS_FILE, 'utf8');
  const rules = parseRules(content);
  let generated = 0;
  let skipped = 0;
  const skippedSources = [];

  for (const r of rules) {
    const out = resolveOutputPath(r.source);
    if (!out) {
      skipped++;
      skippedSources.push(r.source);
      continue;
    }
    // Never overwrite a page Eleventy already produced.
    if (fs.existsSync(out)) {
      skipped++;
      skippedSources.push(r.source);
      continue;
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buildHtml(r.dest));
    generated++;
  }

  console.log(`generate-redirects: ${generated} files written, ${skipped} skipped`);
  if (skippedSources.length) {
    console.log(`  skipped (already exist / root): ${skippedSources.join(', ')}`);
  }
}

main();
