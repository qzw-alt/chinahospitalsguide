const fs = require('fs');
const path = require('path');

const hints = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//pagead2.googlesyndication.com">
    <link rel="preload" href="/styles.css" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap">`;

function injectHints(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('_')) injectHints(full);
    } else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      if (html.includes('fonts.googleapis.com')) continue; // already has font link
      html = html.replace('</title>', '</title>' + hints);
      fs.writeFileSync(full, html);
      console.log('Injected:', full);
    }
  }
}

injectHints('_site');
console.log('Done.');
