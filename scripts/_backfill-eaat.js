// One-off: add `updated` (= publication date) to blog .md frontmatter that lacks it.
// `sources` is NOT auto-generated (must be real); script lists files still missing it.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let added = 0;
const skipped = [];
const noSources = [];
files.forEach(f => {
  const full = path.join(dir, f);
  let src = fs.readFileSync(full, 'utf8');
  if (!src.startsWith('---')) { skipped.push(f + ' (no frontmatter)'); return; }
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) { skipped.push(f + ' (frontmatter parse fail)'); return; }
  const fm = m[1];
  if (/^updated:/m.test(fm)) { skipped.push(f + ' (already has updated)'); }
  else {
    const lines = fm.split(/\r?\n/);
    let dateLineIdx = -1;
    lines.forEach((l, i) => { if (/^date:/.test(l)) dateLineIdx = i; });
    if (dateLineIdx >= 0) {
      const d = lines[dateLineIdx].replace(/^date:\s*/, '').trim();
      lines.splice(dateLineIdx + 1, 0, 'updated: ' + d);
      src = src.replace(fm, lines.join('\n'));
      fs.writeFileSync(full, src);
      added++;
    } else {
      skipped.push(f + ' (no date)');
    }
  }
  if (!/^sources:/m.test(fm)) noSources.push(f);
});
console.log('added updated: ' + added);
console.log('skipped:');
skipped.forEach(s => console.log('  - ' + s));
console.log('missing sources (' + noSources.length + ') — do NOT auto-fill, must be real:');
noSources.forEach(s => console.log('  - ' + s));
