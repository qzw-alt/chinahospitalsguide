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
  "神经外科":["neurosurgery","neurology"],"脑肿瘤":["neurosurgery"],"脑血管":["neurosurgery","neurology"],
  "neurosurgery":["neurosurgery","neurology"],"brain":["neurosurgery"],"neuro":["neurosurgery","neurology"],
  "肿瘤":["oncology","cancer-surgery","radiotherapy"],"癌症":["oncology","cancer-surgery","radiotherapy"],
  "放疗":["oncology","radiotherapy"],"质子":["oncology","radiotherapy"],
  "cancer":["oncology","cancer-surgery","radiotherapy"],"tumor":["oncology","cancer-surgery"],
  "oncology":["oncology","cancer-surgery"],"proton":["oncology","radiotherapy"],
  "眼科":["ophthalmology","lasik","cataract"],"白内障":["ophthalmology","cataract"],
  "近视":["ophthalmology","lasik"],"eye":["ophthalmology"],"cataract":["ophthalmology","cataract"],
  "lasik":["ophthalmology","lasik"],
  "ivf":["fertility","maternity"],"试管":["fertility","maternity"],"生殖":["fertility","maternity","obstetrics"],
  "妇产":["maternity","obstetrics","prenatal-diagnosis"],"fertility":["fertility","maternity"],
  "血液":["hematology"],"白血病":["hematology"],"骨髓":["hematology"],
  "blood":["hematology"],"leukemia":["hematology"],"hematology":["hematology"],
  "牙科":["dental","oral-surgery","cosmetic-dental"],"种植牙":["dental","oral-surgery"],
  "口腔":["dental","oral-surgery"],"dental":["dental","oral-surgery"],"teeth":["dental","oral-surgery"],
  "肝":["general"],"肝移植":["general"],"liver":["general"],
  "肾":["kidney-disease"],"肾脏":["kidney-disease"],"kidney":["kidney-disease"],
  "消化":["gastroenterology"],"肠胃":["gastroenterology"],"gastroenterology":["gastroenterology"],
  "呼吸":["respiratory"],"肺":["respiratory"],"respiratory":["respiratory"],"lung":["respiratory"],
  "泌尿":["urology"],"urology":["urology"],
  "儿科":["pediatrics","childrens-health"],"儿童":["pediatrics","childrens-health"],
  "pediatric":["pediatrics","childrens-health"],"child":["pediatrics","childrens-health"],
  "整形":["plastic-surgery"],"plastic":["plastic-surgery"],"cosmetic":["plastic-surgery"],
  "中医":["tcm"],"tcm":["tcm"],
  "老年":["geriatrics"],"geriatric":["geriatrics"],"elderly":["geriatrics"],
  "综合":["general","all-specialties"],"全科":["general","all-specialties"],"体检":["general"],
  "general":["general","all-specialties"],"checkup":["general"],
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
  "心脏瓣膜":{cn:"$18,000 - $30,000",us:"$150,000 - $300,000",save:"80%"},
  "valve":{cn:"$18,000 - $30,000",us:"$150,000 - $300,000",save:"80%"},
  "心脏":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "heart":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "cardiac":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "癌症":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "cancer":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "肿瘤":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "tumor":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "质子":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "proton":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "脑肿瘤":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "brain":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "神经外科":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "neurosurgery":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "ivf":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "试管":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "fertility":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "骨髓移植":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "bone marrow":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "leukemia":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "种植牙":{cn:"¥8,000 - ¥25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "dental":{cn:"¥8,000 - ¥25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "白内障":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "cataract":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "近视":{cn:"$1,000 - $2,000",us:"$4,000+",save:"65%"},
  "lasik":{cn:"$1,000 - $2,000",us:"$4,000+",save:"65%"},
  "肝移植":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "liver":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "肾移植":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
  "kidney":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
  "cart":{cn:"¥1,200,000 左右",us:"$500,000+",save:"60%"},
};

const CITY_MAP = {
  "北京":"Beijing","上海":"Shanghai","广州":"Guangzhou","深圳":"Shenzhen",
  "成都":"Chengdu","杭州":"Hangzhou","天津":"Tianjin","西安":"Xi'an",
  "南京":"Nanjing","济南":"Jinan",
};

// ========== HELPERS ==========
function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

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
    obj.tagsStr=obj.Tags.join(", ");
    return obj;
  });
}

function splitChineseTokens(keywords) {
  const r=[];
  for(const kw of keywords){r.push(kw);if(/^[\u4e00-\u9fff]+$/.test(kw)&&kw.length>=3){for(let i=0;i<=kw.length-2;i++){const sub=kw.substring(i,i+2);if(KEYWORD_TAG_MAP[sub])r.push(sub);}}}
  return [...new Set(r)];
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

// ========== TEXT REPORT ==========
function generateTextReport(results, keywords, city, budget) {
  city=city||"不限"; const priceInfo=findPrice(keywords);
  const now=new Date().toISOString().slice(0,16).replace("T"," ");
  let out="";
  out+="=".repeat(60)+"\n";
  out+="  China Hospitals Guide — 个性化医院推荐报告\n";
  out+="=".repeat(60)+"\n";
  out+="  生成时间: "+now+"\n  关键词: "+keywords.join(", ")+"\n  城市: "+city+"\n";
  if(budget)out+="  预算: "+budget+"\n";
  out+="  匹配: "+results.length+" 家\n\n";
  if(priceInfo){out+="【价格参考】\n  中国: "+priceInfo.cn+"\n  美国: "+priceInfo.us+"\n  节省: "+priceInfo.save+"\n\n";}
  out+="【推荐医院】\n";
  results.forEach((r,i)=>{
    const h=r.hospital;
    out+="\n"+(i+1)+". "+h.Name_ZH+" ("+h.Name_EN+")\n";
    out+="   城市: "+h.City+" | "+h.Rank+"\n";
    out+="   电话: "+h.Phone+"\n";
    out+="   网站: "+h.Website+"\n";
    out+="   地址: "+h.Address+"\n";
  });
  out+="\n"+"=".repeat(60)+"\n";
  out+="  chinahospitalsguide.com | 价格仅供参考\n";
  out+="=".repeat(60)+"\n";
  return out;
}

// ========== HTML REPORT ==========
function generateHtmlReport(results, keywords, city, budget) {
  city=city||"不限"; const priceInfo=findPrice(keywords);
  const dateStr=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const title=keywords.slice(0,3).join(" / ");

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

  const cardsHtml = results.map((r,i)=>{
    const h=r.hospital;
    const trust=Math.round(h.Trust_Score*100);
    const tc=trust>=90?"#27ae60":trust>=80?"#f39c12":"#e74c3c";
    const badge=i===0?'<span class="top-badge">TOP PICK</span>':i===1?'<span class="top-badge alt">RECOMMENDED</span>':'';
    const intl=h.International==="True"?'<span class="cert intl">🌐 International Dept</span>':'';
    const jci=h.JCI==="True"?'<span class="cert jci">✅ JCI Accredited</span>':'';
    const tags=r.matched_tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join("");
    return `
    <div class="hospital-card">
      <div class="card-rank">#${i+1}</div>
      ${badge}
      <div class="card-header">
        <h3>${esc(h.Name_ZH)}</h3>
        <span class="card-en">${esc(h.Name_EN)}</span>
      </div>
      <div class="card-location">📍 ${esc(h.City)} · ${esc(h.District)}</div>
      <div class="card-ranking">🏆 ${esc(h.Rank)}</div>
      <div class="card-certs">${intl} ${jci}</div>
      <div class="card-tags">${tags}</div>
      <table class="card-details">
        <tr><td class="dl">📞 Phone</td><td>${esc(h.Phone)}</td></tr>
        <tr><td class="dl">🌐 Website</td><td><a href="${esc(h.Website)}" target="_blank">${esc(h.Website)}</a></td></tr>
        <tr><td class="dl">📍 Address</td><td>${esc(h.Address)}</td></tr>
        <tr><td class="dl">✈️ Airport</td><td>${esc(h.Airport_Info)}</td></tr>
        <tr><td class="dl">📊 Trust</td><td><span class="trust" style="color:${tc}">${trust}%</span></td></tr>
      </table>
    </div>`;
  }).join("\n");

  const extraHtml = results.length>5 ? `
    <div class="section">
      <h2 class="section-title">📋 Other Options</h2>
      <table class="extra-table">
        <thead><tr><th>#</th><th>Hospital</th><th>City</th><th>Ranking</th></tr></thead>
        <tbody>${results.slice(5).map((r,i)=>`<tr><td>${i+6}</td><td>${esc(r.hospital.Name_ZH)}</td><td>${esc(r.hospital.City)}</td><td>${esc(r.hospital.Rank)}</td></tr>`).join("")}</tbody>
      </table>
    </div>` : "";

  const textReport = generateTextReport(results, keywords, city, budget);
  const textEncoded = Buffer.from(textReport).toString("base64");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — China Hospitals Guide</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI','PingFang SC','Microsoft YaHei',system-ui,sans-serif;color:#1a1a2e;background:#f0f2f5;line-height:1.7;}
  .report{max-width:960px;margin:0 auto;background:#fff;box-shadow:0 4px 30px rgba(0,0,0,0.08);}

  /* Hero */
  .hero{background:linear-gradient(135deg,#0a1628 0%,#122647 40%,#1a3a6b 100%);color:#fff;padding:56px 56px 48px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;border:2px solid rgba(255,255,255,0.06);border-radius:50%;}
  .hero::after{content:'';position:absolute;bottom:-60px;left:40%;width:200px;height:200px;border:2px solid rgba(255,255,255,0.04);border-radius:50%;}
  .hero-badge{display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:8px 20px;border-radius:24px;font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;}
  .hero h1{font-size:2.2rem;font-weight:800;line-height:1.35;margin-bottom:12px;position:relative;z-index:1;}
  .hero .hero-sub{font-size:1.05rem;opacity:0.7;font-weight:400;position:relative;z-index:1;}
  .hero .hero-meta{display:flex;gap:30px;margin-top:28px;flex-wrap:wrap;position:relative;z-index:1;}
  .hero .hero-meta span{font-size:0.85rem;opacity:0.75;}

  /* Content */
  .content{padding:48px 56px;}

  /* Price */
  .price-section{display:flex;align-items:stretch;gap:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.04);margin-bottom:48px;}
  .price-card{flex:1;padding:36px 28px;text-align:center;}
  .price-card.china{background:linear-gradient(135deg,#e8f5e9,#c8e6c9);}
  .price-card.us{background:linear-gradient(135deg,#fff3e0,#ffe0b2);}
  .price-flag{font-size:2rem;margin-bottom:8px;}
  .price-label{font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;color:#666;margin-bottom:10px;}
  .price-value{font-size:1.6rem;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
  .price-note{font-size:0.78rem;color:#888;}
  .price-save{display:flex;align-items:center;justify-content:center;background:#fff;padding:0 16px;min-width:100px;}
  .save-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#e74c3c,#c0392b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.7rem;line-height:1.3;text-align:center;}
  .save-circle strong{font-size:1.1rem;}

  /* Section */
  .section{margin-bottom:48px;}
  .section-title{font-size:1.25rem;font-weight:700;color:#1a3a6b;margin-bottom:24px;padding-bottom:14px;border-bottom:2px solid #e8ecf1;}

  /* Hospital Card */
  .hospital-card{background:#fff;border:1px solid #e8ecf1;border-radius:14px;padding:32px;margin-bottom:20px;position:relative;transition:box-shadow 0.2s;}
  .hospital-card:hover{box-shadow:0 6px 24px rgba(0,0,0,0.07);}
  .card-rank{position:absolute;top:-14px;left:28px;width:36px;height:36px;border-radius:50%;background:#1a3a6b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;}
  .top-badge{position:absolute;top:16px;right:24px;background:#27ae60;color:#fff;padding:4px 14px;border-radius:12px;font-size:0.72rem;font-weight:700;letter-spacing:0.04em;}
  .top-badge.alt{background:#2980b9;}
  .card-header{margin-bottom:6px;}
  .card-header h3{font-size:1.2rem;font-weight:700;color:#1a3a6b;display:inline;}
  .card-en{display:block;font-size:0.8rem;color:#999;margin-top:2px;}
  .card-location{font-size:0.85rem;color:#666;margin-bottom:4px;}
  .card-ranking{font-size:0.85rem;color:#e67e22;font-weight:600;margin-bottom:10px;}
  .card-certs{display:flex;gap:8px;margin-bottom:12px;}
  .cert{font-size:0.72rem;padding:3px 10px;border-radius:4px;font-weight:600;}
  .cert.intl{background:#d5f5e3;color:#1e8449;}
  .cert.jci{background:#fdebd0;color:#b9770e;}
  .card-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
  .tag{background:#eef2ff;color:#3b5998;padding:3px 10px;border-radius:6px;font-size:0.76rem;font-weight:500;}
  .card-details{width:100%;border-collapse:collapse;font-size:0.84rem;}
  .card-details td{padding:6px 4px;border-bottom:1px solid #f5f5f5;vertical-align:top;}
  .card-details .dl{font-weight:600;color:#555;white-space:nowrap;width:120px;}
  .card-details a{color:#1a3a6b;text-decoration:underline;}
  .trust{font-weight:700;}

  /* Extra Table */
  .extra-table{width:100%;border-collapse:collapse;font-size:0.85rem;}
  .extra-table th{text-align:left;padding:12px 16px;background:#f8f9fb;color:#555;font-weight:600;border-bottom:2px solid #e8ecf1;}
  .extra-table td{padding:10px 16px;border-bottom:1px solid #f0f2f5;}
  .extra-table tr:hover td{background:#fafbfc;}

  /* Download */
  .download-section{background:#f8f9fb;border-radius:14px;padding:28px 32px;text-align:center;margin-top:48px;border:1px solid #e8ecf1;}
  .download-section p{font-size:0.9rem;color:#666;margin-bottom:12px;}
  .btn-download{display:inline-block;background:#1a3a6b;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.95rem;transition:background 0.2s;cursor:pointer;border:none;}
  .btn-download:hover{background:#244d8a;}

  /* Footer */
  .report-footer{background:#f8f9fb;border-top:1px solid #e8ecf1;padding:28px 56px;text-align:center;font-size:0.8rem;color:#999;}
  .report-footer a{color:#1a3a6b;text-decoration:none;font-weight:600;}

  .disclaimer{background:#fff8e1;border-left:4px solid #ffc107;padding:16px 20px;border-radius:0 8px 8px 0;font-size:0.82rem;color:#856404;margin-top:32px;}

  @media(max-width:640px){
    .hero{padding:36px 24px 32px;}.hero h1{font-size:1.5rem;}
    .content{padding:28px 20px;}
    .price-section{flex-direction:column;}.price-save{padding:16px;}
    .card-details .dl{width:90px;}
    .report-footer{padding:20px;}
  }
  @media print{body{background:#fff;}.report{box-shadow:none;max-width:100%;}.hero{background:#1a3a6b!important;-webkit-print-color-adjust:exact;}.hospital-card{break-inside:avoid;}}
</style>
</head>
<body>

<div class="report">

  <div class="hero">
    <div class="hero-badge">Personalized Medical Travel Report</div>
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

    ${priceHtml ? '<div class="section"><h2 class="section-title">💰 Cost Comparison</h2>'+priceHtml+'</div>' : ''}

    <div class="section">
      <h2 class="section-title">⭐ Top Recommendations</h2>
      ${cardsHtml}
    </div>

    ${extraHtml}

    <div class="download-section">
      <p>📥 Download the plain text summary for offline reference</p>
      <a class="btn-download" download="report-${esc(keywords.slice(0,3).join("-"))}.txt" href="data:text/plain;charset=utf-8,${encodeURIComponent(textReport)}">⬇ Download Text Report (.txt)</a>
    </div>

    <div class="disclaimer">
      <strong>📋 Important:</strong> Prices are estimates based on typical cases and published data. Actual costs vary by diagnosis, hospital, and individual treatment plan. Contact the hospital directly for a personalized quote. This report is for informational purposes and does not constitute medical advice.
    </div>

  </div>

  <div class="report-footer">
    <p>Generated by <a href="https://chinahospitalsguide.com">ChinaHospitalsGuide.com</a> — Your Gateway to World-Class Affordable Healthcare</p>
    <p style="margin-top:4px;">📧 contact@chinahospitalsguide.com | Data: 51 hospitals · 10 cities · hospital-directory-51.csv</p>
  </div>

</div>

</body>
</html>`;
}

// ========== CLI ==========
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node generate-report.js <keywords> [city]");
  console.log("Examples:");
  console.log('  node generate-report.js "knee replacement" Beijing');
  console.log('  node generate-report.js "心脏搭桥" 上海');
  console.log('  node generate-report.js cancer');
  process.exit(0);
}

const csvPath = path.join(__dirname, "hospital-directory-51.csv");
const hospitals = loadHospitals(csvPath);

let keywords = args[0].replace(/[,，]/g, " ").split(/\s+/).filter(Boolean);
keywords = splitChineseTokens(keywords);

let city = args[1] || null;
if (city) {
  city = CITY_MAP[city] || city;
}

let results = screenHospitals(hospitals, keywords, city);
if (results.length === 0) {
  results = screenHospitals(hospitals, keywords, null, 0.7);
}

if (results.length > 0) {
  const html = generateHtmlReport(results, keywords, city || "不限");
  const safeName = keywords.slice(0,3).join("-").replace(/[\/\\]/g,"-");
  const htmlFile = "report-" + safeName + ".html";
  fs.writeFileSync(path.join(__dirname, htmlFile), html, "utf8");
  console.log("✅ HTML Report: " + htmlFile);
  console.log("   " + results.length + " hospitals matched");
} else {
  console.log("❌ No hospitals found. Try different keywords.");
}
