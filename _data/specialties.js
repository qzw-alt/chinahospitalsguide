// Specialty directory data (batch 2).
// Each specialty maps one or more hospital `tags` to a standard clinical field,
// so a specialty page can list the matching hospitals automatically.
// hospitals[] is pre-computed here so the template stays simple.
const hospitals = require('./hospitals.js');

const specialties = [
  {
    slug: 'cardiology',
    name: 'Cardiology & Heart Surgery',
    tags: ['cardiology', 'heart-surgery'],
    intro: "China's national cardiovascular centers — Fu Wai and Anzhen in Beijing — perform among the highest annual volumes of heart surgery, stenting and ablation anywhere in the world. International patients come for complex valve repair, coronary artery bypass and congenital cases at a fraction of Western self-pay pricing.",
    priceNote: 'Coronary artery bypass from $12,000–$18,000 (vs $100,000+ in the US)',
    faq: [
      { q: 'Which hospital is best for heart surgery in China?', a: 'Fu Wai Hospital in Beijing is China\'s #1 cardiology hospital and national cardiovascular center, performing around 18,000+ cardiac surgeries a year. Anzhen Hospital is a strong second for aortic and high-risk cases, and Zhongshan Hospital in Shanghai is a top cardiac center in the south.' },
      { q: 'How much does heart surgery cost in China?', a: 'Coronary artery bypass grafting typically runs $12,000–$18,000 in China versus $100,000+ in the US. Final price depends on the hospital, surgeon and your clinical complexity. Prices are estimates and confirmed per case.' }
    ]
  },
  {
    slug: 'oncology',
    name: 'Oncology & Cancer Care',
    tags: ['oncology', 'cancer-surgery', 'radiotherapy', 'cryosurgery', 'nanoknife'],
    intro: "China's leading cancer centers — the Cancer Hospital of CAMS in Beijing and Sun Yat-sen University Cancer Center in Guangzhou — treat some of the highest patient volumes in Asia, with access to surgery, radiotherapy, proton therapy, CAR-T and ablation technologies such as cryosurgery and NanoKnife.",
    priceNote: 'Cancer treatment from $8,000–$20,000 depending on stage and protocol',
    faq: [
      { q: 'Which are the best cancer hospitals in China?', a: 'The Cancer Hospital of the Chinese Academy of Medical Sciences (Beijing) is China\'s #1 oncology center. Sun Yat-sen University Cancer Center (Guangzhou) is a top-3 national cancer hospital, and Fuda Cancer Hospital offers advanced private ablation options including cryosurgery and NanoKnife.' },
      { q: 'What cancer treatments are available in China for international patients?', a: 'China\'s top centers offer surgery, radiotherapy, chemotherapy, targeted therapy and immunotherapy, plus advanced options such as CAR-T therapy and proton therapy. Prices vary widely by cancer type and stage — a case review gives you a realistic range for your specific situation.' }
    ]
  },
  {
    slug: 'orthopedics',
    name: 'Orthopedics & Joint Replacement',
    tags: ['orthopedics', 'joint-replacement', 'spine-surgery', 'sports-medicine'],
    intro: "Jishuitan Hospital is China's #1 orthopedic center and Shanghai Sixth Hospital is #2, both performing very high volumes of knee and hip replacement, spine surgery and sports-medicine procedures with imported implant brands — routinely scheduled within weeks.",
    priceNote: 'Knee or hip replacement from $8,000–$12,000; spine surgery from $10,000–$18,000',
    faq: [
      { q: 'Which hospital is best for joint replacement in China?', a: 'Jishuitan Hospital in Beijing is China\'s #1 orthopedics hospital and its leading joint replacement center. Shanghai Sixth Hospital is a strong #2, and Peking University Third Hospital is a top referral center for spine and sports medicine.' },
      { q: 'How much does a knee replacement cost in China?', a: 'A total knee replacement typically runs $8,000–$12,000 in China, versus $35,000–$50,000 in the US. The price depends mainly on the implant brand (domestic vs imported) and the hospital. Surgery is often scheduled within a few weeks of consultation.' }
    ]
  },
  {
    slug: 'neurosurgery',
    name: 'Neurosurgery',
    tags: ['neurosurgery'],
    intro: "Tiantan Hospital in Beijing is China's #1 neurosurgery center and among the world's highest-volume brain surgery hospitals, handling complex tumor, vascular and skull-base cases. Huashan Hospital in Shanghai is the south's leading counterpart.",
    priceNote: 'Case-specific; start with a specialist second opinion from $149',
    faq: [
      { q: 'Which hospital is best for brain surgery in China?', a: 'Tiantan Hospital in Beijing is China\'s #1 neurosurgery center and a world leader in brain tumor and skull-base surgery. Huashan Hospital in Shanghai is #2 nationally and a top center for cerebrovascular and functional neurosurgery.' },
      { q: 'How do I get a second opinion on brain surgery from a Chinese hospital?', a: 'You can upload your existing scans and records for a written specialist second opinion from a Grade 3A neurosurgery consultant — no travel required, delivered in about 4–7 business days, from $149.' }
    ]
  },
  {
    slug: 'neurology',
    name: 'Neurology',
    tags: ['neurology'],
    intro: "For stroke, Parkinson's, epilepsy and complex neurological diagnosis, Tiantan and Huashan hospitals lead China in neurology, alongside Xijing Hospital in Xi'an and Dongzhimen Hospital's integrated TCM neurology.",
    priceNote: 'Diagnostic work-up from $150 (MRI); specialist second opinion from $149',
    faq: [
      { q: 'Which hospital is best for neurology in China?', a: 'Tiantan Hospital and Huashan Hospital are China\'s top neurology centers for stroke, epilepsy and movement disorders. Xijing Hospital in Xi\'an is a top-5 neurosurgery and neurology center in the west.' },
      { q: 'Can I get diagnosed in China for a neurological condition?', a: 'Yes. A coordinated MRI starts from about $150 and is often scheduled within 24–48 hours, with a specialist neurology consultation and English report. This is a common first step before committing to treatment.' }
    ]
  },
  {
    slug: 'obgyn',
    name: 'OB-GYN & Fertility',
    tags: ['maternity', 'obstetrics', 'prenatal-diagnosis', 'fertility', 'gynecology'],
    intro: "Peking University Third Hospital is China's #1 fertility center and Fudan University Women's Hospital in Shanghai is #2 for obstetrics. Together with Zhejiang Women's Hospital, they cover IVF, high-risk obstetrics and prenatal diagnosis at a fraction of Western pricing.",
    priceNote: 'IVF from $3,000–$8,000 per cycle (vs $15,000–$25,000 in the US)',
    faq: [
      { q: 'Which hospital is best for IVF in China?', a: 'Peking University Third Hospital in Beijing is China\'s #1 fertility center and one of the highest-volume IVF centers in Asia. Fudan University Women\'s Hospital and Zhejiang University Women\'s Hospital are top alternatives in the east.' },
      { q: 'How much does IVF cost in China?', a: 'An IVF cycle typically runs $3,000–$8,000 in China, versus $15,000–$25,000 in the US. The final cost depends on the protocol and medication. A case review gives you a realistic range before you travel.' }
    ]
  },
  {
    slug: 'pediatrics',
    name: 'Pediatrics',
    tags: ['pediatrics', 'childrens-health'],
    intro: "Beijing Children's Hospital is China's #1 pediatrics center, treating complex congenital, cardiac and hematological conditions in children. Shenzhen Maternity & Child Healthcare Hospital is a leading southern counterpart.",
    priceNote: 'Case-specific; specialist second opinion from $149',
    faq: [
      { q: 'Which is the best children\'s hospital in China?', a: 'Beijing Children\'s Hospital is China\'s #1 pediatrics center and a national referral hub for complex childhood conditions. Shenzhen Maternity & Child Healthcare Hospital is a top alternative in the south.' },
      { q: 'Can my child get a second opinion from a Chinese specialist?', a: 'Yes. We arrange written specialist second opinions from Grade 3A pediatric consultants — no travel required, delivered in about 4–7 business days, from $149.' }
    ]
  },
  {
    slug: 'ophthalmology',
    name: 'Ophthalmology',
    tags: ['ophthalmology', 'lasik', 'cataract'],
    intro: "Beijing Tongren Hospital is China's #1 ophthalmology center, with Tianjin Eye Hospital and the Aier group covering laser vision correction and cataract surgery at prices well below Western self-pay rates.",
    priceNote: 'LASIK from $1,200–$2,800; cataract surgery from $800–$1,500',
    faq: [
      { q: 'Which hospital is best for eye surgery in China?', a: 'Beijing Tongren Hospital is China\'s #1 ophthalmology hospital. Zhongshan Ophthalmic Center in Guangzhou performs 20,000+ refractive surgeries a year, and Tianjin Eye Hospital is the north\'s leading specialist eye hospital.' },
      { q: 'How much does LASIK cost in China?', a: 'LASIK typically runs $1,200–$2,800 for both eyes in China, versus $4,000+ in the US. Cataract surgery runs about $800–$1,500 per eye depending on the lens. Prices are confirmed per case.' }
    ]
  },
  {
    slug: 'tcm',
    name: 'Traditional Chinese Medicine',
    tags: ['tcm'],
    intro: "Longhua, Dongzhimen and Shuguang are China's leading TCM hospitals, integrating acupuncture and herbal medicine with modern oncology, neurology and fertility care — increasingly sought by international patients as a complement to conventional treatment.",
    priceNote: 'Consultation and treatment are case-specific; second opinion from $149',
    faq: [
      { q: 'Which is the best TCM hospital in China?', a: 'Longhua Hospital and Dongzhimen Hospital are widely ranked among China\'s top TCM hospitals. The First Affiliated Hospital of Guangzhou University of Chinese Medicine is the south\'s leading TCM center.' },
      { q: 'Can TCM be combined with conventional treatment in China?', a: 'Yes. China\'s top TCM hospitals routinely combine acupuncture and herbal medicine with modern oncology, neurology and fertility protocols, and several are JCI-accredited or hold Grade 3A classification with international departments.' }
    ]
  },
  {
    slug: 'ent',
    name: 'ENT (Otolaryngology)',
    tags: ['ent'],
    intro: "Beijing Tongren Hospital is China's #1 ENT center, treating complex ear, nose, throat and head-and-neck cases alongside its top-ranked ophthalmology department.",
    priceNote: 'Case-specific; specialist second opinion from $149',
    faq: [
      { q: 'Which hospital is best for ENT in China?', a: 'Beijing Tongren Hospital is China\'s #1 ENT and otolaryngology center, with nationally leading head-and-neck and hearing programs.' },
      { q: 'How do I get an ENT second opinion in China?', a: 'Upload your existing scans and records for a written second opinion from a Grade 3A ENT consultant — delivered in about 4–7 business days, from $149, no travel required.' }
    ]
  },
  {
    slug: 'urology',
    name: 'Urology & Nephrology',
    tags: ['urology', 'kidney-disease'],
    intro: "Shanghai Changhai Hospital and Nanfang Hospital lead urology and kidney disease care in China, covering prostate surgery, kidney stone treatment and renal disease management.",
    priceNote: 'Case-specific; start with imaging from $150 or a second opinion from $149',
    faq: [
      { q: 'Which hospital is best for urology in China?', a: 'Shanghai Changhai Hospital and Nanfang Hospital in Guangzhou are among China\'s leading urology and nephrology centers, handling prostate, kidney stone and renal disease cases for international patients.' },
      { q: 'Can I get kidney disease evaluated in China?', a: 'Yes. Imaging from $150 and specialist nephrology consultations are available at Grade 3A hospitals, often scheduled within days. A case review helps you decide whether to travel.' }
    ]
  },
  {
    slug: 'gastroenterology',
    name: 'Gastroenterology',
    tags: ['gastroenterology'],
    intro: "Zhongshan Sixth Hospital in Guangzhou and Renji Hospital in Shanghai are China's leading gastroenterology and digestive-disease centers, covering endoscopy, IBD and colorectal surgery.",
    priceNote: 'Case-specific; diagnostic endoscopy is priced per case',
    faq: [
      { q: 'Which hospital is best for gastroenterology in China?', a: 'Zhongshan Sixth Hospital in Guangzhou is China\'s top gastroenterology center, and Renji Hospital in Shanghai is a leading digestive-disease referral hospital.' },
      { q: 'Can I get an endoscopy or colonoscopy in China quickly?', a: 'Yes. Diagnostic endoscopy and colonoscopy are available at Grade 3A hospitals, often scheduled within days, at prices well below Western private rates. A case review confirms current timing and cost.' }
    ]
  },
  {
    slug: 'respiratory',
    name: 'Respiratory Medicine',
    tags: ['respiratory'],
    intro: "The First Affiliated Hospital of Guangzhou Medical University (home of the National Clinical Research Center for Respiratory Disease) and Beijing Chaoyang Hospital lead China in respiratory and lung disease care.",
    priceNote: 'Case-specific; imaging from $150',
    faq: [
      { q: 'Which hospital is best for respiratory medicine in China?', a: 'The First Affiliated Hospital of Guangzhou Medical University hosts the National Clinical Research Center for Respiratory Disease. Beijing Chaoyang Hospital is the north\'s leading respiratory referral center.' },
      { q: 'Can I get a lung evaluation in China?', a: 'Yes. CT and pulmonary function testing are available at Grade 3A respiratory centers, often same-day or within 48 hours, with English reports. A case review helps plan your visit.' }
    ]
  },
  {
    slug: 'hematology',
    name: 'Hematology',
    tags: ['hematology'],
    intro: "Peking University People's Hospital is China's leading hematology center, known for bone marrow transplantation and the treatment of leukemia, lymphoma and blood disorders.",
    priceNote: 'Case-specific; specialist second opinion from $149',
    faq: [
      { q: 'Which hospital is best for blood disorders in China?', a: 'Peking University People\'s Hospital in Beijing is China\'s leading hematology center and a major bone marrow transplantation hub.' },
      { q: 'Can I get a second opinion on a blood condition from a Chinese hospital?', a: 'Yes. A written second opinion from a Grade 3A hematology consultant is available from $149, delivered in about 4–7 business days without travel.' }
    ]
  },
  {
    slug: 'plastic-surgery',
    name: 'Plastic & Reconstructive Surgery',
    tags: ['plastic-surgery'],
    intro: "Shanghai Ninth Hospital is China's leading plastic and reconstructive surgery center, known for craniofacial, cleft and complex reconstruction alongside cosmetic procedures.",
    priceNote: 'Case-specific; quote after case review',
    faq: [
      { q: 'Which hospital is best for plastic surgery in China?', a: 'Shanghai Ninth Hospital is China\'s top plastic and reconstructive surgery center, a national referral hub for craniofacial and cleft reconstruction.' },
      { q: 'How much does cosmetic surgery cost in China?', a: 'Cosmetic and reconstructive procedures vary widely by type and complexity. A case review gives you a realistic range for your specific procedure before you travel.' }
    ]
  },
  {
    slug: 'infectious-disease',
    name: 'Infectious Disease',
    tags: ['infectious-disease'],
    intro: "Tangdu Hospital in Xi'an combines a top infectious-disease program with leading thoracic surgery, handling complex and travel-related infections for international patients.",
    priceNote: 'Case-specific; specialist second opinion from $149',
    faq: [
      { q: 'Which hospital treats infectious disease in China?', a: 'Tangdu Hospital in Xi\'an runs a leading infectious-disease program alongside its #1 thoracic surgery center, and treats complex infections for international patients.' },
      { q: 'Can I get a travel-related infection evaluated in China?', a: 'Yes. Grade 3A hospitals offer infectious-disease consultations and testing, often with fast turnaround. A case review helps you choose the right center.' }
    ]
  },
  {
    slug: 'thoracic-surgery',
    name: 'Thoracic Surgery',
    tags: ['thoracic-surgery'],
    intro: "Tangdu Hospital in Xi'an is China's #1 thoracic surgery center, handling lung, esophageal and chest-wall surgery at very high volumes.",
    priceNote: 'Case-specific; specialist second opinion from $149',
    faq: [
      { q: 'Which hospital is best for thoracic surgery in China?', a: 'Tangdu Hospital in Xi\'an is ranked #1 in thoracic surgery in China, handling high volumes of lung and esophageal surgery.' },
      { q: 'How do I get a thoracic surgery second opinion in China?', a: 'Upload your existing CT scans and records for a written second opinion from a Grade 3A thoracic surgery consultant — delivered in about 4–7 business days, from $149.' }
    ]
  },
  {
    slug: 'dental',
    name: 'Dental & Oral Surgery',
    tags: ['dental', 'oral-surgery', 'cosmetic-dental'],
    intro: "Shanghai Jiao Tong University Dental Hospital and Guangzhou Dental Hospital are China's leading dental centers, offering implants, oral surgery and cosmetic dentistry at a fraction of Western pricing.",
    priceNote: 'Dental implants from $800–$2,500 (vs $3,000–$6,000 in the US)',
    faq: [
      { q: 'Which hospital is best for dental care in China?', a: 'Shanghai Jiao Tong University Dental Hospital and Guangzhou Dental Hospital are China\'s top dental centers for implants, oral surgery and cosmetic dentistry.' },
      { q: 'How much do dental implants cost in China?', a: 'Dental implants typically run $800–$2,500 in China, versus $3,000–$6,000 in the US, depending on the implant brand and clinic. Prices are confirmed per case.' }
    ]
  },
  {
    slug: 'geriatrics',
    name: 'Geriatrics',
    tags: ['geriatrics'],
    intro: "Huadong Hospital in Shanghai is China's leading geriatrics center, specializing in comprehensive care for older patients, including multi-disease management and rehabilitation.",
    priceNote: 'Case-specific; imaging from $150',
    faq: [
      { q: 'Which hospital is best for geriatric care in China?', a: 'Huadong Hospital in Shanghai is China\'s top geriatrics center, specializing in comprehensive multi-disease care and rehabilitation for older patients.' },
      { q: 'Can older patients get comprehensive evaluation in China?', a: 'Yes. Geriatric centers offer combined imaging, multi-specialty evaluation and rehabilitation planning, with bilingual international departments. A case review helps plan the visit.' }
    ]
  }
];

// Pre-compute matching hospitals for each specialty (tags overlap).
specialties.forEach(function (s) {
  s.hospitals = hospitals.filter(function (h) {
    return (h.tags || []).some(function (t) { return s.tags.indexOf(t) !== -1; });
  });
});

module.exports = specialties;
