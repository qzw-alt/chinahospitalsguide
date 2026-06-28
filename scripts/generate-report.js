#!/usr/bin/env node
/**
 * generate-report.js — Integrated Hospital Report Generator
 *
 * Auto-matches hospitals from keywords, generates pricing comparison,
 * and wraps everything in a warm, complete patient report.
 *
 * Usage:
 *   Quick match:     node generate-report.js "knee replacement"
 *   With city:       node generate-report.js "knee replacement" Beijing
 *   Premium report:  node generate-report.js --name "John Smith" --case "knee replacement" --city Beijing
 *   Basic US:        node generate-report.js --name "Maria" --case "knee replacement" --basic
 *
 * Output: reports/report-{name-or-keywords}-{timestamp}.html
 */

const fs = require("fs");
const path = require("path");

// ========== DATA ==========
const KEYWORD_TAG_MAP = {
  "心脏":["cardiology","heart-surgery"],"心血管":["cardiology","heart-surgery"],
  "搭桥":["cardiology","heart-surgery"],"支架":["cardiology"],
  "heart":["cardiology","heart-surgery"],"cardiac":["cardiology","heart-surgery"],
  "bypass":["cardiology","heart-surgery"],"stent":["cardiology"],
  "骨科":["orthopedics","joint-replacement","spine-surgery","sports-medicine"],
  "关节":["orthopedics","joint-replacement"],"膝关节":["orthopedics","joint-replacement"],
  "髋关节":["orthopedics","joint-replacement"],"脊柱":["orthopedics","spine-surgery"],
  "orthopedic":["orthopedics","joint-replacement"],"joint":["orthopedics","joint-replacement"],
  "knee":["orthopedics","joint-replacement"],"hip":["orthopedics","joint-replacement"],
  "spine":["orthopedics","spine-surgery"],
  "神经外科":["neurosurgery","neurology"],"脑":["neurosurgery"],
  "neurosurgery":["neurosurgery","neurology"],"brain":["neurosurgery"],"neuro":["neurosurgery","neurology"],
  "肿瘤":["oncology","cancer-surgery","radiotherapy"],"癌症":["oncology","cancer-surgery","radiotherapy"],
  "cancer":["oncology","cancer-surgery","radiotherapy"],"tumor":["oncology","cancer-surgery"],
  "oncology":["oncology","cancer-surgery"],"proton":["oncology","radiotherapy"],
  "眼科":["ophthalmology","lasik","cataract"],"白内障":["ophthalmology","cataract"],
  "近视":["ophthalmology","lasik"],"eye":["ophthalmology"],"cataract":["ophthalmology","cataract"],
  "lasik":["ophthalmology","lasik"],
  "试管":["fertility","maternity"],"生殖":["fertility","maternity","obstetrics"],
  "ivf":["fertility","maternity"],"fertility":["fertility","maternity"],
  "血液":["hematology"],"白血病":["hematology"],"blood":["hematology"],"leukemia":["hematology"],
  "牙科":["dental","oral-surgery","cosmetic-dental"],"dental":["dental","oral-surgery"],"teeth":["dental","oral-surgery"],
  "肝":["general"],"liver":["general"],
  "肾":["kidney-disease"],"kidney":["kidney-disease"],
  "消化":["gastroenterology"],"肠胃":["gastroenterology"],"gastro":["gastroenterology"],
  "呼吸":["respiratory"],"肺":["respiratory"],"lung":["respiratory"],"respiratory":["respiratory"],
  "泌尿":["urology"],"urology":["urology"],
  "胡桃夹":["thoracic-surgery","general"],"nutcracker":["thoracic-surgery","general"],
  "胸外科":["thoracic-surgery"],"thoracic":["thoracic-surgery"],
  "血管":["cardiology","general"],"vascular":["cardiology","general"],
  "儿科":["pediatrics","childrens-health"],"儿童":["pediatrics","childrens-health"],
  "整形":["plastic-surgery"],"plastic":["plastic-surgery"],"cosmetic":["plastic-surgery"],
  "中医":["tcm"],"tcm":["tcm"],
  "综合":["general","all-specialties"],"全科":["general","all-specialties"],
  "general":["general","all-specialties"],
};

const PRICE_DB = {
  "膝关节置换":{cn:"$8,000 - $12,000",us:"$35,000 - $50,000",save:"70%"},
  "knee":{cn:"$8,000 - $12,000",us:"$35,000 - $50,000",save:"70%"},
  "髋关节置换":{cn:"$9,000 - $14,000",us:"$50,000+",save:"65%"},
  "hip":{cn:"$9,000 - $14,000",us:"$50,000+",save:"65%"},
  "脊柱":{cn:"$12,000 - $25,000",us:"$80,000+",save:"65%"},
  "spine":{cn:"$12,000 - $25,000",us:"$80,000+",save:"65%"},
  "心脏搭桥":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "bypass":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "valve":{cn:"$18,000 - $30,000",us:"$150,000 - $300,000",save:"80%"},
  "心脏":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "heart":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "cardiac":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "癌症":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "cancer":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "肿瘤":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "质子":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "proton":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "脑":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "brain":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "neurosurgery":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "ivf":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "试管":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "fertility":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "骨髓移植":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "bone marrow":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "dental":{cn:"¥8,000 - ¥25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "种植牙":{cn:"¥8,000 - ¥25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "白内障":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "cataract":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "lasik":{cn:"$1,000 - $2,000",us:"$4,000+",save:"65%"},
  "肝移植":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "liver":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "肾移植":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
  "kidney":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
};

const CITY_MAP = {
  "北京":"Beijing","上海":"Shanghai","广州":"Guangzhou","深圳":"Shenzhen",
  "成都":"Chengdu","杭州":"Hangzhou","天津":"Tianjin","西安":"Xi'an",
  "南京":"Nanjing","济南":"Jinan",
};

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;"); }

function parseCSVLine(line) {
  const r=[]; let c="", q=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"')q=!q;else if(ch===','&&!q){r.push(c.trim());c="";}else c+=ch;}
  r.push(c.trim()); return r;
}

function loadHospitals(csvPath) {
  const text = fs.readFileSync(csvPath,"utf-8").replace(/^\uFEFF/,"");
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const cols=parseCSVLine(line);
    const obj={};
    headers.forEach((h,i)=>{obj[h]=(cols[i]||"").trim();});
    obj.Tags=obj.Tags?obj.Tags.split(",").map(t=>t.trim().toLowerCase()):[];
    obj.Trust_Score=parseFloat(obj.Trust_Score)||0;
    return obj;
  });
}

function splitChineseTokens(keywords) {
  const r=[]; for(const kw of keywords){r.push(kw);if(/^[\u4e00-\u9fff]+$/.test(kw)&&kw.length>=3){for(let i=0;i<=kw.length-2;i++){const sub=kw.substring(i,i+2);if(KEYWORD_TAG_MAP[sub])r.push(sub);}}}return [...new Set(r)];
}

function matchTags(keywords, hospitalTags) {
  let score=0; const matched=[];
  for(const kw of keywords){const kl=kw.toLowerCase();if(KEYWORD_TAG_MAP[kl]){for(const tt of KEYWORD_TAG_MAP[kl]){if(hospitalTags.includes(tt)){score+=2;if(!matched.includes(tt))matched.push(tt);}}}if(hospitalTags.includes(kl)){score+=3;if(!matched.includes(kl))matched.push(kl);}}
  return {score,matched};
}

function findPrice(keywords) {
  for(const kw of keywords){const kl=kw.toLowerCase();for(const [pk,pv] of Object.entries(PRICE_DB)){if(kl.includes(pk.toLowerCase())||pk.toLowerCase().includes(kl))return pv;}}
  return null;
}

function screenHospitals(hospitals, keywords, cityFilter=null, minTrust=0.75) {
  const results=[];
  for(const h of hospitals){if(cityFilter&&h.City.toLowerCase()!==cityFilter.toLowerCase())continue;if(h.Trust_Score<minTrust)continue;const {score,matched}=matchTags(keywords,h.Tags);if(score>0)results.push({hospital:h,score,matched_tags:matched});}
  results.sort((a,b)=>(b.score+b.hospital.Trust_Score*2)-(a.score+a.hospital.Trust_Score*2));
  return results;
}

function generateTextReport(results, keywords, city, budget) {
  city=city||"No limit"; const priceInfo=findPrice(keywords);
  const now=new Date().toISOString().slice(0,16).replace("T"," ");
  let out="";
  out+="=".repeat(60)+"\n";
  out+="  China Hospitals Guide — Personalized Hospital Report\n";
  out+="=".repeat(60)+"\n";
  out+="  Generated: "+now+"\n";
  out+="  Condition: "+keywords.join(", ")+"\n";
  out+="  City: "+city+"\n";
  if(budget)out+="  Budget: "+budget+"\n";
  out+="  Matched: "+results.length+" hospitals\n\n";
  if(priceInfo){out+="[PRICE REFERENCE]\n  China: "+priceInfo.cn+"\n  US/UK: "+priceInfo.us+"\n  Save: "+priceInfo.save+"\n\n";}
  out+="[RECOMMENDED HOSPITALS]\n";
  results.forEach((r,i)=>{
    const h=r.hospital;
    out+="\n"+(i+1)+". "+h.Name_ZH+" ("+h.Name_EN+")\n";
    out+="   City: "+h.City+" | "+h.Rank+"\n";
    out+="   Phone: "+h.Phone+"\n";
    out+="   Website: "+h.Website+"\n";
    out+="   Address: "+h.Address+"\n";
  });
  out+="\n"+"=".repeat(60)+"\n";
  out+="  chinahospitalsguide.com | Prices are estimates\n";
  out+="=".repeat(60)+"\n";
  return out;
}

// ========== WARM CONTENT (新增) ==========
function generateCoverLetter(name) {
  if (!name) return '';
  return `
    <div class="card">
      <div class="card-title">🌿 A Letter to You</div>
      <div style="background:#f8faff;border-radius:14px;padding:28px;border:1px solid #e0e8f2;">
        <p>Dear ${esc(name)},</p>
        <p style="margin-top:12px;">Thank you for choosing China Hospitals Guide.</p>
        <p style="margin-top:12px;">We understand that by the time you're reading this, you've been carrying real concerns for months — not just about rankings and numbers, but the honest questions:</p>
        <ul style="margin-top:12px;padding-left:20px;">
          <li><strong>"When I arrive, will someone be there to meet me?"</strong></li>
          <li><strong>"Can I communicate directly with the doctor?"</strong></li>
          <li><strong>"If something goes wrong, who helps me sort it out?"</strong></li>
          <li><strong>"How do I manage weeks in an unfamiliar country?"</strong></li>
        </ul>
        <p style="margin-top:12px;">This report is here to answer those real questions.</p>
        <p style="margin-top:12px;">We've screened China's 51 top hospitals and selected the ones best suited for your condition. Each comes with honest guidance — not just their rank, but what they're like, what to expect, and how to take the next step.</p>
        <p style="margin-top:12px;">If you have any remaining concerns — even small ones, like "is there halal food near the hospital" or "can I get tests done on weekends" — please reach out. We're here to help.</p>
        <p style="margin-top:16px;">Wishing you a smooth recovery,</p>
        <p><strong>China Hospitals Guide Team</strong></p>
      </div>
    </div>`;
}

function generateActionGuide(isPremium) {
  return `
    <div class="card">
      <div class="card-title">📝 Your Action Plan</div>
      <div class="steps">
        <div class="step"><span class="step-num">1</span><strong>Prepare your records</strong><br>Medical summary (1-2 pages), imaging (CT/MRI on USB), blood tests, passport copy</div>
        <div class="step"><span class="step-num">2</span><strong>Contact the hospital</strong><br>Email is best — send records to the international department. Expect 3-7 business days for evaluation.</div>
        <div class="step"><span class="step-num">3</span><strong>Confirm and travel</strong><br>Get the official invitation letter → apply for S-visa → book flights and accommodation</div>
        <div class="step"><span class="step-num">4</span><strong>Arrive and get treated</strong><br>Meet the international coordinator, check in, sign consent forms, begin treatment</div>
        <div class="step"><span class="step-num">5</span><strong>Discharge and follow up</strong><br>Receive bilingual medical summary, medication instructions, and follow-up plan</div>
      </div>
      ${isPremium ? '' : '<p style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px;font-size:0.9rem;">💡 <strong>Need help with the above?</strong> Our Pre-Arrival Coordination service ($399) handles records, translation, appointments, airport pickup, treatment coordination, and discharge support. <a href="#pricing" style="color:#1a3a6b;">Learn more below</a>.</p>'}
    </div>`;
}

function generateFAQ(isPremium) {
  return `
    <div class="card">
      <div class="card-title">❓ Frequently Asked Questions</div>
      <div class="faq-item">
        <h3>Q: I don't speak Chinese. How do I communicate at the hospital?</h3>
        <p>Top Chinese hospitals have bilingual coordinators in their international departments. Many senior doctors have overseas training and speak English. Translation apps can help with day-to-day needs.</p>
      </div>
      <div class="faq-item">
        <h3>Q: How do the costs compare to my home country?</h3>
        <p>See the price comparison section above. In general, patients save 60-80% compared to US/UK prices for equivalent quality at top-tier hospitals.</p>
      </div>
      <div class="faq-item">
        <h3>Q: What if I have complications after returning home?</h3>
        <p>You receive a bilingual medical summary at discharge. ${isPremium ? 'Our service includes remote follow-up coordination so you can stay in touch with your doctor.' : 'Many hospitals offer remote follow-up via WeChat or email.'}</p>
      </div>
      <div class="faq-item">
        <h3>Q: Can I pay with credit card?</h3>
        <p>Most international departments accept Visa/Mastercard. We also recommend downloading Alipay and binding your international card before arrival — China is largely cashless.</p>
      </div>
      <div class="faq-item">
        <h3>Q: Can my family come with me?</h3>
        <p>Yes. 1-2 family members can accompany you. Hotels and short-term apartments are available near all major hospitals.</p>
      </div>
      ${isPremium ? '' : `
      <div class="faq-item">
        <h3>Q: What's the difference between this report and the Premium service?</h3>
        <p>This auto-generated report gives you hospital matches, pricing, and key information — you handle the next steps yourself. The <strong>Pre-Arrival Coordination ($399)</strong> service handles everything: records submission, translation, appointments, airport pickup, treatment coordination, and discharge support.</p>
      </div>
      `}
    </div>`;
}

function generateServiceFlow(isPremium) {
  if (isPremium) {
    return `
    <div class="card" id="pricing">
      <div class="card-title">🚀 What's Included (Pre-Arrival Coordination · $399)</div>
      <p style="margin-bottom:20px;">This Premium service covers your entire journey — from matching to recovery. One flat fee, no surprises.</p>
      <div class="steps">
        <div class="step"><span class="step-num">1</span><strong>Needs Assessment</strong><br>One-on-one consultation + hospital matching + customization</div>
        <div class="step"><span class="step-num">2</span><strong>Hospital Contact</strong><br>We send your records, follow up, translate, compare quotes across hospitals</div>
        <div class="step"><span class="step-num">3</span><strong>Pre-Arrival Planning</strong><br>Visa guidance, appointment booking, accommodation tips<br><span class="tag-green">✅ Airport pickup included</span></div>
        <div class="step"><span class="step-num">4</span><strong>Treatment Period</strong><br>Hospital communication coordination, emergency help<br><span class="tag-green">✅ 24/7 emergency line</span></div>
        <div class="step"><span class="step-num">5</span><strong>Discharge & Follow-Up</strong><br>Medical summary, medication instructions, follow-up handover<br><span class="tag-green">✅ Included</span></div>
      </div>
      <div class="price-note-box">
        <p><strong>💰 Extra services (optional):</strong> Family assistance during stay · Return travel help · Long-term remote follow-up (annual/monthly)</p>
        <p><strong>🏥 Hospital treatment fees</strong> are paid directly to the hospital, not through us.</p>
      </div>
    </div>`;
  }
  return '';
}

function generateOneLiner(name_zh, rank) {
  const rank_lower = (rank || '').toLowerCase();
  if (rank_lower.includes('#1') || rank_lower.includes('top 3')) return 'Top-tier specialized hospital in China';
  if (rank_lower.includes('top')) return 'Highly ranked, strong reputation in this field';
  return 'Well-regarded hospital with relevant expertise';
}

// ========== INTEGRATED HTML REPORT ==========
function generateHtmlReport(results, keywords, city, budget, opts) {
  city=city||"No limit";
  const priceInfo=findPrice(keywords);
  const dateStr=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const title=keywords.slice(0,3).join(" / ");
  const customerName = opts.name || '';
  const isPremium = opts.premium || false;
  const safeTitle = (opts.name || keywords.slice(0,3).join("-")).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');

  const priceHtml = priceInfo ? `
    <div class="price-section">
      <div class="price-card china">
        <div class="price-flag">🇨🇳</div>
        <div class="price-label">China Estimated Cost</div>
        <div class="price-value">${esc(priceInfo.cn)}</div>
        <div class="price-note">World-class hospitals</div>
      </div>
      <div class="price-save">
        <div class="save-circle">Save<br><strong>${esc(priceInfo.save)}</strong></div>
      </div>
      <div class="price-card us">
        <div class="price-flag">🇺🇸</div>
        <div class="price-label">US / UK Typical Cost</div>
        <div class="price-value">${esc(priceInfo.us)}</div>
        <div class="price-note">Comparable quality</div>
      </div>
    </div>` : "";

  const cardsHtml = results.slice(0,5).map((r,i)=>{
    const h=r.hospital;
    const trust=Math.round(h.Trust_Score*100);
    const tc=trust>=90?"#27ae60":trust>=80?"#f39c12":"#e74c3c";
    const badge=i===0?'<span class="top-badge">TOP PICK</span>':i===1?'<span class="top-badge alt">RECOMMENDED</span>':i===2?'<span class="top-badge alt2">ALSO RECOMMENDED</span>':'';
    const intl=h.International==="True"?'<span class="cert intl">🌐 International Dept</span>':'';
    const jci=h.JCI==="True"?'<span class="cert jci">✅ JCI Accredited</span>':'';
    const oneLiner = generateOneLiner(h.Name_ZH, h.Rank);
    return `
    <div class="h-card">
      ${badge}
      <div class="h-name">${esc(h.Name_ZH)}</div>
      <div class="h-name-en">${esc(h.Name_EN)}</div>
      <div class="one-liner">${esc(oneLiner)}</div>
      <div class="dl-grid">
        <span class="dl-key">Rank</span><span class="dl-val">${esc(h.Rank||'N/A')}</span>
        <span class="dl-key">Location</span><span class="dl-val">${esc(h.City)}${h.District?' · '+esc(h.District):''}</span>
        <span class="dl-key">Phone</span><span class="dl-val">${esc(h.Phone||'N/A')}</span>
        <span class="dl-key">Services</span><span class="dl-val">${intl} ${jci}</span>
        <span class="dl-key">Trust Score</span><span class="dl-val"><span style="color:${tc};font-weight:700;">${trust}%</span></span>
      </div>
      ${r.matched_tags.length ? `<div class="h-tags"><span class="h-tag">${r.matched_tags.join('</span><span class="h-tag">')}</span></div>` : ''}
    </div>`;}).join("");

  const extraHtml = results.length > 5 ? `<p style="margin-top:12px;color:#666;">+ ${results.length - 5} more hospitals matched. <a href="#full-list" onclick="document.getElementById('fullList').style.display='block';return false;">Show all</a></p><div id="fullList" style="display:none;">${results.slice(5).map((r,i)=>{const h=r.hospital;return `<p style="padding:4px 0;">${i+6}. ${esc(h.Name_ZH)} — ${esc(h.Rank||'')}</p>`;}).join("")}</div>` : '';

  const textReport = generateTextReport(results, keywords, city);

  const coverHtml = generateCoverLetter(customerName);
  const actionHtml = generateActionGuide(isPremium);
  const serviceHtml = generateServiceFlow(isPremium);
  const faqHtml = generateFAQ(isPremium);

  const titlePrefix = customerName ? `Your Hospital Report — ${esc(customerName)}` : `Medical Report: ${esc(title)}`;
  const badgeText = isPremium ? '<span class="hero-badge" style="background:#f59e0b;color:#1a1a2e;border-color:#f59e0b;">PREMIUM REPORT</span>' : '<span class="hero-badge">PERSONALIZED MEDICAL REPORT</span>';

  return `<!DOCTYPE html><html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(titlePrefix)} — China Hospitals Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root{--primary:#1a3a6b;--secondary:#2a5298;--accent:#e85d5d;--accent-light:#ff8e8e;--text:#2d3748;--text-light:#718096;--bg:#f7fafc;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--text);background:var(--bg);line-height:1.7;}
  .report{max-width:960px;margin:0 auto;}
  .hero{padding:150px 24px 80px;background:linear-gradient(135deg,rgba(12,24,48,0.95),rgba(30,60,114,0.92));color:#fff;text-align:center;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;inset:0;background:url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.06)"/></svg>') repeat;pointer-events:none;}
  .hero-inner{position:relative;z-index:1;max-width:820px;margin:0 auto;}
  .hero-kicker{display:inline-block;margin-bottom:22px;padding:8px 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.28);background:rgba(255,255,255,0.08);font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;}
  .hero h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2rem,5vw,3.6rem);font-weight:700;line-height:1.1;margin-bottom:16px;}
  .hero-sub{font-size:1.05rem;color:rgba(255,255,255,0.8);margin-bottom:32px;max-width:560px;margin-left:auto;margin-right:auto;}
  .hero-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;max-width:640px;margin:0 auto;}
  .hero-stat{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:14px 10px;text-align:center;}
  .hero-stat .stat-label{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.6);margin-bottom:4px;}
  .hero-stat .stat-value{font-size:0.95rem;font-weight:600;color:#fff;}
  .hero-badge{display:none;}
  .content{max-width:820px;margin:-32px auto 0;padding:0 16px 48px;}
  .card{background:#fff;border-radius:18px;padding:32px 28px;margin-bottom:20px;box-shadow:0 4px 16px rgba(15,23,42,0.06);border:1px solid rgba(30,60,114,0.07);}
  .card-title{font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;color:var(--primary);margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #eef2f7;}
  .price-row{display:flex;gap:0;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.04);}
  .price-box{flex:1;padding:28px 20px;text-align:center;}
  .price-box.cn{background:linear-gradient(135deg,#e8f5e9,#c8e6c9);}
  .price-box.us{background:linear-gradient(135deg,#fff3e0,#ffe0b2);}
  .price-flag{font-size:1.8rem;margin-bottom:4px;}
  .price-label{font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;color:#888;margin-bottom:6px;}
  .price-value{font-size:1.4rem;font-weight:800;color:var(--primary);}
  .price-save-wrap{display:flex;align-items:center;justify-content:center;background:#fff;padding:0 12px;min-width:80px;}
  .save-badge{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#c0392b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.65rem;line-height:1.2;text-align:center;}
  .save-badge strong{font-size:0.9rem;display:block;}
  .h-card{background:#fff;border:1px solid #eef2f7;border-radius:16px;padding:24px;margin-bottom:16px;position:relative;transition:box-shadow .15s;}
  .h-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.04);}
  .top-pick{position:absolute;top:-10px;right:20px;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;padding:4px 14px;border-radius:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.04em;}
  .top-pick.alt{background:linear-gradient(135deg,#2d7d46,#3a9d5a);}
  .h-name{font-size:1.05rem;font-weight:700;color:var(--primary);}
  .h-name-en{font-size:0.8rem;color:var(--text-light);margin-bottom:10px;}
  .h-tags{margin:10px 0 0;display:flex;flex-wrap:wrap;gap:4px;}
  .h-tag{background:#eef2f7;color:#555;padding:2px 10px;border-radius:4px;font-size:0.76rem;}
  .badge{display:inline-block;padding:2px 10px;border-radius:4px;font-size:0.76rem;margin:0 2px 2px 0;}
  .badge-intl,.cert.intl{background:#e3f2fd;color:#1565c0;}
  .badge-jci,.cert.jci{background:#e8f5e9;color:#2e7d32;}
  .steps{counter-reset:step;}
  .step{position:relative;padding:14px 16px 14px 52px;border-left:3px solid #d1d9e6;margin-bottom:0;}
  .step:last-child{border-color:transparent;}
  .step-num{position:absolute;left:12px;top:12px;width:28px;height:28px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;}
  .faq-item{padding:16px;margin-bottom:12px;background:#f8faff;border-radius:10px;}
  .faq-item h4{font-size:0.9rem;color:var(--primary);margin-bottom:4px;}
  .faq-item p,.faq-item ul{font-size:0.85rem;color:#555;margin:0;}
  .faq-item ul{padding-left:18px;margin-top:4px;}
  .faq-item li{margin-bottom:2px;}
  .dl-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 18px;font-size:0.88rem;}
  .dl-key{color:var(--text-light);}
  .dl-val{color:var(--text);}
  .dl-val a{color:var(--secondary);text-decoration:none;}
  .tag-inc{display:inline-block;background:#d1fae5;color:#065f46;padding:1px 8px;border-radius:4px;font-size:0.72rem;font-weight:600;}
  .tag-ext{display:inline-block;background:#fef3c7;color:#92400e;padding:1px 8px;border-radius:4px;font-size:0.72rem;font-weight:600;}
  .dl-box{background:#f8faff;border-radius:10px;padding:16px;margin-top:14px;font-size:0.88rem;color:#555;}
  .dl-box p{margin-bottom:6px;}
  .toolbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #e5eaf1;padding:10px 20px;display:flex;justify-content:flex-end;gap:10px;}
  .toolbar button{padding:8px 18px;border-radius:8px;border:1px solid #d1d9e6;background:#fff;cursor:pointer;font-size:0.82rem;font-weight:500;color:var(--primary);transition:all .15s;}
  .toolbar button:hover{background:var(--primary);color:#fff;border-color:var(--primary);}
  .toolbar .btn-primary{background:var(--primary);color:#fff;border-color:var(--primary);}
  .toolbar .btn-primary:hover{background:#0f2a4f;}
  .dload-section{text-align:center;padding:32px 20px 24px;background:#fff;border-radius:18px;box-shadow:0 4px 16px rgba(15,23,42,0.06);border:1px solid rgba(30,60,114,0.07);}
  .dload-section p{color:var(--text-light);font-size:0.88rem;margin-bottom:12px;}
  .btn-dload{display:inline-block;background:var(--primary);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:0.95rem;transition:background .15s;}
  .btn-dload:hover{background:#0f2a4f;}
  .disclaimer{background:#fff8e1;border-left:4px solid #f5a623;padding:14px 18px;border-radius:0 8px 8px 0;font-size:0.8rem;color:#856404;margin-top:20px;}
  .footer{text-align:center;padding:32px 20px;color:var(--text-light);font-size:0.82rem;}
  .footer a{color:var(--primary);text-decoration:none;font-weight:600;}
  .p{margin-bottom:10px;color:var(--text);font-size:0.92rem;}
  .p:last-child{margin-bottom:0;}
  .quote{border-left:3px solid var(--secondary);padding:12px 16px;margin:12px 0;background:#f8faff;border-radius:0 8px 8px 0;font-style:italic;color:#555;font-size:0.9rem;}
  hr{border:none;border-top:1px solid #eef2f7;margin:20px 0;}
  @media(max-width:640px){
    .hero{padding:120px 16px 60px;}
    .hero-inner{padding:0 4px;}
    .hero h1{font-size:1.75rem;}
    .hero-sub{font-size:0.92rem;margin-bottom:24px;}
    .content{padding:0 12px 36px;}
    .card{padding:24px 18px;border-radius:14px;}
    .price-row{flex-direction:column;}
    .price-save-wrap{padding:12px;}
    .dl-grid{grid-template-columns:1fr;}
    .toolbar{justify-content:center;flex-wrap:wrap;}
  }
  @media print{body{background:#fff;}.toolbar{display:none!important;}.hero{-webkit-print-color-adjust:exact;}.h-card{break-inside:avoid;}}
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">🖨️ Print / PDF</button>
  <button class="btn-primary" onclick="downloadTxt()">📥 Download Full Report</button>
</div>
<div class="report">
  <div class="hero">
    <div class="hero-inner">
      <div class="hero-kicker">PERSONALIZED MEDICAL REPORT</div>
      <h1>${esc(customerName ? `Your Medical Travel Report` : `Medical Travel Report: ${esc(title)}`)}</h1>
      <p class="hero-sub">${customerName ? `Personalized report for ${esc(customerName)}` : 'Hospital matching and cost comparison for your condition'}</p>
      <div class="hero-stats">
        ${customerName ? `<div class="hero-stat"><div class="stat-label">PATIENT</div><div class="stat-value">${esc(customerName)}</div></div>` : ''}
        <div class="hero-stat"><div class="stat-label">CONDITION</div><div class="stat-value">${esc(keywords.join(', '))}</div></div>
        ${city && city !== 'No limit' ? `<div class="hero-stat"><div class="stat-label">CITY</div><div class="stat-value">${esc(city)}</div></div>` : ''}
        <div class="hero-stat"><div class="stat-label">MATCHED</div><div class="stat-value">${results.length} hospitals</div></div>
        <div class="hero-stat"><div class="stat-label">REPORT DATE</div><div class="stat-value">${dateStr}</div></div>
      </div>
    </div>
  </div>
  <div class="content">
    <!-- Cover letter -->
    ${coverHtml}

    <!-- Price comparison -->
    ${priceHtml ? `<div class="card"><div class="card-title">💰 Cost Comparison</div>${priceHtml}</div>` : ''}

    <!-- Hospital cards (concise) -->
    <div class="card">
      <div class="card-title">⭐ Top ${Math.min(results.length, 3)} Hospital${results.length !== 1 ? 's' : ''} for Your Condition</div>
      ${cardsHtml}
      ${extraHtml}
      <p style="margin-top:12px;font-size:0.82rem;color:var(--text-light);">📄 <strong>Full details in the downloaded text report</strong> — address, phone, website, airport info for each hospital.</p>
    </div>

    <!-- Action guide -->
    ${actionHtml}

    <!-- Service flow (premium only) -->
    ${serviceHtml}

    <!-- FAQ -->
    ${faqHtml}

    <!-- Download section -->
    <div class="dload-section">
      <p>📥 <strong>Download the complete detailed report</strong> — includes all hospital information, pricing breakdown, step-by-step action plan, and everything you need to prepare for your medical trip to China.</p>
      <a id="dloadBtn" class="btn-dload" href="#" onclick="downloadTxt();return false;">⬇ Download Full Report (.txt)</a>
    </div>

    <div class="disclaimer">
      <strong>📋 Important:</strong> Prices are estimates based on typical cases and published data. Actual costs vary by diagnosis, hospital, and treatment plan. Contact the hospital directly for a personalized quote. This report is for informational purposes and does not constitute medical advice.
    </div>
  </div>
  <div class="footer">
    <p>Generated by <a href="https://chinahospitalsguide.com">ChinaHospitalsGuide.com</a> — Your Gateway to World-Class Affordable Healthcare</p>
    <p style="margin-top:4px;">📧 contact@chinahospitalsguide.com | Data: 51 hospitals · 10 cities</p>
  </div>
</div>
<script>
function downloadTxt(){var c=document.querySelector('.content');if(!c)return;var t='';c.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,div').forEach(function(e){if(e.closest('.toolbar'))return;var txt=e.textContent.trim();if(txt.length>3)t+=txt+'\\n\\n';});var b=new Blob([t.trim()],{type:'text/plain;charset=utf-8'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=document.title.replace(/[^a-z0-9]/gi,'-')+'.txt';a.click();URL.revokeObjectURL(u);}
</script>
</body>
</html>`;
}

// ========== CLI ==========
function parseArgs(argv) {
  const r = { keywords: [], city: null, name: null, premium: false, basic: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--name' && argv[i+1]) { r.name = argv[i+1]; i++; }
    else if (argv[i] === '--case' && argv[i+1]) { r.keywords.push(argv[i+1]); i++; }
    else if (argv[i] === '--city' && argv[i+1]) { r.city = argv[i+1]; i++; }
    else if (argv[i] === '--premium') { r.premium = true; }
    else if (argv[i] === '--basic') { r.basic = true; }
    else if (!argv[i].startsWith('--')) { r.keywords.push(argv[i]); }
  }
  return r;
}

const opts = parseArgs(process.argv.slice(2));
if (opts.keywords.length === 0) {
  console.log("Usage:");
  console.log('  Quick match:   node generate-report.js "knee replacement" [city]');
  console.log('  Premium:       node generate-report.js --name "John" --case "knee replacement" --premium');
  console.log('  Basic:         node generate-report.js --name "Maria" --case "knee replacement" --basic');
  console.log('  Chinese:       node generate-report.js "心脏搭桥" 上海');
  process.exit(0);
}

const csvPath = path.join(__dirname, "..", "data", "hospital-directory-51.csv");
const hospitals = loadHospitals(csvPath);

const joinKeywords = opts.keywords.join(" ");
let keywords = joinKeywords.replace(/[,，]/g, " ").split(/\s+/).filter(Boolean);
keywords = splitChineseTokens(keywords);

let city = opts.city || null;
if (city) { city = CITY_MAP[city] || city; }

let results = screenHospitals(hospitals, keywords, city);
if (results.length === 0) {
  results = screenHospitals(hospitals, keywords, null, 0.7);
}

if (results.length > 0) {
  const isPremium = opts.premium || (opts.name && !opts.basic);
  const reportOpts = { name: opts.name, premium: isPremium };
  const html = generateHtmlReport(results, keywords, city || "No limit", null, reportOpts);
  const safeName = opts.name
    ? opts.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')
    : keywords.slice(0,3).join("-").replace(/[/\\]/g,"-");
  const ts = Date.now();
  const htmlFile = "report-" + safeName + "-" + ts + ".html";
  const outPath = path.join(__dirname, "..", "reports", htmlFile);
  fs.writeFileSync(outPath, html, "utf8");
  console.log("✅ Report generated: reports/" + htmlFile);
  console.log("   " + results.length + " hospitals matched");
  console.log("   Type: " + (opts.name ? (isPremium ? "Premium ($399)" : "Basic ($49)") : "Quick match"));
} else {
  console.log("❌ No hospitals found. Try different keywords.");
}
