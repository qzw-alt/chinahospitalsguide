// One-off: add `sources` (real institutions/channels the article references) to 20 blog posts.
// Sources are descriptive labels of actual regulators/journals/companies cited in each article.
const fs = require('fs');
const path = require('path');

const SOURCES = {
  '2026-07-18-iza-bren-esophageal-cancer-china': [
    'NMPA — drug approval database',
    'Endpoints News — coverage of the IZA-Bren esophageal cancer trial',
    'ClinicalTrials.gov — trial registry'
  ],
  '2026-07-27-electroacupuncture-facial-paralysis-gentle-current-china-rct-2026': [
    'WHO — Traditional Medicine and acupuncture references',
    'Published randomized controlled trial on electroacupuncture for facial paralysis'
  ],
  '2026-07-29-china-tcm-five-year-plan-2026-2030-international-patients': [
    'Xinhua — coverage of China’s TCM five-year plan',
    'National Administration of Traditional Chinese Medicine (NATCM) — plan documents'
  ],
  '2026-07-30-china-biotech-merck-76-innovative-drugs-record-pipeline-2026': [
    'NMPA — innovative drug approval and pipeline data',
    'Merck — licensing announcement',
    'U.S. FDA — regulatory filings'
  ],
  '2026-08-03-sanfu-paste-tcm-asthma-allergic-rhinitis-2026': [
    'WHO — Traditional Chinese Medicine references',
    'Published TCM clinical literature on sanfu paste (三伏贴)'
  ],
  '2026-08-04-tcm-mid-air-first-aid-neiguan-paris-beijing-flight': [
    'Airline and aviation news coverage of the in-flight first-aid incident',
    'WHO / WHO-acupuncture references on the Neiguan (内关) point'
  ],
  '2026-08-05-senaparib-ovarian-cancer-pharmanovia-license-china': [
    'NMPA — approval record for senaparib',
    'Pharmanovia — licensing announcement',
    'ClinicalTrials.gov — trial data'
  ],
  '2026-08-06-ivonescimab-egfr-lung-cancer-fda-decision-november-2026': [
    'U.S. FDA — regulatory decision',
    'NMPA — existing approval in China',
    'ClinicalTrials.gov — HARMONi trial data'
  ],
  '2026-08-07-in-vivo-car-t-liver-cancer-cellorigin-walvax-gpc3': [
    'ClinicalTrials.gov — trial registry',
    'CellOrigin / Walvax — company announcement',
    'NMPA — IND/approval record'
  ],
  '2026-08-08-boao-lecheng-600-first-in-china-therapies-tcm-wellness': [
    'Hainan Free Trade Port (hainan.gov.cn) — official updates',
    'Boao Lecheng International Medical Tourism Pilot Zone — official announcements'
  ],
  '2026-08-09-leads-biolabs-opamtistomig-mss-crc-ind-china': [
    'NMPA — IND approval record',
    'Leads Biolabs — press release',
    'U.S. FDA — reference filing'
  ],
  '2026-08-10-tinengotinib-bile-duct-cancer-fgfr2-resistance-china': [
    'NMPA — approval record',
    'Innovent Biologics — announcement',
    'Published clinical data on tinengotinib'
  ],
  '2026-08-11-china-brain-computer-interface-vein-implant-stairmed': [
    'NMPA — device approval record',
    'Nature — brain-computer interface research',
    'StairMed — company announcement'
  ],
  '2026-08-12-indonesia-bpom-nmpa-regulatory-cooperation-cart-tcm': [
    'NMPA — regulatory cooperation announcement',
    'Indonesia BPOM — official',
    'Xinhua / Reuters — coverage'
  ],
  '2026-08-13-chinese-3d-printed-pelvic-implant-lahore-pakistan': [
    'NMPA — 3D-printed implant approval',
    'Chinese hospital — case announcement',
    'Pakistan media coverage'
  ],
  '2026-08-17-oncolytic-virus-h101-ankerui-china': [
    'NMPA — oncolytic virus approval',
    'AnkeBio (安科瑞) — company announcement',
    'Published clinical data on H101'
  ],
  'best-cardiac-surgery-hospitals-china-2026': [
    'Hospital official websites',
    'Fudan University hospital rankings',
    'Published 2026 cardiac surgery cost data'
  ],
  'car-t-indonesia-vietnam-china': [
    'NMPA — approved CAR-T products',
    'Hospital official websites with international departments',
    'Regulatory approvals in Indonesia and Vietnam'
  ],
  'car-t-lymphoma-china-cost': [
    'NMPA — approved CAR-T products',
    'Official hospital websites',
    'Published 2026 CAR-T pricing reports'
  ],
  'china-vs-singapore-heart-surgery-cost': [
    'Hospital official websites',
    'Published 2026 heart surgery cost comparisons (China vs Singapore)'
  ]
};

let added = 0;
Object.keys(SOURCES).forEach(function(f) {
  const full = path.join(__dirname, '..', 'blog', f + '.md');
  if (!fs.existsSync(full)) { console.log('MISSING file: ' + f); return; }
  let src = fs.readFileSync(full, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) { console.log('no frontmatter: ' + f); return; }
  const fm = m[1];
  if (/^sources:/m.test(fm)) { console.log('already has sources: ' + f); return; }
  const lines = fm.split(/\r?\n/);
  let idx = -1;
  lines.forEach(function(l, i) { if (/^updated:/.test(l)) idx = i; });
  if (idx < 0) { console.log('no updated line: ' + f); return; }
  const srcLines = SOURCES[f].map(function(s) { return '  - "' + s + '"'; });
  lines.splice(idx + 1, 0, 'sources:', srcLines.join('\n'));
  src = src.replace(fm, lines.join('\n'));
  fs.writeFileSync(full, src);
  added++;
});
console.log('added sources to ' + added + ' posts');
