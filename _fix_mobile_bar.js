const fs = require('fs');
const glob = require('glob');

const files = glob.sync('{*.html,blog/*.html}', {
  ignore: ['_site/**', 'node_modules/**']
});

function makeBar(rootRelative) {
  const pre = rootRelative ? '' : '/';
  return '    <div class="mobile-bottom-bar">\n' +
    '        <a href="' + pre + 'index.html"><span>🏠</span>Home</a>\n' +
    '        <a href="' + pre + 'pricing.html"><span>💰</span>Pricing</a>\n' +
    '        <a href="https://t.me/chinahospitalguide" target="_blank" rel="noopener"><span>📨</span>Telegram</a>\n' +
    '        <a href="#" onclick="event.preventDefault();navigator.clipboard.writeText(\'chinahospitalguide\').then(()=>{this.querySelector(\'span\').textContent=\'✅\';this.querySelector(\'.bb-label\').textContent=\'Copied!\';setTimeout(()=>{this.querySelector(\'span\').textContent=\'💬\';this.querySelector(\'.bb-label\').textContent=\'WeChat\'},2000)}).catch(()=>alert(\'WeChat ID: chinahospitalguide\'))"><span>💬</span><span class="bb-label">WeChat</span></a>\n' +
    '    </div>';
}

// Match: the entire mobile-bottom-bar div
const re = /<div class="mobile-bottom-bar">[\s\S]*?<\/div>/;

let count = 0;
for (const fpath of files) {
  let c = fs.readFileSync(fpath, 'utf-8');
  const match = c.match(re);
  if (!match) continue;

  const barBlock = match[0];
  const isAbsolute = barBlock.includes('href="/');
  const newBlock = makeBar(!isAbsolute);

  c = c.split(barBlock).join(newBlock);
  fs.writeFileSync(fpath, c);
  count++;
  console.log('FIXED: ' + fpath);
}
console.log('\nUpdated ' + count + ' files');
