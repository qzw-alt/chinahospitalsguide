const fs = require('fs');
const path = require('path');

const BASE = 'https://chinahospitalsguide.com';

// Top-level directories that are internal, dead, or otherwise non-indexable.
// Nothing under these belongs in the public sitemap. Checked at every level.
const SKIP_DIRS = new Set([
  // build artifacts / duplicate-content sources / assets
  'blog-articles', 'blog-export', 'docs', '06-Local-Ops',
  'references', 'course', '_', 'assets', 'reports', 'data',
  'images', 'scripts',
  // internal & planning docs that must never be indexed
  'planning', 'internal-research-notes', 'BLOG-PUBLISHING-SOP', 'templates', 'api',
  // dead/legacy: deleted from source (CTR cleanup); only stale HTML remains
  'news', 'treatments',
]);

// Files to skip by exact name (404, noindex/utility pages)
const SKIP_FILES_EXACT = new Set([
  '404.html',
  'panel.html',            // internal ops panel (robots noindex)
  'stories.html',          // meta-refresh redirect to /stories/
  'template-news-article.html',
  'course.html',           // deleted from source; stale HTML only
]);

// Files to skip by name substring (customer reports with variable suffixes)
const SKIP_FILES_PATTERN = [
  'report-carlos-mendoza',
];

function walk(dir, base = '') {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return results;
  }
  for (const e of entries) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    const rel = base + '/' + e.name;
    if (e.isDirectory()) {
      results.push(...walk(full, rel));
    } else if (e.name.endsWith('.html')) {
      results.push({ file: full, path: rel, mtime: fs.statSync(full).mtime });
    }
  }
  return results;
}

function hasNoindex(file) {
  try {
    const head = fs.readFileSync(file, 'utf8').slice(0, 3000);
    return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/.test(head)
        || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/.test(head);
  } catch (e) {
    return false;
  }
}

function getPriority(url) {
  if (url === '/' || url === '/index.html') return '1.0';
  if (url === '/hospitals.html') return '0.95';
  if (url === '/pricing.html' || url === '/contact-new.html') return '0.9';
  if (url === '/services.html' || url === '/contact.html' || url === '/how-it-works.html') return '0.85';
  if (url.startsWith('/blog/') && url !== '/blog/') return '0.7';
  if (url.startsWith('/news/') && url !== '/news/') return '0.6';

  if (url.startsWith('/stories/') && url !== '/stories/') return '0.5';
  return '0.8';
}

function getChangefreq(url) {
  if (url === '/' || url === '/index.html') return 'daily';
  if (url.startsWith('/news/')) return 'weekly';
  if (url.startsWith('/blog/')) return 'weekly';
  if (url === '/hospitals.html' || url === '/pricing.html') return 'weekly';
  return 'monthly';
}

function skipFile(filePath) {
  const basename = path.basename(filePath);
  if (SKIP_FILES_EXACT.has(basename)) return true;
  return SKIP_FILES_PATTERN.some(pattern => basename.includes(pattern));
}

// 1. Walk _site and normalize to public URLs
const rawPages = walk('_site');
const candidates = [];
for (const p of rawPages) {
  let url = p.path;
  if (url.endsWith('/index.html')) url = url.replace(/\/index\.html$/, '/');

  if (url === '/404.html') continue;
  if (skipFile(p.path)) continue;
  if (hasNoindex(p.file)) continue;
  // pagination pages live at /blog/<n>/ — thin duplicates, never index
  if (/^\/blog\/\d+\/$/.test(url)) continue;

  candidates.push({ url, lastmod: p.mtime.toISOString().slice(0, 10) });
}

// 2. Dedupe: when both foo.html and foo/ exist (old .html + new trailing-slash),
//    keep the trailing-slash version (canonical) and drop the .html.
const slashUrls = new Set(candidates.filter(c => c.url.endsWith('/')).map(c => c.url));
const urls = candidates.filter(c => {
  if (c.url.endsWith('.html')) {
    const slashEq = c.url.replace(/\.html$/, '/');
    if (slashUrls.has(slashEq)) return false;
  }
  return true;
}).sort((a, b) => a.url.localeCompare(b.url));

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const { url, lastmod } of urls) {
  xml += '  <url>\n';
  xml += `    <loc>${BASE}${url}</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${getChangefreq(url)}</changefreq>\n`;
  xml += `    <priority>${getPriority(url)}</priority>\n`;
  xml += '  </url>\n';
}

xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml);
fs.writeFileSync('_site/sitemap.xml', xml);

console.log(`Generated sitemap.xml with ${urls.length} URLs (${candidates.length} before dedupe)`);
