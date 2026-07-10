const fs = require('fs');

const pages = [
  'index.html', 'pricing.html', 'about.html', 'services.html',
  'how-it-works.html', 'hospitals.html', 'contact.html', 'contact-new.html'
];

function esc(s) { return s.replace(/"/g, '\\"'); }

for (const fname of pages) {
  const html = fs.readFileSync(fname, 'utf8');

  const titleM = html.match(/<title>(.+?)<\/title>/);
  const title = titleM ? titleM[1] : 'Untitled';
  const descM = html.match(/<meta name="description" content="(.+?)"/);
  const description = descM ? descM[1] : '';
  const canonM = html.match(/<link rel="canonical" href="(.+?)"/);
  const canonical = canonM ? canonM[1] : '';

  // Extract page-specific <style> block
  const styleM = html.match(/<style>([\s\S]*?)<\/style>/);
  const pageStyle = styleM ? styleM[1].trim() : '';

  const ogTitleM = html.match(/<meta property="og:title" content="(.+?)"/);
  const ogTitle = ogTitleM ? ogTitleM[1] : '';
  const ogDescM = html.match(/<meta property="og:description" content="(.+?)"/);
  const ogDescription = ogDescM ? ogDescM[1] : '';

  // Hreflang links
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang=.+?>/g)];
  const hreflangStr = hreflangs.map(m => m[0]).join('\n');

  // Schema JSON-LD blocks
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  // Extract body: between <body> and <footer
  const bodyM = html.match(/<body[^>]*>([\s\S]*?)<footer class="site-footer"/);
  let body = bodyM ? bodyM[1] : '';
  if (body) {
    // Remove nav block
    body = body.replace(/<div class="nav-overlay"[\s\S]*?<\/nav>/m, '');
    // Remove exit popup
    body = body.replace(/<div id="exitPopup">[\s\S]*?exitPopupShown[\s\S]*?<\/script>/m, '');
    // Remove floating buttons
    body = body.replace(/<div class="floating-buttons">[\s\S]*?<\/div>/m, '');
    // Remove mobile bottom bar
    body = body.replace(/<div class="mobile-bottom-bar">[\s\S]*?<\/div>/m, '');
    // Remove inline nav toggle scripts
    body = body.replace(/<script>[\s\S]*?navToggle[\s\S]*?<\/script>/m, '');
    body = body.trim();
  }

  // Build frontmatter
  const fmLines = ['---'];
  fmLines.push('layout: base.njk');
  fmLines.push(`title: "${esc(title)}"`);
  if (description) fmLines.push(`description: "${esc(description)}"`);
  if (canonical) fmLines.push(`canonical: "${canonical}"`);
  if (ogTitle && ogTitle !== title) fmLines.push(`ogTitle: "${esc(ogTitle)}"`);
  if (ogDescription && ogDescription !== description) fmLines.push(`ogDescription: "${esc(ogDescription)}"`);

  if (pageStyle) {
    fmLines.push('pageStyle: |');
    for (const line of pageStyle.split('\n')) fmLines.push(`  ${line}`);
  }

  if (hreflangStr) fmLines.push(`extraHead: "${esc(hreflangStr)}"`);

  if (schemas.length > 0) {
    fmLines.push('schema: |');
    for (const s of schemas) {
      for (const line of s[1].trim().split('\n')) fmLines.push(`  ${line}`);
    }
  }

  fmLines.push('---');
  const output = fmLines.join('\n') + '\n' + body + '\n';

  const outName = fname.replace('.html', '.njk');
  fs.writeFileSync(outName, output, 'utf8');
  console.log(`OK ${fname} -> ${outName}  (${body.length} chars content, ${pageStyle.length} css, ${schemas.length} schemas)`);
}
