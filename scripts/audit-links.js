// Audit every internal link in the built site. Runs last in `npm run build` so a
// broken link fails the deploy instead of shipping silently.
//
// Two things this catches that a click-through never will:
//   - links that only resolve because the dev machine is Windows. CI builds on Linux
//     and GitHub Pages serves case-sensitively, so a target whose capitalisation is
//     off works locally and 404s in production. Targets are matched by exact case here.
//   - links that break for every page in a class at once (a template emitting pages
//     into a subdirectory, or a generator copying markup without rebasing its paths).
//
// Only internal targets are checked. External URLs are deliberately out of scope:
// network calls would slow the build and fail it on transient outages.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '_site');
const ORIGIN = 'http://site.invalid';
const MAX_TARGETS_SHOWN = 40;

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

// Resolve a site-absolute path against the real directory listing so that a
// case mismatch is treated as missing, exactly as GitHub Pages would.
function exactPath(sitePath) {
  let current = ROOT;
  const parts = decodeURIComponent(sitePath).split('/').filter(Boolean);
  for (const part of parts) {
    let entries;
    try {
      entries = fs.readdirSync(current);
    } catch (err) {
      return null;
    }
    if (!entries.includes(part)) return null;
    current = path.join(current, part);
  }
  return current;
}

function targetExists(sitePath) {
  const asDir = sitePath.endsWith('/');
  const p = exactPath(asDir ? sitePath + 'index.html' : sitePath);
  if (!p) return false;
  let stat;
  try {
    stat = fs.statSync(p);
  } catch (err) {
    return false;
  }
  if (stat.isFile()) return true;
  if (stat.isDirectory()) {
    const index = exactPath((asDir ? sitePath : sitePath + '/') + 'index.html');
    return index ? fs.statSync(index).isFile() : false;
  }
  return false;
}

function isInternal(url) {
  if (!url) return false;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return false; // scheme, protocol-relative, fragment
  if (/['"+]/.test(url)) return false; // JS string concatenation, not a literal link
  return true;
}

if (!fs.existsSync(ROOT)) {
  console.error('audit-links: ' + ROOT + ' not found — run the build first.');
  process.exit(1);
}

const files = walk(ROOT, []);
const dead = new Map();
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const pagePath = '/' + path.relative(ROOT, file).split(path.sep).join('/');
  const page = path.relative(ROOT, file).split(path.sep).join('/');

  for (const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const raw = m[1].trim();
    if (!isInternal(raw)) continue;

    let sitePath;
    try {
      sitePath = new URL(raw.split('#')[0].split('?')[0], ORIGIN + pagePath).pathname;
    } catch (err) {
      continue;
    }
    if (!sitePath || sitePath === pagePath) continue;

    checked++;
    if (targetExists(sitePath)) continue;

    if (!dead.has(sitePath)) dead.set(sitePath, []);
    dead.get(sitePath).push(page);
  }
}

if (dead.size === 0) {
  console.log('audit-links: ' + checked + ' internal links across ' + files.length + ' pages, 0 dead.');
  process.exit(0);
}

console.error('');
console.error('audit-links: ' + dead.size + ' dead target(s) across ' + files.length + ' pages.');
console.error('');

const sorted = Array.from(dead.entries()).sort(function (a, b) {
  return b[1].length - a[1].length;
});
sorted.slice(0, MAX_TARGETS_SHOWN).forEach(function (entry) {
  const sources = Array.from(new Set(entry[1]));
  console.error('  ' + entry[1].length + 'x  ' + entry[0]);
  sources.slice(0, 3).forEach(function (s) {
    console.error('        from ' + s);
  });
  if (sources.length > 3) console.error('        ...and ' + (sources.length - 3) + ' more page(s)');
});
if (sorted.length > MAX_TARGETS_SHOWN) {
  console.error('  ...and ' + (sorted.length - MAX_TARGETS_SHOWN) + ' more dead target(s)');
}
console.error('');
console.error('Fix the links or the generator that emits them, then rebuild.');
process.exit(1);
