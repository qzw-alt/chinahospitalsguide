const fs = require('fs');
const pages = {
  'index.njk': 'index.html', 'pricing.njk': 'pricing.html',
  'about.njk': 'about.html', 'services.njk': 'services.html',
  'how-it-works.njk': 'how-it-works.html', 'hospitals.njk': 'hospitals.html',
  'contact.njk': 'contact.html', 'contact-new.njk': 'contact-new.html'
};
for (const [file, permalink] of Object.entries(pages)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('permalink:')) {
    content = content.replace('layout: base.njk', `permalink: ${permalink}\nlayout: base.njk`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file} -> ${permalink}`);
  }
}
