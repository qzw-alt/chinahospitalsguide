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
    <div class="section">
      <h2 class="section-title">🌿 A Letter to You</h2>
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
    <div class="section">
      <h2 class="section-title">📝 Your Action Plan</h2>
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
    <div class="section">
      <h2 class="section-title">❓ Frequently Asked Questions</h2>
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
    <div class="section" id="pricing">
      <h2 class="section-title">🚀 What's Included (Pre-Arrival Coordination · $399)</h2>
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
    <div class="hospital-card">
      ${badge}
      <div class="card-header">
        <div class="card-name">${esc(h.Name_ZH)}</div>
        <div class="card-name-en">${esc(h.Name_EN)}</div>
      </div>
      <div class="one-liner">${esc(oneLiner)}</div>
      <div class="card-details">
        <div class="dl"><span class="dt">Rank</span><span class="dd">${esc(h.Rank||'N/A')}</span></div>
        <div class="dl"><span class="dt">Location</span><span class="dd">${esc(h.City)}${h.District?' · '+esc(h.District):''}</span></div>
        <div class="dl"><span class="dt">Phone</span><span class="dd">${esc(h.Phone||'N/A')}</span></div>
        <div class="dl"><span class="dt">Website</span><span class="dd"><a href="${esc(h.Website)}" target="_blank" rel="noopener">${esc(h.Website)}</a></span></div>
        <div class="dl"><span class="dt">Address</span><span class="dd">${esc(h.Address||'N/A')}</span></div>
        <div class="dl"><span class="dt">Services</span><span class="dd">${intl} ${jci}</span></div>
        <div class="dl"><span class="dt">Airport</span><span class="dd">${esc(h.Airport_Info||'N/A')}</span></div>
        <div class="dl"><span class="dt">Trust Score</span><span class="dd"><span style="color:${tc};font-weight:700;">${trust}%</span></span></div>
      </div>
      ${r.matched_tags.length ? `<div class="tags"><span class="tag">${r.matched_tags.join('</span><span class="tag">')}</span></div>` : ''}
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
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI','PingFang SC','Microsoft YaHei',system-ui,sans-serif;color:#1a1a2e;background:#f0f2f5;line-height:1.7;}
  .report{max-width:960px;margin:0 auto;background:#fff;box-shadow:0 4px 30px rgba(0,0,0,0.08);}
  .hero{background:linear-gradient(135deg,#0a1628 0%,#122647 40%,#1a3a6b 100%);color:#fff;padding:56px 56px 48px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;border:2px solid rgba(255,255,255,0.06);border-radius:50%;}
  .hero::after{content:'';position:absolute;bottom:-60px;left:40%;width:200px;height:200px;border:2px solid rgba(255,255,255,0.04);border-radius:50%;}
  .hero-badge{display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:8px 20px;border-radius:24px;font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;}
  .hero h1{font-size:2.2rem;font-weight:800;line-height:1.35;margin-bottom:12px;position:relative;z-index:1;}
  .hero .hero-sub{font-size:1.05rem;opacity:0.7;font-weight:400;}
  .hero .hero-meta{display:flex;gap:30px;margin-top:28px;flex-wrap:wrap;position:relative;z-index:1;}
  .hero .hero-meta span{font-size:0.85rem;opacity:0.75;}
  .content{padding:48px 56px;}
  .price-section{display:flex;align-items:stretch;gap:0;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.04);margin-bottom:48px;}
  .price-card{flex:1;padding:36px 28px;text-align:center;}
  .price-card.china{background:linear-gradient(135deg,#e8f5e9,#c8e6c9);}
  .price-card.us{background:linear-gradient(135deg,#fff3e0,#ffe0b2);}
  .price-flag{font-size:2rem;margin-bottom:8px;}
  .price-label{font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;color:#666;margin-bottom:10px;}
  .price-value{font-size:1.6rem;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
  .price-note{font-size:0.78rem;color:#888;}
  .price-save{display:flex;align-items:center;justify-content:center;background:#fff;padding:0 16px;min-width:100px;}
  .save-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#e74c3c,#c0392b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.7rem;line-height:1.3;text-align:center;}
  .save-circle strong{font-size:1rem;}
  .section{margin-bottom:48px;}
  .section-title{font-size:1.25rem;font-weight:700;color:#1a3a6b;margin-bottom:24px;padding-bottom:14px;border-bottom:2px solid #e8ecf1;}
  .hospital-card{background:#fff;border:1px solid #e8ecf1;border-radius:16px;padding:28px;margin-bottom:20px;position:relative;transition:box-shadow 0.2s;}
  .hospital-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.06);}
  .top-badge{position:absolute;top:-10px;right:24px;background:linear-gradient(135deg,#1a3a6b,#2a5a9b);color:#fff;padding:4px 16px;border-radius:12px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;}
  .top-badge.alt{background:linear-gradient(135deg,#2d7d46,#3a9d5a);}
  .top-badge.alt2{background:linear-gradient(135deg,#7f6c3d,#a68a4d);}
  .card-header{margin-bottom:8px;}
  .card-name{font-size:1.2rem;font-weight:700;color:#1a1a2e;}
  .card-name-en{font-size:0.82rem;color:#888;margin-top:2px;}
  .one-liner{font-style:italic;color:#666;font-size:0.88rem;margin-bottom:14px;padding-left:12px;border-left:3px solid #2a5a9b;}
  .card-details{display:grid;grid-template-columns:auto 1fr;gap:6px 20px;font-size:0.9rem;}
  .dl{display:contents;}
  .dt{color:#888;white-space:nowrap;}
  .dd{color:#1a1a2e;}
  .dd a{color:#2a5a9b;text-decoration:none;}
  .dd a:hover{text-decoration:underline;}
  .cert{display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.78rem;margin-right:4px;}
  .cert.intl{background:#e3f2fd;color:#1565c0;}
  .cert.jci{background:#e8f5e9;color:#2e7d32;}
  .tags{margin-top:12px;display:flex;flex-wrap:wrap;gap:4px;}
  .tag{background:#e8ecf1;color:#555;padding:2px 10px;border-radius:4px;font-size:0.78rem;}
  .steps{counter-reset:step;}
  .step{position:relative;padding:14px 16px 14px 52px;border-left:3px solid #d1d9e6;margin-bottom:0;}
  .step:last-child{border-color:transparent;}
  .step-num{position:absolute;left:12px;top:12px;width:28px;height:28px;background:#1a3a6b;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;}
  .faq-item{margin-bottom:20px;padding:16px;background:#f8faff;border-radius:10px;}
  .faq-item h3{font-size:0.95rem;color:#1a3a6b;margin-bottom:6px;}
  .faq-item p,.faq-item ul{color:#555;font-size:0.9rem;padding-left:0;}
  .faq-item ul{padding-left:20px;margin-top:6px;}
  .faq-item li{margin-bottom:4px;}
  .tag-green{display:inline-block;background:#d1fae5;color:#065f46;padding:1px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;}
  .price-note-box{background:#f8faff;border-radius:10px;padding:16px;margin-top:16px;font-size:0.9rem;color:#555;}
  .price-note-box p{margin-bottom:6px;}
  .download-section{text-align:center;padding:32px 0 16px;}
  .btn-download{display:inline-block;background:#1a3a6b;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:0.95rem;transition:background 0.2s;}
  .btn-download:hover{background:#0a1628;}
  .disclaimer{background:#fff8e1;border-left:4px solid #ffc107;padding:16px 20px;border-radius:0 8px 8px 0;font-size:0.82rem;color:#856404;margin-top:32px;}
  .report-footer{text-align:center;padding:32px 56px;color:#888;font-size:0.85rem;border-top:1px solid #e8ecf1;}
  .report-footer a{color:#1a3a6b;text-decoration:none;font-weight:600;}
  .toolbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border-bottom:1px solid #e5eaf1;padding:10px 20px;display:flex;justify-content:flex-end;gap:10px;}
  .toolbar button{padding:8px 18px;border-radius:8px;border:1px solid #d1d9e6;background:white;cursor:pointer;font-size:0.85rem;font-weight:500;color:#1e3c72;transition:all 0.2s;}
  .toolbar button:hover{background:#1a3a6b;color:#fff;border-color:#1a3a6b;}
  .toolbar .btn-primary{background:#1a3a6b;color:#fff;border-color:#1a3a6b;}
  .toolbar .btn-primary:hover{background:#0a1628;}
  @media(max-width:640px){
    .hero{padding:36px 24px 32px;}.hero h1{font-size:1.5rem;}
    .content{padding:28px 20px;}
    .price-section{flex-direction:column;}.price-save{padding:16px;}
    .card-details{grid-template-columns:1fr;}
    .report-footer{padding:20px;}
  }
  @media print{body{background:#fff;}.report{box-shadow:none;max-width:100%;}.hero{background:#1a3a6b!important;-webkit-print-color-adjust:exact;}.hospital-card{break-inside:avoid;}.toolbar{display:none;}}
</style>
</head>
<body>
<div class="toolbar" id="toolbar">
  <button onclick="window.print()">🖨️ Print / PDF</button>
  <button class="btn-primary" onclick="downloadTxt()">📥 Download Text Report</button>
</div>
<div class="report">
  <div class="hero">
    ${badgeText}
    <h1>${esc(title)}</h1>
    <div class="hero-sub">Your trusted guide to world-class affordable healthcare in China</div>
    <div class="hero-meta">
      <span>📅 ${dateStr}</span>
      <span>🔍 ${esc(keywords.join(", "))}</span>
      <span>📍 ${esc(city)}</span>
      <span>🏥 ${results.length} hospitals matched</span>
    </div>
  </div>
  <div class="content">
    ${coverHtml}
    ${priceHtml ? '<div class="section"><h2 class="section-title">💰 Cost Comparison</h2>'+priceHtml+'</div>' : ''}
    <div class="section">
      <h2 class="section-title">⭐ Top Recommendations</h2>
      ${cardsHtml}
      ${extraHtml}
    </div>
    ${actionHtml}
    ${serviceHtml}
    ${faqHtml}
    <div class="download-section">
      <p>📥 Download a plain text summary for offline reference</p>
      <a class="btn-download" download="report-${esc(safeTitle)}.txt" href="data:text/plain;charset=utf-8,${encodeURIComponent(textReport)}">⬇ Download Text Report (.txt)</a>
    </div>
    <div class="disclaimer">
      <strong>📋 Important:</strong> Prices are estimates based on typical cases and published data. Actual costs vary by diagnosis, hospital, and individual treatment plan. Contact the hospital directly for a personalized quote. This report is for informational purposes and does not constitute medical advice.
    </div>
  </div>
  <div class="report-footer">
    <p>Generated by <a href="https://chinahospitalsguide.com">ChinaHospitalsGuide.com</a> — Your Gateway to World-Class Affordable Healthcare</p>
    <p style="margin-top:4px;">📧 contact@chinahospitalsguide.com | Data: 51 hospitals · 10 cities</p>
  </div>
</div>
<script>
function downloadTxt(){var c=document.querySelector('.content');var t=c?c.textContent.replace(/\\s+/g,' ').replace(/(\\S[。！?.!])\\s*/g,'$1\\n').trim().split('\\n').filter(function(l){return l.trim().length>0}).map(function(l){return l.trim()}).join('\\n\\n'):'';var b=new Blob([t],{type:'text/plain;charset=utf-8'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=document.title.replace(/[^a-z0-9]/gi,'-')+'.txt';a.click();URL.revokeObjectURL(u);}
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
