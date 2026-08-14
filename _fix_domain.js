const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('**/*', {
  nodir: true,
  ignore: ['_site/**', 'node_modules/**', '.git/**']
});

const TEXT_EXTS = new Set([
  '.html', '.njk', '.js', '.json', '.xml', '.md', '.txt', '.css',
  '.yml', '.yaml', '.svg', '.csv', '.sh', '.ps1', '.bat'
]);

let count = 0;
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!TEXT_EXTS.has(ext) && ext !== '') continue;

  let content;
  try {
    content = fs.readFileSync(f, 'utf-8');
  } catch (e) {
    continue;
  }

  if (!content.includes('chinahospitalsguide.com')) continue;

  const replaced = content.replace(/chinahospitalguide\.com/g, 'chinahospitalsguide.com');
  if (replaced === content) continue;

  fs.writeFileSync(f, replaced);
  count++;
  console.log('Fixed domain: ' + f);
}
console.log('\nTotal files fixed: ' + count);
