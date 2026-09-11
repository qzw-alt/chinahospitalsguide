const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'api', 'v1', 'procedures.json');
const procedures = JSON.parse(fs.readFileSync(file, 'utf8')).procedures;

// Format a {low, high} USD range into "$8,000–$12,000".
function fmt(r) {
  if (!r) return '';
  const lo = r.low ? '$' + Number(r.low).toLocaleString() : '';
  const hi = r.high ? '$' + Number(r.high).toLocaleString() : '';
  if (lo && hi && hi !== lo) return lo + '–' + hi;
  return hi || lo;
}

// Pre-compute full hospital objects for each procedure (from hospital_id),
// so templates can iterate procedure.hospitalObjects directly — same pattern
// as specialties.js / conditions.js. Keeps the original `hospitals` array intact.
const hospitals = require('./hospitals.js');
const byId = {};
hospitals.forEach(function (h) { byId[h.id] = h; });
procedures.forEach(function (p) {
  p.priceText = fmt(p.overall_price_range_usd);
  p.hospitalObjects = (p.hospitals || []).map(function (hp) {
    const h = byId[hp.hospital_id];
    if (!h) return null;
    return Object.assign({}, h, {
      dept: hp.department,
      priceText: fmt(hp.price_range_usd) || p.priceText,
      priceNote: hp.notes || '',
      lastVerified: hp.last_verified || ''
    });
  }).filter(Boolean);
});

// Per-procedure FAQ for the treatments pages (batch 4). Keyed by procedure id.
const faqMap = {
  "knee-replacement": [
    { q: "How much does a knee replacement cost in China?", a: "Total knee replacement typically runs $8,000–$12,000 in-hospital, depending on implant brand (domestic vs imported). By comparison, private knee replacement runs about AUD $20,000–$35,000 in Australia and $40,000–$70,000 in Singapore." },
    { q: "How long do I stay in China for a knee replacement?", a: "The hospital stay is 7–10 days, followed by several weeks of assisted recovery. Most international patients travel home after 2–3 weeks, with rehabilitation continuing at home." },
    { q: "Which hospitals are best for knee replacement in China?", a: "Jishuitan Hospital in Beijing and Shanghai Sixth Hospital are leading high-volume joint replacement centers, both using imported implant brands at a fraction of Western pricing." }
  ],
  "hip-replacement": [
    { q: "How much does a hip replacement cost in China?", a: "Total hip replacement typically runs $8,000–$12,000 in-hospital. Implant brand (domestic vs imported) and hospital level are the main cost drivers." },
    { q: "How long is recovery after a hip replacement?", a: "The hospital stay is 7–10 days; most patients walk with assistance within days and travel home after 2–3 weeks, continuing rehabilitation at home." },
    { q: "Which hospitals are best for hip replacement in China?", a: "Jishuitan Hospital (Beijing) and Shanghai Sixth Hospital are leading joint replacement centers, with Peking University Third Hospital and West China Hospital as strong alternatives." }
  ],
  "coronary-artery-bypass": [
    { q: "How much does CABG cost in China?", a: "Coronary artery bypass grafting typically runs $12,000–$18,000 in-hospital, versus $40,000–$70,000 in Singapore and $100,000+ self-pay in the US." },
    { q: "Which hospital does the most heart surgery in China?", a: "Fu Wai Hospital in Beijing is China's #1 cardiology hospital, performing about 18,000+ cardiac surgeries a year — among the highest CABG volumes worldwide." },
    { q: "How long is CABG recovery?", a: "The hospital stay is 7–10 days, with 6–8 weeks to full recovery. We coordinate records and follow-up so you can recover at home." }
  ],
  "spine-surgery": [
    { q: "How much does spine surgery cost in China?", a: "Spine surgery typically runs $10,000–$18,000, varying widely by procedure type (lumbar fusion, decompression, or deformity surgery) and implant hardware." },
    { q: "What spine procedures are available in China?", a: "Lumbar fusion, decompression, and spinal deformity surgery are all available at high-volume centers, using the same imported hardware brands as Western hospitals." },
    { q: "Which hospital is best for spine surgery in China?", a: "Jishuitan Hospital in Beijing is a nationally recognized spine center, with Peking University Third Hospital and West China Hospital as strong alternatives." }
  ],
  "lasik": [
    { q: "How much does LASIK cost in China?", a: "LASIK typically runs $1,200–$2,800 for both eyes, depending on hospital level, laser platform, and surgeon experience — versus $3,000–$6,000 in Singapore." },
    { q: "Is LASIK an outpatient procedure in China?", a: "Yes — LASIK is a same-day outpatient procedure. Vision stabilizes over 1–3 months, and you can usually fly home within days." },
    { q: "Which hospitals do the most LASIK in China?", a: "Beijing Tongren Hospital (a top-ranked ophthalmology hospital) and Zhongshan Ophthalmic Center (20,000+ refractive surgeries a year) lead in volume and experience." }
  ],
  "cataract-surgery": [
    { q: "How much does cataract surgery cost in China?", a: "Cataract surgery typically runs $800–$1,500 per eye for a base monofocal lens. Premium IOLs (multifocal or toric) cost more." },
    { q: "What drives the price of cataract surgery?", a: "The intraocular lens type is the main driver — monofocal lenses are least expensive, while multifocal and toric lenses that correct astigmatism cost more." },
    { q: "How fast is recovery from cataract surgery?", a: "It is a same-day or 1–2 day outpatient procedure with quick visual recovery; most patients return to normal activities within days." }
  ]
};
// SEO titles: match "X Cost in China" phrases patients search (autocomplete).
const seoTitleMap = {
  'knee-replacement': 'Knee Replacement Cost in China 2026',
  'hip-replacement': 'Hip Replacement Cost in China 2026',
  'coronary-artery-bypass': 'Heart Bypass (CABG) Cost in China 2026',
  'spine-surgery': 'Spine Surgery Cost in China 2026',
  'lasik': 'LASIK Eye Surgery Cost in China 2026',
  'cataract-surgery': 'Cataract Surgery Cost in China 2026'
};
procedures.forEach(function (p) { p.seoTitle = seoTitleMap[p.id] || (p.name + ' Cost in China 2026'); });
procedures.forEach(function (p) { p.faq = faqMap[p.id] || []; });

module.exports = procedures;
