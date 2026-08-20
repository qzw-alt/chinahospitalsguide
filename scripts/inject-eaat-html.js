// Post-build: inject an E-E-A-T footer (last verified + medical disclaimer + editorial policy)
// into legacy hand-written blog/*.html posts (passthrough copies) before </body>.
// New .md posts already render E-E-A-T via _layouts/blog-post.njk.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', '_site', 'blog');
if (!fs.existsSync(dir)) { console.log('inject-eaat-html: _site/blog not found, skip'); process.exit(0); }

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
const MARKER = 'eaat-footer';
let changed = 0;
let noDate = 0;

files.forEach(function(f) {
  const full = path.join(dir, f);
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes(MARKER)) return;

  let date = '';
  const lu = html.match(/Last updated:\s*([A-Za-z]+(?:\s+\d{1,2},?)?\s+\d{4})/);
  if (lu) date = lu[1];
  else {
    const dp = html.match(/"datePublished"\s*:\s*"([^"]{4,})"/);
    if (dp) date = dp[1];
  }
  if (!date) { date = '2026'; noDate++; }

  const block = '\n    <div class="' + MARKER + '" id="' + MARKER + '" style="max-width:820px;margin:36px auto 0;padding:22px 24px;background:#f7f9fc;border:1px solid #e5eaf1;border-radius:14px;font-size:0.86rem;color:#4b5565;line-height:1.7;">\n' +
    '        <p style="margin:0 0 8px;"><strong>Last verified:</strong> ' + date + '</p>\n' +
    '        <p style="margin:0;">China Hospitals Guide provides independent coordination for international patients seeking treatment in China. We are not a hospital, doctor, or medical provider &mdash; we do not diagnose, guarantee treatment outcomes, or replace professional medical advice. Prices are estimates; final quotes come from hospitals. Sources for figures are linked within the article.</p>\n' +
    '        <p style="margin:8px 0 0;"><a href="/about.html" style="color:#1e3c72;font-weight:600;">Editorial policy</a> &middot; <a href="/contact-new.html" style="color:#1e3c72;font-weight:600;">Start Free Case Review</a></p>\n' +
    '    </div>\n</body>';

  html = html.replace('</body>', block);
  fs.writeFileSync(full, html);
  changed++;
});

console.log('inject-eaat-html: changed ' + changed + ' posts, ' + noDate + ' fell back to "2026"');
