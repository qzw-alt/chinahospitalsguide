// Condition directory data (batch 3, trimmed).
// 19 high-intent conditions that international patients actually travel to China for —
// chosen by real cross-border demand + China's strengths, not for long-tail SEO coverage.
// Each condition maps to the 56-hospital directory via topHospitals (hospital ids).
const conditions = [
  {
    slug: 'coronary-artery-disease',
    name: 'Coronary Artery Disease (CABG)',
    category: 'cardiology',
    overview: "Coronary artery disease is the narrowing of the heart's arteries by plaque. When blockages are severe, coronary artery bypass grafting (CABG) restores blood flow. China's national cardiovascular centers perform among the world's highest CABG volumes, with surgery typically scheduled within 2–4 weeks.",
    diagnosis: "Diagnosis starts with ECG, echocardiography and coronary CT angiography, confirmed by coronary angiography. Many international patients arrive with existing scans and receive a written second opinion before deciding.",
    treatment: "Options range from medication and stenting (PCI) to open-heart CABG. Fu Wai Hospital performs around 18,000+ cardiac surgeries a year, and both Fu Wai and Anzhen handle complex and high-risk cases.",
    typicalCosts: [
      { procedure: 'Coronary Artery Bypass Grafting (CABG)', price: '$12,000–$18,000', note: 'vs $100,000+ in the US' },
      { procedure: 'Coronary CT angiography (diagnostic)', price: 'from $180', note: 'same-day scheduling' }
    ],
    topHospitals: ['fuwai-hospital', 'anzhen-hospital', 'zhongshan-hospital-shanghai', 'guangdong-provincial-peoples-hospital'],
    faq: [
      { q: 'How much does heart bypass surgery cost in China?', a: 'Coronary artery bypass grafting typically runs $12,000–$18,000 in China versus $100,000+ in the US. The final price depends on the hospital, surgeon and your clinical complexity.' },
      { q: 'How long do I wait for heart surgery in China?', a: 'Elective cardiac surgery is often scheduled within 2–4 weeks of consultation at China\'s national cardiovascular centers, compared with months-long waits in several Western systems. Timing is confirmed per case.' }
    ]
  },
  {
    slug: 'heart-valve-disease',
    name: 'Heart Valve Disease',
    category: 'cardiology',
    overview: "Heart valve disease occurs when one or more of the heart's valves no longer opens or closes properly. Valve repair and replacement are core strengths of China's top cardiac centers, which perform high volumes with excellent outcomes.",
    diagnosis: "Echocardiography is the primary diagnostic tool, often with cardiac MRI or catheterization for complex cases. A coordinated echocardiogram and specialist consult can usually be arranged within days.",
    treatment: "Treatment includes valve repair, mechanical or biological valve replacement, and increasingly minimally invasive and transcatheter (TAVR) approaches. Fu Wai and Anzhen lead valve surgery volumes nationally.",
    typicalCosts: [
      { procedure: 'Heart valve replacement', price: '$10,000–$15,000', note: 'vs $80,000–$120,000 in the US' }
    ],
    topHospitals: ['fuwai-hospital', 'anzhen-hospital', 'zhongshan-hospital-shanghai'],
    faq: [
      { q: 'Which hospital is best for valve surgery in China?', a: 'Fu Wai Hospital and Anzhen Hospital in Beijing lead China in heart valve surgery volume, and Zhongshan Hospital in Shanghai is a top southern cardiac center.' },
      { q: 'How much does valve replacement cost in China?', a: 'Heart valve replacement typically runs $10,000–$15,000 in China, versus $80,000–$120,000 in the US. The final quote depends on valve type and surgical approach.' }
    ]
  },
  {
    slug: 'lung-cancer',
    name: 'Lung Cancer',
    category: 'oncology',
    overview: "Lung cancer is among the most common cancers worldwide. China's top cancer centers offer surgery, radiotherapy, targeted therapy, immunotherapy and clinical trials, with access to newer agents often before broad Western availability.",
    diagnosis: "Diagnosis combines low-dose CT, PET-CT, biopsy and molecular profiling. A coordinated CT or PET-CT can usually be arranged within 24–48 hours.",
    treatment: "Treatment depends on stage and mutation status: surgery for early disease, plus radiotherapy, chemotherapy, targeted therapy and immunotherapy. The First Affiliated Hospital of Guangzhou Medical University hosts China's national respiratory disease research center.",
    typicalCosts: [
      { procedure: 'Lung cancer treatment', price: '$8,000–$20,000', note: 'varies by stage and protocol' }
    ],
    topHospitals: ['cams-cancer-hospital', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'tianjin-medical-university-cancer', 'first-affiliated-guangzhou-medical'],
    faq: [
      { q: 'Which hospital is best for lung cancer in China?', a: 'The Cancer Hospital of CAMS in Beijing is China\'s #1 oncology center, and Sun Yat-sen University Cancer Center in Guangzhou is a top-3 national cancer hospital. Both offer surgery, radiotherapy and targeted therapy.' },
      { q: 'How much does lung cancer treatment cost in China?', a: 'Treatment typically ranges $8,000–$20,000 depending on stage, surgery vs systemic therapy, and drug choice. A case review with your pathology report gives a realistic estimate.' }
    ]
  },
  {
    slug: 'breast-cancer',
    name: 'Breast Cancer',
    category: 'oncology',
    overview: "Breast cancer treatment in China is delivered at high volumes with outcomes comparable to Western centers, combining surgery, radiotherapy, chemotherapy, hormone therapy and targeted agents.",
    diagnosis: "Diagnosis uses mammography, ultrasound, MRI and core biopsy, with hormone-receptor and HER2 testing to guide treatment.",
    treatment: "Treatment spans lumpectomy or mastectomy, sentinel-node biopsy, radiation and systemic therapy. Fudan Women's Hospital adds a dedicated women's oncology program.",
    typicalCosts: [
      { procedure: 'Breast cancer treatment', price: '$8,000–$20,000', note: 'varies by stage' }
    ],
    topHospitals: ['cams-cancer-hospital', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'fudan-womens-hospital'],
    faq: [
      { q: 'Which hospital is best for breast cancer in China?', a: 'The Cancer Hospital of CAMS (Beijing) and Sun Yat-sen University Cancer Center (Guangzhou) are China\'s leading oncology centers for breast cancer, with Fudan Women\'s Hospital a strong specialist option in Shanghai.' },
      { q: 'How much does breast cancer treatment cost in China?', a: 'Treatment typically ranges $8,000–$20,000 depending on stage, surgery type and whether chemotherapy or targeted therapy is needed. Final quotes are confirmed per case.' }
    ]
  },
  {
    slug: 'liver-cancer',
    name: 'Liver Cancer',
    category: 'oncology',
    overview: "Liver cancer (hepatocellular carcinoma) is common in Asia, giving Chinese centers unmatched case volume. Treatments include surgery, ablation, TACE, targeted therapy, immunotherapy and transplant.",
    diagnosis: "Diagnosis combines ultrasound, CT/MRI, AFP tumor marker and biopsy. Contrast-enhanced imaging at a Grade 3A center is often available within days.",
    treatment: "Options include resection, radiofrequency or microwave ablation, transarterial chemoembolization (TACE), targeted therapy and immunotherapy. Fuda Cancer Hospital specializes in ablation technologies including NanoKnife.",
    typicalCosts: [
      { procedure: 'Liver cancer treatment', price: '$8,000–$20,000', note: 'varies by stage' }
    ],
    topHospitals: ['zhongshan-hospital-shanghai', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'fuda-cancer-hospital'],
    faq: [
      { q: 'Which hospital is best for liver cancer in China?', a: 'Zhongshan Hospital in Shanghai and Sun Yat-sen University Cancer Center in Guangzhou are top centers for liver cancer surgery, while Fuda Cancer Hospital offers advanced ablation such as NanoKnife.' },
      { q: 'What treatments are available for liver cancer in China?', a: 'China offers the full range — resection, ablation, TACE, targeted therapy, immunotherapy and liver transplant — often at a fraction of Western self-pay cost.' }
    ]
  },
  {
    slug: 'stomach-cancer',
    name: 'Stomach (Gastric) Cancer',
    category: 'oncology',
    overview: "Stomach cancer is highly prevalent in East Asia, giving Chinese surgical teams among the world's largest case volumes and refined techniques, including laparoscopic and robotic gastrectomy.",
    diagnosis: "Diagnosis uses gastroscopy with biopsy, endoscopic ultrasound and staging CT/PET-CT. Gastroscopy can usually be scheduled quickly at Grade 3A centers.",
    treatment: "Treatment combines surgery (partial or total gastrectomy), chemotherapy and sometimes radiotherapy. China is also a global leader in CAR-T and immunotherapy trials for gastric cancer.",
    typicalCosts: [
      { procedure: 'Stomach cancer treatment', price: '$8,000–$20,000', note: 'varies by stage' }
    ],
    topHospitals: ['cams-cancer-hospital', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'renji-hospital'],
    faq: [
      { q: 'Which hospital is best for stomach cancer in China?', a: 'The Cancer Hospital of CAMS and Sun Yat-sen University Cancer Center lead gastric cancer surgery in China, and Renji Hospital in Shanghai is a strong digestive-disease center.' },
      { q: 'How much does stomach cancer surgery cost in China?', a: 'Gastric cancer surgery and treatment typically range $8,000–$20,000 depending on stage and approach. A case review with your endoscopy and pathology report gives a realistic estimate.' }
    ]
  },
  {
    slug: 'colorectal-cancer',
    name: 'Colorectal Cancer',
    category: 'oncology',
    overview: "Colorectal cancer is one of China's most commonly diagnosed cancers, and its high-volume centres have refined both colon and rectal surgery accordingly. For locally advanced rectal cancer, neoadjuvant chemoradiotherapy followed by surgery is standard, and specialist centres assess whether the sphincter can be preserved or whether an abdominoperineal resection with a permanent stoma is required.",
    diagnosis: "Diagnosis uses colonoscopy with biopsy, staging by CT of the chest, abdomen and pelvis, pelvic MRI for rectal tumours, and PET-CT when indicated. Molecular testing covers MMR/MSI status and RAS/BRAF mutations, which guide targeted and immunotherapy decisions.",
    treatment: "Treatment depends on the site and stage. Colon cancer is usually treated with colectomy; rectal cancer commonly receives neoadjuvant chemoradiotherapy before surgery. Very low tumours may need abdominoperineal resection with a permanent stoma, while sphincter-preserving resection is possible in selected cases. Systemic options include FOLFOX or FOLFIRI chemotherapy, anti-EGFR agents such as cetuximab for RAS wild-type tumours, bevacizumab, and immunotherapy for MSI-high or dMMR disease.",
    typicalCosts: [
      { procedure: 'Colorectal cancer treatment', price: '$8,000–$20,000', note: 'varies by stage and protocol' }
    ],
    topHospitals: ['cams-cancer-hospital', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'zhongshan-hospital-shanghai'],
    faq: [
      { q: 'Which hospitals are best for colorectal cancer in China?', a: 'The Cancer Hospital of CAMS (Beijing) and Sun Yat-sen University Cancer Center (Guangzhou) are China\'s leading oncology centres, and Fudan University Shanghai Cancer Center has one of the country\'s strongest colorectal surgery departments. Zhongshan Hospital in Shanghai is a leading digestive-disease centre.' },
      { q: 'Can rectal cancer be treated without a permanent stoma in China?', a: 'Sometimes. Whether the sphincter can be preserved depends on tumour height, how the tumour responded to chemoradiotherapy, and pelvic anatomy — assessed from your MRI and endoscopy by a high-volume centre. Where preservation is not possible, a permanent stoma (abdominoperineal resection) may be required for a curative operation. The decision is made per patient after specialist review.' },
      { q: 'How much does colorectal cancer treatment cost in China?', a: 'Colorectal cancer treatment typically ranges $8,000–$20,000 depending on stage, whether surgery, chemoradiotherapy or systemic therapy is needed, and drug choice. A case review with your pathology and imaging gives a realistic estimate.' }
    ]
  },
  {
    slug: 'brain-tumor',
    name: 'Brain Tumor',
    category: 'neurosurgery',
    overview: "Brain tumor surgery is one of China's strongest specialties. Tiantan Hospital in Beijing is China's #1 neurosurgery center and among the world's highest-volume brain surgery hospitals, handling complex tumor, vascular and skull-base cases.",
    diagnosis: "Diagnosis uses MRI (often with contrast and advanced sequences), CT and, when needed, biopsy. A coordinated 3.0T MRI can usually be arranged within 24–48 hours.",
    treatment: "Treatment spans microsurgical resection, radiosurgery (Gamma Knife), radiotherapy and, for some tumors, targeted therapy. Awake craniotomy and intraoperative MRI are available at leading centers.",
    typicalCosts: [
      { procedure: 'Brain tumor surgery', price: 'case-specific', note: 'second opinion from $149' }
    ],
    topHospitals: ['tiantan-hospital', 'huashan-hospital'],
    faq: [
      { q: 'Which hospital is best for brain tumor surgery in China?', a: 'Tiantan Hospital in Beijing is China\'s #1 neurosurgery center and a world leader in brain tumor surgery. Huashan Hospital in Shanghai is #2 nationally and excels in cerebrovascular and functional neurosurgery.' },
      { q: 'How much does brain tumor surgery cost in China?', a: 'Brain tumor surgery is priced per case based on tumor location, complexity and approach. Start with a written second opinion from $149 to get a realistic plan and cost estimate.' }
    ]
  },
  {
    slug: 'knee-replacement',
    name: 'Knee Replacement',
    category: 'orthopedics',
    overview: "Total knee replacement is one of the highest-value procedures for international patients in China. Jishuitan Hospital is China's #1 orthopedic center, performing high volumes with imported implant brands at a fraction of Western pricing.",
    diagnosis: "Diagnosis uses weight-bearing X-rays, MRI and clinical assessment. Surgery is usually scheduled within a few weeks of consultation.",
    treatment: "Treatment is total knee arthroplasty (TKA) with the implant brand (domestic vs imported) as the main cost driver. Several weeks of assisted recovery follow a 7–10 day hospital stay.",
    typicalCosts: [
      { procedure: 'Knee replacement', price: '$8,000–$12,000', note: 'vs $35,000–$50,000 in the US' }
    ],
    topHospitals: ['jishuitan-hospital', 'shanghai-sixth-hospital', 'pku-third-hospital', 'tangdu-hospital'],
    faq: [
      { q: 'How much does a knee replacement cost in China?', a: 'A total knee replacement typically runs $8,000–$12,000 in China versus $35,000–$50,000 in the US. Price depends mainly on the implant brand and hospital.' },
      { q: 'Which hospital is best for knee replacement in China?', a: 'Jishuitan Hospital in Beijing is China\'s #1 orthopedics hospital and leading joint replacement center. Shanghai Sixth Hospital is a strong #2.' }
    ]
  },
  {
    slug: 'hip-replacement',
    name: 'Hip Replacement',
    category: 'orthopedics',
    overview: "Total hip replacement in China offers imported implant brands and high surgical volumes at a fraction of Western self-pay cost. Leading centers perform thousands of hip arthroplasties annually.",
    diagnosis: "Diagnosis uses X-rays, MRI and clinical assessment. A second opinion from your existing imaging can be arranged without travel.",
    treatment: "Treatment is total hip arthroplasty (THA), with implant brand and hospital level as the main cost drivers.",
    typicalCosts: [
      { procedure: 'Hip replacement', price: '$8,000–$12,000', note: 'vs $40,000+ in the US' }
    ],
    topHospitals: ['jishuitan-hospital', 'shanghai-sixth-hospital', 'pku-third-hospital', 'west-china-hospital'],
    faq: [
      { q: 'How much does a hip replacement cost in China?', a: 'A total hip replacement typically runs $8,000–$12,000 in China. Price depends mainly on implant brand and hospital level.' },
      { q: 'Which hospital is best for hip replacement in China?', a: 'Jishuitan Hospital and Shanghai Sixth Hospital lead hip replacement volumes in China, with Peking University Third Hospital and West China Hospital as strong alternatives.' }
    ]
  },
  {
    slug: 'spine-surgery',
    name: 'Spine Surgery & Disc Herniation',
    category: 'orthopedics',
    overview: "Spine surgery — from lumbar fusion and decompression to spinal deformity correction — is a core strength of China's top orthopedic centers, which perform high volumes with modern minimally invasive techniques.",
    diagnosis: "Diagnosis uses MRI, CT and X-rays. A coordinated spine MRI can usually be arranged within 24–48 hours, with a specialist review.",
    treatment: "Treatment ranges from conservative care and injection to microdiscectomy, fusion and deformity surgery. Cost varies widely by procedure type and implant hardware.",
    typicalCosts: [
      { procedure: 'Spine surgery', price: '$10,000–$18,000', note: 'varies by procedure' }
    ],
    topHospitals: ['jishuitan-hospital', 'pku-third-hospital', 'shanghai-changhai-hospital', 'west-china-hospital'],
    faq: [
      { q: 'How much does spine surgery cost in China?', a: 'Spine surgery typically runs $10,000–$18,000 depending on the procedure and implant hardware, versus $40,000+ in the US.' },
      { q: 'Which hospital is best for spine surgery in China?', a: 'Jishuitan Hospital is China\'s leading spine surgery center, with Peking University Third Hospital and Shanghai Changhai Hospital as strong referral centers.' }
    ]
  },
  {
    slug: 'parkinsons-disease',
    name: 'Parkinson\'s Disease & DBS',
    category: 'neurology',
    overview: "China's leading neurology centers offer advanced Parkinson's care, including deep brain stimulation (DBS) surgery at high volumes for medication-resistant symptoms.",
    diagnosis: "Diagnosis is clinical, supported by MRI and, in some cases, dopamine-transporter imaging (DaTscan).",
    treatment: "Treatment spans medication optimization and deep brain stimulation (DBS) for advanced cases. China's top centers perform high DBS volumes.",
    typicalCosts: [
      { procedure: 'Deep brain stimulation (DBS)', price: 'case-specific', note: 'quote after case review' }
    ],
    topHospitals: ['tiantan-hospital', 'huashan-hospital', 'xijing-hospital'],
    faq: [
      { q: 'Can I get DBS for Parkinson\'s in China?', a: 'Yes. Tiantan and Huashan hospitals perform high volumes of deep brain stimulation for Parkinson\'s disease and other movement disorders.' },
      { q: 'How much does DBS surgery cost in China?', a: 'DBS is priced per case (device plus surgery) and is typically well below Western self-pay rates. A case review gives a realistic estimate for your situation.' }
    ]
  },
  {
    slug: 'epilepsy',
    name: 'Epilepsy',
    category: 'neurology',
    overview: "For drug-resistant epilepsy, China's top centers offer comprehensive evaluation and epilepsy surgery, including resective surgery and neuromodulation.",
    diagnosis: "Diagnosis uses EEG, video-EEG monitoring and high-resolution MRI to localize seizure onset.",
    treatment: "Treatment ranges from medication to epilepsy surgery (resection or VNS/DBS) for drug-resistant cases.",
    typicalCosts: [
      { procedure: 'Epilepsy surgery', price: 'case-specific', note: 'second opinion from $149' }
    ],
    topHospitals: ['tiantan-hospital', 'huashan-hospital'],
    faq: [
      { q: 'Which hospital is best for epilepsy surgery in China?', a: 'Tiantan Hospital and Huashan Hospital are China\'s leading centers for epilepsy evaluation and surgery.' },
      { q: 'Can I get a second opinion on epilepsy surgery in China?', a: 'Yes. A written second opinion from a Grade 3A neurosurgery consultant is available from $149, delivered in about 4–7 business days without travel.' }
    ]
  },
  {
    slug: 'ivf',
    name: 'IVF & Fertility Treatment',
    category: 'obgyn',
    overview: "China's top fertility centers, led by Peking University Third Hospital, perform among the highest IVF volumes in Asia, with success rates comparable to leading Western clinics at a fraction of the cost.",
    diagnosis: "Diagnosis includes ovarian reserve testing (AMH, FSH), semen analysis, ultrasound and, when needed, genetic screening.",
    treatment: "Treatment spans ovulation induction, IUI, IVF/ICSI, egg freezing and PGT genetic testing. A full cycle is typically $3,000–$8,000.",
    typicalCosts: [
      { procedure: 'IVF cycle', price: '$3,000–$8,000', note: 'vs $15,000–$25,000 in the US' }
    ],
    topHospitals: ['pku-third-hospital', 'fudan-womens-hospital', 'zhejiang-womens-hospital', 'sir-run-run-shaw-hospital'],
    faq: [
      { q: 'How much does IVF cost in China?', a: 'An IVF cycle typically runs $3,000–$8,000 in China, versus $15,000–$25,000 in the US. Final cost depends on protocol and medication.' },
      { q: 'Which hospital is best for IVF in China?', a: 'Peking University Third Hospital in Beijing is China\'s #1 fertility center. Fudan Women\'s Hospital and Zhejiang Women\'s Hospital are top alternatives in the east.' }
    ]
  },
  {
    slug: 'lasik',
    name: 'LASIK & Vision Correction',
    category: 'ophthalmology',
    overview: "China's top eye centers perform among the world's highest LASIK volumes. Beijing Tongren Hospital is China's #1 ophthalmology hospital, and Zhongshan Ophthalmic Center performs 20,000+ refractive surgeries a year.",
    diagnosis: "Diagnosis includes corneal topography, pachymetry and refraction to confirm candidacy.",
    treatment: "Treatment includes LASIK, SMILE and other laser vision correction techniques, typically as a same-day outpatient procedure.",
    typicalCosts: [
      { procedure: 'LASIK (both eyes)', price: '$1,200–$2,800', note: 'vs $4,000+ in the US' }
    ],
    topHospitals: ['beijing-tongren-hospital', 'aier-eye-hospital', 'tianjin-eye-hospital', 'zhongshan-sixth-hospital'],
    faq: [
      { q: 'How much does LASIK cost in China?', a: 'LASIK typically runs $1,200–$2,800 for both eyes in China, versus $4,000+ in the US. Price depends on the hospital and laser platform.' },
      { q: 'Which hospital is best for LASIK in China?', a: 'Beijing Tongren Hospital is China\'s #1 ophthalmology hospital. Zhongshan Ophthalmic Center in Guangzhou performs 20,000+ refractive surgeries a year.' }
    ]
  },
  {
    slug: 'cataract',
    name: 'Cataract Surgery',
    category: 'ophthalmology',
    overview: "Cataract surgery is one of the most common procedures in China, delivered at very high volume with modern phacoemulsification and premium lens options.",
    diagnosis: "Diagnosis uses slit-lamp examination, refraction and retinal evaluation.",
    treatment: "Treatment is phacoemulsification with intraocular lens (IOL) implant — the lens type (monofocal vs multifocal/toric) drives the final price.",
    typicalCosts: [
      { procedure: 'Cataract surgery', price: '$800–$1,500', note: 'per eye; premium IOLs more' }
    ],
    topHospitals: ['beijing-tongren-hospital', 'zhongshan-sixth-hospital', 'tianjin-eye-hospital'],
    faq: [
      { q: 'How much does cataract surgery cost in China?', a: 'Cataract surgery typically runs $800–$1,500 per eye in China, with premium lenses costing more.' },
      { q: 'Which hospital is best for cataract surgery in China?', a: 'Beijing Tongren Hospital and Zhongshan Ophthalmic Center in Guangzhou are top cataract centers, with Tianjin Eye Hospital a strong northern option.' }
    ]
  },
  {
    slug: 'dental-implants',
    name: 'Dental Implants',
    category: 'dental',
    overview: "Dental implants in China are delivered at high volume with imported implant brands at a fraction of Western pricing. Shanghai and Guangzhou dental hospitals are national leaders.",
    diagnosis: "Evaluation includes panoramic X-ray or CBCT to assess bone quality and plan implant placement.",
    treatment: "Treatment includes implant placement, abutment and crown, with options like All-on-4 for full-arch restoration.",
    typicalCosts: [
      { procedure: 'Dental implant', price: '$800–$2,500', note: 'vs $3,000–$6,000 in the US' }
    ],
    topHospitals: ['shanghai-dental-hospital', 'guangzhou-dental-hospital'],
    faq: [
      { q: 'How much do dental implants cost in China?', a: 'Dental implants typically run $800–$2,500 in China, versus $3,000–$6,000 in the US, depending on the implant brand and clinic.' },
      { q: 'Which hospital is best for dental implants in China?', a: 'Shanghai Jiao Tong University Dental Hospital and Guangzhou Dental Hospital are China\'s leading dental centers for implants and oral surgery.' }
    ]
  },
  {
    slug: 'car-t-therapy',
    name: 'CAR-T Cell Therapy',
    category: 'oncology',
    overview: "China's NMPA has approved seven CAR-T therapies — more than the United States or Europe — including satri-cel, the world's first CAR-T approved for a solid tumor. Approved products cover lymphoma, leukemia and multiple myeloma, with active trial access for other targets.",
    diagnosis: "Eligibility depends on the cancer type, how many prior lines of treatment have failed, organ function and the target antigen on the tumor. CD19, BCMA and Claudin18.2 status are confirmed by pathology review before anything else.",
    treatment: "CAR-T involves leukapheresis, a two-to-four-week manufacturing window, lymphodepleting chemotherapy and infusion, followed by roughly ten to fourteen days of inpatient monitoring. China offers both approved products and clinical-trial access to experimental targets.",
    typicalCosts: [
      { procedure: 'Approved CD19 or BCMA CAR-T', price: '$89,000–$170,000', note: 'drug plus the full treatment course; quoted per case' },
      { procedure: 'Satri-cel (Claudin18.2, gastric / GEJ)', price: '$89,000–$170,000', note: "world's first approved solid-tumor CAR-T" },
      { procedure: 'Clinical trial participation', price: '≈$30,000–$80,000', note: 'varies by trial; some costs covered' }
    ],
    topHospitals: ['cams-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'sun-yat-sen-cancer-hospital', 'pku-peoples-hospital', 'fosun-chancheng-hospital', 'west-china-lecheng-hospital'],
    faq: [
      { q: 'Which hospital offers CAR-T therapy in China?', a: 'Leading centres include the Cancer Hospital of CAMS and Peking University People\'s Hospital (Beijing), Fudan University Shanghai Cancer Center, Sun Yat-sen University Cancer Center (Guangzhou), and West China Lecheng Hospital in the Hainan Lecheng zone. Foshan Fosun Chancheng Hospital lists CAR-T among its oncology services. A case review confirms which of these can take your case.' },
      { q: 'How much does CAR-T therapy cost in China?', a: 'Reference ranges: approved CD19 or BCMA CAR-T runs roughly $89,000–$170,000 for the drug plus the full course, and clinical trial participation typically $30,000–$80,000. Confirm whether a quote includes tocilizumab, ICU standby and the full monitoring period, which are sometimes billed separately.' },
      { q: 'Is CAR-T a cure?', a: 'No. CAR-T has produced durable remissions in some blood cancers, but it is not a cure and it is not suitable for everyone. Response figures are reported at group level, and the treatment carries real risks including cytokine release syndrome and neurological toxicity.' }
    ]
  },
  {
    slug: 'heart-failure',
    name: 'Advanced Heart Failure',
    category: 'cardiology',
    overview: "Advanced and refractory heart failure — low ejection fraction (EF ≤ 35%) with symptoms that persist despite optimal medication — can be treated with device therapy, structural and coronary correction, and mechanical support. China's national cardiovascular centers offer the full pathway: CRT, ICD, CCM, CABG and valve intervention, LVAD and heart transplant, typically scheduled within 2–4 weeks.",
    diagnosis: "Diagnosis begins with a multidisciplinary (MDT) review of the underlying cause — ischaemic, valvular, electrical dyssynchrony (LBBB or widened QRS), congenital, or cardiomyopathy. ECG, echocardiography, cardiac MRI and coronary angiography are used to determine the cause before a treatment path is chosen.",
    treatment: "Treatment spans the full advanced heart-failure pathway: cardiac resynchronization therapy (CRT-P/CRT-D) and ICD (single, dual or subcutaneous), cardiac contractility modulation (CCM), coronary stenting or bypass, valve repair and replacement (TAVR/TEER), and for refractory cases, LVAD and heart transplant.",
    typicalCosts: [
      { procedure: 'Coronary artery bypass grafting (CABG)', price: '$12,000–$18,000', note: 'vs $100,000+ in the US' },
      { procedure: 'Heart valve replacement / TAVR', price: '$10,000–$15,000', note: 'vs $80,000–$120,000 in the US' },
      { procedure: 'CRT-D (cardiac resynchronization defibrillator)', price: '≈$20,600', note: 'CNY 148,000' },
      { procedure: 'ICD (single / dual chamber)', price: '≈$13,750 / ≈$16,400', note: 'CNY 99,000 / 118,000' },
      { procedure: 'CCM (cardiac contractility modulation)', price: '≈$27,500', note: 'CNY 198,000' },
      { procedure: 'LVAD (left ventricular assist device)', price: '≈$123,600', note: 'CNY 890,000' },
      { procedure: 'Heart transplant', price: 'case-specific', note: 'quote after case review' }
    ],
    topHospitals: ['fosun-chancheng-hospital', 'fuwai-hospital', 'anzhen-hospital', 'zhongshan-hospital-shanghai', 'guangdong-provincial-peoples-hospital', 'xijing-hospital'],
    faq: [
      { q: 'Which hospital is best for advanced heart failure in China?', a: 'Foshan Fosun Chancheng Hospital is a JCI-accredited, Grade III Class A hospital with a dedicated international medical center and multilingual, halal-friendly care — a strong choice for Southeast Asian patients. Fu Wai Hospital (Beijing) is China\'s #1 cardiology center with 18,000+ cardiac surgeries a year, and Anzhen (Beijing), Zhongshan (Shanghai) and Xijing (Xi\'an) are leading advanced heart-failure and transplant centers.' },
      { q: 'How much does CRT or ICD cost in China?', a: 'Reference prices: CRT-D about $20,600, single-chamber ICD about $13,750, dual-chamber ICD about $16,400, CCM about $27,500 and LVAD about $123,600. CABG runs $12,000–$18,000 and valve replacement $10,000–$15,000. The final quote depends on the specific device and your clinical complexity.' },
      { q: 'How long do I wait for heart failure treatment in China?', a: 'Elective procedures are often scheduled within 2–4 weeks of a multidisciplinary review at China\'s national cardiovascular centers. Timing is confirmed per case after your records are assessed.' }
    ]
  },
  {
    slug: 'cervical-cancer',
    name: 'Cervical Cancer',
    category: 'oncology',
    overview: "Cervical cancer treatment in China is delivered at high volume, with radiotherapy and image-guided brachytherapy planned as a scheduled course rather than a waiting list. Early-stage disease is treated surgically; locally advanced disease follows the international standard of concurrent chemoradiation. International departments at China's national cancer centres review records and quote per case.",
    diagnosis: "Staging uses pelvic examination, colposcopy and biopsy, followed by MRI of the pelvis and PET-CT to assess tumour size and parametrial or lymph-node involvement. The stage at diagnosis determines whether surgery or chemoradiation is the right first treatment.",
    treatment: "Early-stage disease is treated with radical hysterectomy with lymph-node assessment, or fertility-sparing trachelectomy in selected cases. Locally advanced disease follows concurrent chemoradiation — external-beam radiotherapy with weekly cisplatin, followed by image-guided brachytherapy. Recurrent or metastatic disease is treated with systemic therapy: chemotherapy, bevacizumab, or immunotherapy.",
    typicalCosts: [
      { procedure: 'Staging workup (pelvic MRI + PET-CT)', price: '$1,200–$2,200', note: 'before a treatment plan is set' },
      { procedure: 'Radical hysterectomy (early stage)', price: '$6,000–$12,000', note: 'vs $30,000+ in the US' },
      { procedure: 'Concurrent chemoradiation + brachytherapy (full course)', price: '$12,000–$20,000', note: 'standard for locally advanced disease' },
      { procedure: 'Systemic therapy (chemotherapy / bevacizumab / immunotherapy)', price: '$1,000–$3,000', note: 'per cycle; varies by regimen' }
    ],
    topHospitals: ['cams-cancer-hospital', 'sun-yat-sen-cancer-hospital', 'fudan-university-shanghai-cancer-center', 'tianjin-medical-university-cancer', 'fudan-womens-hospital'],
    faq: [
      { q: 'Which hospital is best for cervical cancer in China?', a: "The Cancer Hospital of CAMS (Beijing), Sun Yat-sen University Cancer Center (Guangzhou), Fudan University Shanghai Cancer Center and Tianjin Medical University Cancer Institute all provide external-beam radiotherapy and image-guided brachytherapy as part of a planned course. Fudan University Women's Hospital is a dedicated women's centre in Shanghai. A case review confirms which of these fits your stage and timing." },
      { q: 'How much does cervical cancer treatment cost in China?', a: 'Reference ranges: staging workup $1,200–$2,200, radical hysterectomy $6,000–$12,000 for early-stage disease, and a full course of concurrent chemoradiation with brachytherapy $12,000–$20,000. Systemic therapy runs $1,000–$3,000 per cycle depending on the regimen. Your final quote depends on stage and the plan chosen.' },
      { q: 'How quickly can cervical cancer treatment start in China?', a: 'Records can be reviewed before you travel, and treatment is typically scheduled within 2–4 weeks once a plan is agreed. For locally advanced disease the chemoradiation course itself runs about 5–6 weeks. Timing is confirmed for your case after the records are assessed.' }
    ]
  },
  {
    slug: 'stroke-rehab',
    name: 'Stroke Rehabilitation',
    category: 'neurology',
    overview: "Stroke care in China covers both ends of the pathway: acute intervention at national neurology and neurosurgery centres, and the rehabilitation phase at hospitals that combine modern physiotherapy with traditional Chinese medicine. Patients who travel after the acute event are usually seeking the second half — a structured rehabilitation programme with functional goals, which is where the TCM-integrated model differs from what most Western programmes offer.",
    diagnosis: "Acute assessment uses CT and CT angiography to exclude haemorrhage and locate the blocked vessel, with MRI and diffusion-weighted imaging for smaller or posterior-circulation strokes. Severity is scored on the NIH Stroke Scale. Rehabilitation assessment maps motor function, swallowing, speech and independence in daily activities.",
    treatment: "Acute treatment includes intravenous thrombolysis and mechanical thrombectomy within the treatment window, aneurysm clipping or coiling for haemorrhagic stroke, decompressive surgery where swelling is life-threatening, and revascularisation such as extracranial-intracranial bypass in selected cases. The rehabilitation phase combines physiotherapy, occupational and speech therapy with acupuncture and Chinese herbal medicine, delivered as an inpatient programme with measurable function goals.",
    typicalCosts: [
      { procedure: 'Mechanical thrombectomy (acute)', price: '$10,000–$20,000', note: 'within the treatment window' },
      { procedure: 'Aneurysm clipping or coiling', price: '$12,000–$25,000', note: 'haemorrhagic stroke' },
      { procedure: 'Extracranial-intracranial (EC-IC) bypass', price: '$15,000–$25,000', note: 'selected cases only' },
      { procedure: 'Inpatient rehabilitation programme', price: '$3,000–$7,000', note: 'per month, including therapy and TCM' }
    ],
    topHospitals: ['tiantan-hospital', 'huashan-hospital', 'xijing-hospital', 'zhujiang-hospital', 'dongzhimen-hospital', 'shanghai-shuguang-hospital', 'first-affiliated-guangzhou-tcm'],
    faq: [
      { q: 'Which hospitals in China treat stroke?', a: "For acute intervention, Tiantan Hospital (Beijing) and Huashan Hospital (Shanghai) are China's leading neurology and neurosurgery centres, with Xijing (Xi'an) and Zhujiang (Guangzhou) also performing high-volume neurovascular work. For the rehabilitation phase, Dongzhimen Hospital (Beijing) combines a neurology department with traditional Chinese medicine, and Shuguang Hospital (Shanghai) and the First Affiliated Hospital of Guangzhou University of Chinese Medicine are established TCM centres." },
      { q: 'How much does stroke rehabilitation cost in China?', a: 'Reference ranges: mechanical thrombectomy $10,000–$20,000 in the acute phase, aneurysm clipping or coiling $12,000–$25,000, and an inpatient rehabilitation programme about $3,000–$7,000 per month including therapy. Your final quote depends on the intervention needed and how long you stay.' },
      { q: 'How long should rehabilitation continue?', a: 'Most functional recovery happens in the first three to six months after a stroke, which is why starting early matters. Rehabilitation is planned as a block of weeks with a function goal attached, and the length of stay is set per case after assessment. We confirm the recommended duration for your case before you travel.' }
    ]
  }
];

// Pre-compute matching hospital objects for each condition (from topHospitals ids),
// so the template can iterate condition.hospitals directly (same pattern as specialties.js).
// SEO titles: match the exact "X Cost in China" phrases patients actually search
// (Google autocomplete), rather than deriving from `name` — which can be verbose
// ("Coronary Artery Disease (CABG)", "IVF & Fertility Treatment") or awkward as a
// "… Cost in China" phrase ("Epilepsy Cost in China").
const seoTitleMap = {
  'coronary-artery-disease': 'Heart Bypass Surgery (CABG) Cost in China 2026',
  'heart-valve-disease': 'Heart Valve Replacement Cost in China 2026',
  'lung-cancer': 'Lung Cancer Treatment Cost in China 2026',
  'breast-cancer': 'Breast Cancer Treatment Cost in China 2026',
  'liver-cancer': 'Liver Cancer Treatment Cost in China 2026',
  'stomach-cancer': 'Stomach Cancer Treatment Cost in China 2026',
  'brain-tumor': 'Brain Tumor Surgery in China 2026',
  'knee-replacement': 'Knee Replacement Cost in China 2026',
  'hip-replacement': 'Hip Replacement Cost in China 2026',
  'spine-surgery': 'Spine Surgery Cost in China 2026',
  'parkinsons-disease': "Parkinson's Disease Treatment & DBS in China 2026",
  'epilepsy': 'Epilepsy Surgery in China 2026',
  'ivf': 'IVF Cost in China 2026',
  'lasik': 'LASIK Eye Surgery Cost in China 2026',
  'cataract': 'Cataract Surgery Cost in China 2026',
  'dental-implants': 'Dental Implants Cost in China 2026',
  'car-t-therapy': 'CAR-T Cell Therapy Cost in China 2026',
  'heart-failure': 'Advanced Heart Failure Treatment in China 2026',
  'colorectal-cancer': 'Colorectal Cancer Treatment Cost in China 2026',
  'cervical-cancer': 'Cervical Cancer Treatment Cost in China 2026',
  'stroke-rehab': 'Stroke Treatment & Rehabilitation in China 2026'
};

const hospitals = require('./hospitals.js');
const byId = {};
hospitals.forEach(function (h) { byId[h.id] = h; });
conditions.forEach(function (c) {
  c.seoTitle = seoTitleMap[c.slug] || (c.name + ' Cost in China 2026');
  c.hospitals = (c.topHospitals || []).map(function (id) { return byId[id]; }).filter(Boolean);
});

module.exports = conditions;
