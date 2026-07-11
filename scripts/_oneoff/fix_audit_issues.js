const fs = require('fs');

// ===== P0-1: Fix invisible active lang-flag style =====
// Replace bg:rgba(255,255,255,0.15) with a visible active class
// First, add a proper .lang-flag.active style to styles.css
let css = fs.readFileSync('styles.css', 'utf8');
if (!css.includes('.lang-flag.active')) {
  css = css.replace(
    '.lang-flag:hover {',
    '.lang-flag.active { color: #fff; background: rgba(255,255,255,0.22); font-weight: 700; }\n        .lang-flag:hover {'
  );
  fs.writeFileSync('styles.css', css, 'utf8');
  console.log('P0-1: Added .lang-flag.active style to styles.css');
}

// Now replace inline style="color:#fff;background:rgba(255,255,255,0.15)" with class="lang-flag active"
const files = [
  'ru.html', 'ar.html', 'id.html',
  'ru-pricing.html', 'ru-contact.html',
  'ar-pricing.html', 'ar-contact.html',
  'index.html', 'pricing.html', 'about.html',
  'services.html', 'how-it-works.html', 'hospitals.html',
  'contact.html', 'contact-new.html'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  const orig = html.length;

  // Replace inline active style with class
  html = html.replace(
    /class="lang-flag" style="color:#fff;background:rgba\(255,255,255,0\.\d+\)"/g,
    'class="lang-flag active"'
  );

  if (html.length !== orig) {
    fs.writeFileSync(f, html, 'utf8');
    console.log('P0-1: Fixed lang-flag active on ' + f);
  }
}

// ===== P1-4: Remove nav-cta-mobile from id.html =====
let idHtml = fs.readFileSync('id.html', 'utf8');
if (idHtml.includes('nav-cta-mobile')) {
  idHtml = idHtml.replace(/<li><a href="\/contact-new\.html" class="nav-cta-mobile">[^<]+<\/a><\/li>/g, '');
  fs.writeFileSync('id.html', idHtml, 'utf8');
  console.log('P1-4: Removed nav-cta-mobile from id.html');
}

// ===== P1-2: Fix ru-contact.html missing id="navLinks" =====
let ruContact = fs.readFileSync('ru-contact.html', 'utf8');
if (ruContact.includes('class="nav-links"') && !ruContact.includes('id="navLinks"')) {
  ruContact = ruContact.replace('class="nav-links"', 'class="nav-links" id="navLinks"');
  fs.writeFileSync('ru-contact.html', ruContact, 'utf8');
  console.log('P1-2: Added id="navLinks" to ru-contact.html');
}

// Also check ar-contact.html
let arContact = fs.readFileSync('ar-contact.html', 'utf8');
if (arContact.includes('class="nav-links"') && !arContact.includes('id="navLinks"')) {
  arContact = arContact.replace('class="nav-links"', 'class="nav-links" id="navLinks"');
  fs.writeFileSync('ar-contact.html', arContact, 'utf8');
  console.log('P1-2: Added id="navLinks" to ar-contact.html');
}

// ===== P2-1: Add missing Process and Blog to id.html nav =====
if (!idHtml.includes('Process')) {
  idHtml = idHtml.replace(
    '<a href="/pricing.html">Pricing</a></li><li><a href="/hospitals.html">Hospitals</a></li>',
    '<a href="/pricing.html">Pricing</a></li><li><a href="/hospitals.html">Hospitals</a></li><li><a href="/blog/">Blog</a></li>'
  );
  fs.writeFileSync('id.html', idHtml, 'utf8');
  console.log('P2-1: Added missing nav items to id.html');
}

console.log('\nDone.');
