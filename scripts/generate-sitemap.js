const fs = require('fs');
const path = require('path');

const BASE = 'https://chinahospitalsguide.com';
const TODAY = new Date().toISOString().slice(0, 10);

function walk(dir, base = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    const rel = base + '/' + e.name;
    if (e.isDirectory()) {
      results.push(...walk(full, rel));
    } else if (e.name.endsWith('.html')) {
      results.push(rel);
    }
  }
  return results;
}

function getPriority(url) {
  if (url === '/' || url === '/index.html') return '1.0';
  if (url === '/hospitals.html') return '0.95';
  if (url === '/pricing.html' || url === '/contact-new.html') return '0.9';
  if (url === '/services.html' || url === '/contact.html' || url === '/how-it-works.html') return '0.85';
  if (url.startsWith('/blog/') && url !== '/blog/') return '0.7';
  if (url.startsWith('/news/') && url !== '/news/') return '0.6';
  if (url.startsWith('/treatments/')) return '0.75';
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

// Collect all HTML pages
const pages = walk('_site')
  .filter(p => p !== '/404.html' && !p.includes('/references/') && p !== '/news/template-news-article.html');

// Normalize URLs
const urls = pages.map(p => {
  let url = p;
  if (url.endsWith('/index.html')) url = url.replace(/\/index\.html$/, '/');
  return url;
}).sort();

// Generate sitemap
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const url of urls) {
  xml += '  <url>\n';
  xml += `    <loc>${BASE}${url}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>${getChangefreq(url)}</changefreq>\n`;
  xml += `    <priority>${getPriority(url)}</priority>\n`;
  xml += '  </url>\n';
}

xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml);
fs.writeFileSync('_site/sitemap.xml', xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs (lastmod: ${TODAY})`);
