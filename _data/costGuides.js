// Cost guide data for diagnostic imaging in China (batch 4).
// Each guide breaks pricing into three layers: public hospital self-pay fee,
// coordinated price (hospital fee + our coordination), and Western self-pay.
// Prices are reference ranges from published 2026 cost comparisons; final
// quotes are confirmed per case before travel.

const costGuides = [
  {
    slug: "mri-scan-china-cost",
    name: "MRI Scan Cost in China",
    modality: "MRI",
    intro: "A 3.0T MRI at a Grade 3A hospital, scheduled in days — not months — with a certified English report and DICOM files, for a fraction of Western self-pay prices.",
    overview: "Magnetic resonance imaging (MRI) produces detailed cross-sectional images of soft tissue, joints, the brain and the spine without radiation. It is the reference exam for neurology, orthopedics, and many oncology and cardiac follow-ups. In China's top-tier teaching hospitals, 3.0T (and increasingly 5.0T research-grade) scanners are standard equipment, and radiologists at high-volume centers read thousands of studies a year.",
    whyChina: "In Canada, the median wait for an MRI is about 13 weeks (Fraser Institute, 2023), and NHS patients in the UK routinely wait weeks. At our partner Grade 3A hospitals in China, an MRI is typically scheduled within 24–48 hours of booking — with English reports and DICOM files your home doctor can review.",
    publicFee: "$70–110",
    publicFeeNote: "Self-pay hospital fee for a single-region 3.0T MRI at a public Grade 3A hospital, paid directly to the hospital.",
    coordinatedFee: "from $150",
    coordinatedIncludes: "Hospital fee + coordination: bilingual escort through registration and scan, certified English report, and DICOM files on a USB or secure link.",
    western: { us: "$1,200–3,000", uk: "£350–750", note: "Commonly quoted self-pay / private ranges; vary by provider and region." },
    waitTime: { china: "24–48 hours", western: "~13 weeks (Canada) · weeks (NHS)" },
    hospitals: [
      { name: "Beijing Tiantan Hospital", note: "Neurosurgery & neuro-imaging — China's #1 neurosurgery center" },
      { name: "Xuanwu Hospital", note: "Neurology & neuro-imaging — national MS, Parkinson's & dementia center" },
      { name: "PUMCH", note: "Complex & rare diagnosis — China's top-ranked general hospital" },
      { name: "Jishuitan Hospital", note: "Orthopedics — advanced musculoskeletal imaging" }
    ],
    faq: [
      { q: "How much does an MRI cost in China?", a: "A self-pay single-region 3.0T MRI at a public Grade 3A hospital typically costs $70–110 in hospital fees. A coordinated MRI with English report and DICOM files starts from about $150. In the US, a self-pay MRI often runs $1,200–3,000." },
      { q: "How fast can a foreigner get an MRI in China?", a: "At our partner Grade 3A hospitals, an MRI is usually scheduled within 24–48 hours — compared with a median of about 13 weeks in Canada (Fraser Institute 2023). Timing is confirmed per case before you travel." },
      { q: "Do I need a referral or special visa for an MRI in China?", a: "No referral is required. For most diagnostic and outpatient appointments, a standard tourist (L) visa is sufficient — you need only your passport for registration." },
      { q: "Will my home doctor accept the Chinese MRI report?", a: "Our English reports follow international documentation standards and include ICD-10 codes and DICOM imaging files, so your home doctor can review them. Acceptance depends on the doctor and institution, but clearly formatted reports with DICOM files are widely reviewable." }
    ],
    ctaSource: "cost-guide-mri"
  },
  {
    slug: "ct-scan-china-cost",
    name: "CT Scan Cost in China",
    modality: "CT",
    intro: "A CT scan at a Grade 3A hospital — often same-day scheduling — with certified English report and DICOM files, for a fraction of Western self-pay prices.",
    overview: "Computed tomography (CT) uses X-rays to build cross-sectional images of the chest, abdomen, pelvis, and — with contrast — the vascular system (CT angiography). It is the first-line exam for many oncology, trauma, and cardiology questions. China's high-volume centers run 256-slice and dual-source scanners, and coronary CT angiography is available at dedicated cardiac hospitals.",
    whyChina: "Western patients often wait days to weeks for a CT. At our partner Grade 3A hospitals, a CT is typically scheduled the same day or next day — with an English report and DICOM files delivered within 24–48 hours.",
    publicFee: "$35–55",
    publicFeeNote: "Self-pay hospital fee for a single-region CT (non-contrast) at a public Grade 3A hospital, paid directly to the hospital.",
    coordinatedFee: "from $180",
    coordinatedIncludes: "Hospital fee + coordination: bilingual escort, contrast when indicated, certified English report, and DICOM files.",
    western: { us: "$800–2,500", uk: "£300–600", note: "Commonly quoted self-pay / private ranges; vary by provider and region." },
    waitTime: { china: "Same day", western: "Days to weeks" },
    hospitals: [
      { name: "Fu Wai Hospital", note: "Cardiology — cardiac MRI & CT coronary angiography" },
      { name: "PUMCH", note: "Complex & rare diagnosis — China's top-ranked general hospital" },
      { name: "Beijing Tiantan Hospital", note: "Neuro CT — stroke and neurovascular imaging" }
    ],
    faq: [
      { q: "How much does a CT scan cost in China?", a: "A self-pay single-region CT (non-contrast) at a public Grade 3A hospital typically costs $35–55. A coordinated CT with English report and DICOM files starts from about $180. In the US, a self-pay CT often runs $800–2,500." },
      { q: "How fast can I get a CT scan in China?", a: "At our partner Grade 3A hospitals, a CT is typically scheduled the same day or next day, with the English report and DICOM files delivered within 24–48 hours." },
      { q: "Can I get a coronary CT angiogram in China?", a: "Yes. Coronary CT angiography is available at dedicated cardiac centers such as Fu Wai Hospital, and we can coordinate this exam alongside a cardiology consultation." }
    ],
    ctaSource: "cost-guide-ct"
  },
  {
    slug: "pet-ct-china-cost",
    name: "PET-CT Scan Cost in China",
    modality: "PET-CT",
    intro: "Whole-body PET-CT for cancer staging and surveillance, scheduled in days with a certified English report — at roughly a third of US self-pay prices.",
    overview: "Positron emission tomography–computed tomography (PET-CT) combines a metabolic tracer (usually FDG) with CT to locate active disease across the whole body. It is a core tool for cancer staging, recurrence surveillance, and treatment-response assessment. China's large oncology centers operate the latest-generation PET-CT and PET-MR scanners and report high volumes.",
    whyChina: "In the US, a self-pay PET-CT often costs $2,000–5,000 and can take a week or more to schedule. At our partner Grade 3A oncology centers in China, whole-body PET-CT is typically scheduled within 1–3 days, with the English report delivered shortly after.",
    publicFee: "$345–485",
    publicFeeNote: "Self-pay hospital fee for whole-body FDG PET-CT at a public Grade 3A hospital, paid directly to the hospital.",
    coordinatedFee: "from $650",
    coordinatedIncludes: "Hospital fee + coordination: bilingual escort, tracer handling, certified English report, and DICOM files.",
    western: { us: "$2,000–5,000", uk: "£1,000–2,000", note: "Commonly quoted self-pay / private ranges; vary by provider and region." },
    waitTime: { china: "1–3 days", western: "1–2 weeks (US)" },
    hospitals: [
      { name: "PUMCH", note: "Complex & rare diagnosis — China's top-ranked general hospital" },
      { name: "Fudan University Shanghai Cancer Center", note: "Oncology — high-volume PET-CT for staging and surveillance" },
      { name: "Cancer Hospital, Chinese Academy of Medical Sciences", note: "Oncology — national cancer center" }
    ],
    faq: [
      { q: "How much does a PET-CT scan cost in China?", a: "A self-pay whole-body FDG PET-CT at a public Grade 3A hospital typically costs $345–485 in hospital fees. A coordinated PET-CT with English report and DICOM files starts from about $650. In the US, a self-pay PET-CT often runs $2,000–5,000." },
      { q: "How fast can I get a PET-CT scan in China?", a: "At our partner Grade 3A oncology centers, whole-body PET-CT is typically scheduled within 1–3 days, with the English report delivered shortly after the scan." },
      { q: "Do I need a referral for a PET-CT in China?", a: "No referral is required, but we review your history first so the right tracer and protocol are ordered — and so we can tell you honestly whether PET-CT is the right exam for your case." }
    ],
    ctaSource: "cost-guide-petct"
  },
  {
    slug: "spine-mri-china-cost",
    name: "Spine MRI Cost in China",
    modality: "Spine MRI",
    intro: "A dedicated spine MRI at an orthopedic-focused Grade 3A hospital — scheduled in days, read by surgeons who operate on spines every day, for a fraction of Western self-pay prices.",
    overview: "A spine MRI images the cervical, thoracic, or lumbar segments and is the key exam for disc herniation, spinal stenosis, spondylolisthesis, and spinal cord compression. Getting it read by a spine surgeon — not just a general radiologist — is what changes the diagnosis into a surgical plan.",
    whyChina: "China's high-volume orthopedic centers perform tens of thousands of spine procedures a year, and their radiologists and surgeons read spine MRIs at a scale most Western centers cannot match. At a center like Jishuitan Hospital, a spine MRI is typically scheduled within 24–48 hours.",
    publicFee: "$80–120",
    publicFeeNote: "Self-pay hospital fee for a single-segment spine MRI (e.g. lumbar) at a public Grade 3A hospital, paid directly to the hospital.",
    coordinatedFee: "from $150",
    coordinatedIncludes: "Hospital fee + coordination: bilingual escort, certified English report, and DICOM files — plus a surgeon-reviewed read when you request one.",
    western: { us: "$1,500–3,500", uk: "£400–800", note: "Commonly quoted self-pay / private ranges; vary by provider and region." },
    waitTime: { china: "24–48 hours", western: "~13 weeks (Canada) · weeks (NHS)" },
    hospitals: [
      { name: "Jishuitan Hospital", note: "Orthopedics — 40,000+ orthopedic surgeries a year, advanced spine imaging" },
      { name: "Peking University Third Hospital", note: "Orthopedics / Spine — referral spine surgery center" },
      { name: "Shanghai Changhai Hospital", note: "Orthopedics / Spine — high-volume spine center" }
    ],
    faq: [
      { q: "How much does a spine MRI cost in China?", a: "A self-pay single-segment spine MRI (e.g. lumbar) at a public Grade 3A hospital typically costs $80–120. A coordinated spine MRI with English report and DICOM files starts from about $150. In the US, a self-pay spine MRI often runs $1,500–3,500." },
      { q: "Should I get my spine MRI read by a surgeon or a radiologist?", a: "For surgical decision-making, a surgeon-reviewed read matters most. We can arrange a coordinated spine MRI where the study is read alongside a spine surgeon's consultation, so you leave with a diagnosis and a plan — not just images." },
      { q: "Which hospital is best for a spine MRI in China?", a: "Jishuitan Hospital in Beijing and Peking University Third Hospital are among China's top orthopedic and spine centers, and both read high volumes of spine MRIs daily." }
    ],
    ctaSource: "cost-guide-spine-mri"
  },
  {
    slug: "brain-mri-china-cost",
    name: "Brain MRI Cost in China",
    modality: "Brain MRI",
    intro: "A dedicated brain MRI at a national neuroscience center — scheduled in days, read by neurospecialists who see complex brain cases daily, for a fraction of Western self-pay prices.",
    overview: "A brain MRI is the reference exam for tumors, stroke, MS, epilepsy, Parkinson's, and unexplained neurological symptoms. Where it is read changes what it tells you: a neuro-oncologist, a neurosurgeon, and a movement-disorder specialist may each interpret the same scan through a different lens.",
    whyChina: "China's national neuroscience centers — Beijing Tiantan (neurosurgery) and Xuanwu (neurology) — are among the highest-volume brain centers in the world. A brain MRI is typically scheduled within 24–48 hours, and the study can be read in the context of a same-trip specialist consultation.",
    publicFee: "$80–120",
    publicFeeNote: "Self-pay hospital fee for a brain MRI (with or without contrast) at a public Grade 3A hospital, paid directly to the hospital.",
    coordinatedFee: "from $150",
    coordinatedIncludes: "Hospital fee + coordination: bilingual escort, certified English report, and DICOM files — plus a neurosurgical or neurological consult when you request one.",
    western: { us: "$1,500–3,500", uk: "£400–800", note: "Commonly quoted self-pay / private ranges; vary by provider and region." },
    waitTime: { china: "24–48 hours", western: "~13 weeks (Canada) · weeks (NHS)" },
    hospitals: [
      { name: "Beijing Tiantan Hospital", note: "Neurosurgery & neuro-imaging — China's #1 neurosurgery center" },
      { name: "Xuanwu Hospital", note: "Neurology & neuro-imaging — national MS, Parkinson's & dementia center" },
      { name: "Huashan Hospital", note: "Neurosurgery — Shanghai's leading neuroscience center" }
    ],
    faq: [
      { q: "How much does a brain MRI cost in China?", a: "A self-pay brain MRI at a public Grade 3A hospital typically costs $80–120. A coordinated brain MRI with English report and DICOM files starts from about $150. In the US, a self-pay brain MRI often runs $1,500–3,500." },
      { q: "Which hospital is best for a brain MRI in China?", a: "Beijing Tiantan Hospital (neurosurgery) and Xuanwu Hospital (neurology) are China's leading neuroscience centers, and Huashan Hospital leads in Shanghai. We route you to the center that matches your suspected condition." },
      { q: "Can I combine a brain MRI with a specialist consultation?", a: "Yes. We routinely coordinate a brain MRI together with a same-trip consult with a neurosurgeon, neurologist, or movement-disorder specialist, so you leave with images and an expert read." }
    ],
    ctaSource: "cost-guide-brain-mri"
  }
];

module.exports = costGuides;
