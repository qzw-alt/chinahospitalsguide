const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all text files except _site, node_modules, .git
const files = glob.sync('**/*', {
  nodir: true,
  ignore: ['_site/**', 'node_modules/**', '.git/**', '_fix_telegram.js']
});

const TEXT_EXTS = new Set([
  '.html', '.njk', '.js', '.json', '.xml', '.md', '.txt', '.css',
  '.yml', '.yaml', '.svg', '.csv', '.sh', '.ps1', '.bat'
]);

let count = 0;
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!TEXT_EXTS.has(ext) && ext !== '') continue;
  // Also check no-extension files (like CNAME, .nojekyll, _redirects)
  // Only process if extension is in our list OR file has no extension

  let content;
  try {
    content = fs.readFileSync(f, 'utf-8');
  } catch (e) {
    continue; // skip binary/unreadable
  }

  if (!content.includes('chinahospitalsguide')) continue;

  const replaced = content.replace(/chinahospitalsguide/g, 'chinahospitalguide');
  if (replaced === content) continue;

  fs.writeFileSync(f, replaced);
  count++;
  console.log('Fixed: ' + f);
}
console.log('\nTotal files fixed: ' + count);
