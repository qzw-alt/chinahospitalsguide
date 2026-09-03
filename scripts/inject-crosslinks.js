// Inject cross-content links between blog articles (topic interlinking) + treatments
// Run during build (on _site/). Every blog article gets 2-3 related-article links so
// no page is an orphan (fixes weak internal linking → low crawl frequency).
const fs = require('fs');
const path = require('path');

// ── Topic groups (slug → group). Same-group articles interlink. ──
const blogGroups = {
  cancer: [
    'cancer-treatment-china-2026', 'cancer-treatment-cost-china', 'best-cancer-hospitals-china-2026',
    'thyroid-cancer-treatment-china-2026', 'lung-cancer-treatment-china-2026',
    'liver-treatment-china', 'bone-marrow-transplant-china', 'hepatobiliary-surgery-china-wu-mengchao',
    'proton-therapy-china-2026', '2026-07-18-iza-bren-esophageal-cancer-china',
    '2026-08-05-senaparib-ovarian-cancer-pharmanovia-license-china',
    '2026-08-06-ivonescimab-egfr-lung-cancer-fda-decision-november-2026',
    '2026-08-09-leads-biolabs-opamtistomig-mss-crc-ind-china',
    '2026-08-10-tinengotinib-bile-duct-cancer-fgfr2-resistance-china',
    '2026-08-17-oncolytic-virus-h101-ankerui-china',
    '2026-09-03-foreigners-china-cancer-treatment-medical-tourism',
  ],
  'car-t': [
    'car-t-therapy-china-2026', 'car-t-therapy-hospitals-china-2026', 'car-t-clinical-trials-china-2026',
    'car-t-cost-china-2026', 'car-t-lymphoma-china-cost', 'car-t-multiple-myeloma-china', 'solid-tumor-car-t-china',
    '2026-08-07-in-vivo-car-t-liver-cancer-cellorigin-walvax-gpc3',
    '2026-08-17-gastric-cancer-car-t-satri-cel-china',
    '2026-08-31-solid-tumor-car-t-first-international-patient-china',
    'car-t-indonesia-vietnam-china',
  ],
  cardiac: [
    'cardiac-bypass-surgery-china-2026', 'heart-surgery-cost-china', 'best-cardiac-surgery-hospitals-china-2026',
    'china-vs-singapore-heart-surgery-cost',
  ],
  orthopedic: [
    'knee-replacement-surgery-china-2026', 'knee-replacement-cost-china', 'hip-replacement-cost-china',
    'spine-surgery-cost-china', 'orthopedic-surgery-china-2026', 'rotator-cuff-surgery-china-2026',
    'neurosurgery-cost-china', 'china-orthopedic-hospital-rankings-2026', 'fuzhou-orthopedic-hospital-rankings-2026',
    '3d-printed-implants-china', '2026-08-13-chinese-3d-printed-pelvic-implant-lahore-pakistan',
  ],
  neuro: [
    'deep-brain-stimulation-china-2026', 'epilepsy-treatment-china', 'neurosurgery-brain-tumor-china-2026',
    '2026-08-11-china-brain-computer-interface-vein-implant-stairmed',
  ],
  cosmetic: [
    'plastic-surgery-china-guide-2026', 'hair-transplant-china-2026', 'breast-augmentation-china-2026',
    'beijing-liposuction-hospitals-2026', 'microsurgery-replantation-china',
  ],
  dental: [
    'dental-implants-china', 'dental-tourism-china-2026', 'all-on-four-dental-implants-china', 'dental-tourism-china-guide',
  ],
  eye: [
    'cataract-surgery-china', 'lasik-eye-surgery-china-2026', 'lasik-smile-surgery-china', 'ophthalmology-china-volume-expertise',
  ],
  fertility: [
    'ivf-cost-china-2026', 'ivf-fertility-treatment-china-2026', 'ivf-fertility-treatment-china',
    'ivf-china-2026-complete-guide', 'giving-birth-china-american-parents', 'endometriosis-surgery-china-2026',
  ],
  'stem-cell': [
    'stem-cell-therapy-china-2026', 'stem-cell-therapy-china-cost-2026', 'stem-cell-therapy-china-access',
    'crispr-gene-therapy-china-clinical-trials',
  ],
  'weight-loss': [
    'weight-loss-surgery-china-2026', 'gastric-sleeve-surgery-china-2026',
  ],
  checkup: [
    'health-checkup-china-2026', 'health-screening-china-cost-2026',
  ],
  tcm: [
    'tcm-traditional-chinese-medicine-guide', 'acupuncture-treatment-china-2026', 'baduanjin-eight-brocade-complete-guide',
    'integrated-chinese-western-medicine-china', '2026-07-27-electroacupuncture-facial-paralysis-gentle-current-china-rct-2026',
    '2026-07-28-tcm-going-global-shufeng-jiedu-germany-ai-workflow',
    '2026-07-29-china-tcm-five-year-plan-2026-2030-international-patients',
    '2026-08-03-sanfu-paste-tcm-asthma-allergic-rhinitis-2026',
    '2026-08-04-tcm-mid-air-first-aid-neiguan-paris-beijing-flight',
  ],
  tourism: [
    'japan-china-medical-tourism-2026', 'hainan-tcm-wellness-tourism-2026', 'guangzhou-medical-tourism-guide',
    'china-visa-free-medical-tourism-2026', 'wellness-cities-china-2026', 'why-medical-tourists-choose-china-over-thailand',
    '2026-08-08-boao-lecheng-600-first-in-china-therapies-tcm-wellness',
  ],
  city: [
    'hospitals-in-beijing-for-international-patients', 'hospitals-in-chengdu-for-international-patients',
    'hospitals-in-guangzhou-for-international-patients', 'hospitals-in-shanghai-for-international-patients',
    'hospitals-in-shenzhen-for-international-patients', 'hospitals-in-xian-for-international-patients',
    'how-to-see-a-doctor-in-beijing-as-a-foreigner', 'how-to-see-a-doctor-in-guangzhou-as-a-foreigner',
    'how-to-see-a-doctor-in-shanghai-as-a-foreigner', 'how-to-see-a-doctor-in-shenzhen-as-a-foreigner',
  ],
  guide: [
    'choose-hospital-china-guide', 'how-to-choose-hospital-china-guide', 'choose-hospital-china',
    'medical-guide-seeking-treatment-china', 'how-to-book-hospital-appointment-china',
    'jci-accredited-hospitals-china', 'china-medical-visa-guide-2026', 'cost-comparison-procedures',
    'china-vs-usa-medical-costs-2026', 'how-to-prepare-medical-travel-china',
    'foreigners-guide-healthcare-china', 'best-hospitals-china-international-patients',
    'top-10-questions-medical-tourism-china', 'why-choose-medical-tourism-agency-china',
    'why-international-patients-choose-china-medical-treatment-2026',
    'china-hospital-rankings-2026', 'medical-device-certification-singapore-vs-china-2026',
  ],
  stories: [
    'patient-story-ahmed-liver-transplant', 'patient-story-david-lung-cancer', 'patient-story-margaret-cataract',
  ],
  transplant: [
    'organ-transplant-china-cost-access', 'kidney-dialysis-china',
  ],
  surgery: [
    'autonomous-robotic-surgery-china', 'hernia-surgery-china-2026', 'china-unique-medical-procedures-guide',
  ],
  biotech: [
    '2026-07-30-china-biotech-merck-76-innovative-drugs-record-pipeline-2026',
    '2026-08-12-indonesia-bpom-nmpa-regulatory-cooperation-cart-tcm',
    '2026-08-17-china-hospeq-2026-medical-device-expo',
  ],
};

const blogToGroup = {};
for (const [group, files] of Object.entries(blogGroups)) {
  for (const f of files) blogToGroup[f] = group;
}

// Blog slug → existing treatment page (only treatment pages that actually exist)
const blogToTreatments = {
  'cancer-treatment-china-2026': 'cancer.html',
  'cancer-treatment-cost-china': 'cancer.html',
  'best-cancer-hospitals-china-2026': 'cancer.html',
  'thyroid-cancer-treatment-china-2026': 'cancer.html',
  'bone-marrow-transplant-china': 'cancer.html',
  'liver-treatment-china': 'cancer.html',
  'proton-therapy-china-2026': 'cancer.html',
  'knee-replacement-surgery-china-2026': 'orthopedics.html',
  'hip-replacement-cost-china': 'orthopedics.html',
  'spine-surgery-cost-china': 'orthopedics.html',
  'orthopedic-surgery-china-2026': 'orthopedics.html',
  'rotator-cuff-surgery-china-2026': 'orthopedics.html',
  'ivf-cost-china-2026': 'ivf.html',
  'ivf-fertility-treatment-china-2026': 'ivf.html',
  'ivf-fertility-treatment-china': 'ivf.html',
};

const treatmentToBlogs = {
  'cancer.html': ['cancer-treatment-cost-china', 'best-cancer-hospitals-china-2026', 'car-t-therapy-china-2026', 'proton-therapy-china-2026'],
  'orthopedics.html': ['knee-replacement-surgery-china-2026', 'hip-replacement-cost-china', 'spine-surgery-cost-china'],
  'ivf.html': ['ivf-cost-china-2026', 'ivf-fertility-treatment-china-2026'],
};

const treatmentNames = {
  'cancer.html': 'Cancer Treatment in China',
  'orthopedics.html': 'Orthopedic Surgery in China',
  'ivf.html': 'IVF & Fertility in China',
};

// ── Helpers ──

function getTitle(filePath) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const m = html.match(/<title>([^<]+)<\/title>/);
    return m ? m[1].replace(/\s*\|\s*China Hospitals Guide\s*$/i, '').trim() : path.basename(filePath, '.html').replace(/-/g, ' ');
  } catch {
    return path.basename(filePath, '.html').replace(/-/g, ' ');
  }
}

function isRedirectFile(fp) {
  try {
    const html = fs.readFileSync(fp, 'utf8');
    return /location\.replace\(|http-equiv=["']?refresh/i.test(html);
  } catch {
    return false;
  }
}

function resolveBlogHref(slug, blogDir) {
  // Prefer the real article version (skip meta-refresh redirect files)
  const dirIdx = path.join(blogDir, slug, 'index.html');
  if (fs.existsSync(dirIdx) && !isRedirectFile(dirIdx)) return `/blog/${slug}/`;
  const htmlFile = path.join(blogDir, slug + '.html');
  if (fs.existsSync(htmlFile) && !isRedirectFile(htmlFile)) return `/blog/${slug}.html`;
  // Fallback: only redirect files (or none) exist — prefer pretty URL
  if (fs.existsSync(dirIdx)) return `/blog/${slug}/`;
  if (fs.existsSync(htmlFile)) return `/blog/${slug}.html`;
  return `/blog/${slug}.html`;
}

function makeRelatedLinkHTML(slug, blogDir) {
  const href = resolveBlogHref(slug, blogDir);
  const fp = href.endsWith('/') ? path.join(blogDir, slug, 'index.html') : path.join(blogDir, slug + '.html');
  return `\n<li><a href="${href}">${getTitle(fp)}</a></li>`;
}

function makeTreatmentLinkHTML(treatmentFile) {
  const name = treatmentNames[treatmentFile] || treatmentFile;
  return `\n<li><a href="/${treatmentFile}">🎯 ${name}</a> — save 70-85% at JCI-accredited hospitals</li>`;
}

// Pick 3 related articles (next 2 + previous 1, wrapped) so links distribute evenly
function getRelatedBlogs(slug, group) {
  const files = blogGroups[group].slice().sort();
  const idx = files.indexOf(slug);
  if (idx === -1) return [];
  const n = files.length;
  const result = [];
  for (let i = 1; i <= 2; i++) {
    const j = (idx + i) % n;
    if (j !== idx) result.push(files[j]);
  }
  const prev = (idx - 1 + n) % n;
  if (prev !== idx && !result.includes(files[prev])) result.push(files[prev]);
  return result;
}

// ── Injection ──

function injectRelatedBlock(filePath, itemsHTML) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('data-crosslinks')) return false; // already injected

  const block = `\n<section class="related-blog-articles" data-crosslinks="related" style="max-width:1180px;margin:24px auto 40px;padding:20px 30px;background:#f0f7ff;border-radius:12px;border-left:4px solid #2a5298;"><h3 style="color:#1e3c72;margin:0 0 12px;">📚 Related Articles</h3><ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px;">${itemsHTML}\n</ul></section>`;

  // Prefer existing "Related Articles" list → append into it
  const relatedList = /(<h[23][^>]*>📚?\s*Related Articles<\/h[23]>\s*<ul[^>]*>)/;
  if (relatedList.test(html)) {
    html = html.replace(relatedList, (m) => m + itemsHTML);
    fs.writeFileSync(filePath, html);
    return true;
  }

  // Fallback anchors, most robust first
  if (html.includes('</article>')) {
    html = html.replace('</article>', block + '\n</article>');
  } else if (html.includes('<footer')) {
    html = html.replace('<footer', block + '\n<footer');
  } else if (html.includes('</body>')) {
    html = html.replace('</body>', block + '\n</body>');
  } else {
    return false;
  }
  fs.writeFileSync(filePath, html);
  return true;
}

// ── Process ──

const blogDir = path.join('_site', 'blog');

function collectBlogSlugs() {
  const slugs = [];
  if (!fs.existsSync(blogDir)) return slugs;
  for (const e of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith('.html') && e.name !== 'index.html') {
      const fp = path.join(blogDir, e.name);
      if (!isRedirectFile(fp)) slugs.push(e.name.replace(/\.html$/, ''));
    } else if (e.isDirectory()) {
      // pretty-URL articles (blog/slug/index.html)
      const idx = path.join(blogDir, e.name, 'index.html');
      if (fs.existsSync(idx) && !isRedirectFile(idx)) slugs.push(e.name);
    }
  }
  return slugs;
}

function processBlog(slug) {
  const href = resolveBlogHref(slug, blogDir);
  const fp = href.endsWith('/') ? path.join(blogDir, slug, 'index.html') : path.join(blogDir, slug + '.html');
  if (!fs.existsSync(fp)) return;

  const items = [];
  const group = blogToGroup[slug];
  if (group) {
    for (const r of getRelatedBlogs(slug, group)) {
      items.push(makeRelatedLinkHTML(r, blogDir));
    }
  }
  const treat = blogToTreatments[slug];
  if (treat) items.push(makeTreatmentLinkHTML(treat));
  if (!items.length) return;

  const ok = injectRelatedBlock(fp, items.join(''));
  if (ok) console.log(`Crosslinks: /blog/${slug} → ${items.length} related links`);
}

function processTreatment(name) {
  const fp = path.join('_site', name);
  if (!fs.existsSync(fp)) return;
  const blogs = treatmentToBlogs[name];
  if (!blogs || !blogs.length) return;
  const items = blogs.map((b) => makeRelatedLinkHTML(b, blogDir)).join('');
  const ok = injectRelatedBlock(fp, items);
  if (ok) console.log(`Crosslinks: /${name} → ${blogs.length} related links`);
}

// ── Entry point ──

if (!fs.existsSync('_site')) {
  console.log('No _site/ — run after eleventy build.');
  process.exit(0);
}

for (const slug of new Set(collectBlogSlugs())) processBlog(slug);
for (const name of Object.keys(treatmentToBlogs)) processTreatment(name);

console.log('Cross-link injection done.');
