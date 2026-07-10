# Content Guide — China Hospitals Guide

> **受众：** AI Agent 或写手  
> **更新：** 2026-07-10  
> **模板基础设施：** Eleventy 2.x + Nunjucks，`_layouts/blog-post.njk` → `_layouts/base.njk`

---

## 一、如何创建新文章

### 文章文件

在 `blog/` 目录创建 `.md` 文件，用 Nunjucks frontmatter：

```markdown
---
layout: blog-post.njk
title: "Heart Bypass Surgery in China 2026: $18K-$45K vs $100K-$200K US"
description: "Cardiac bypass surgery in China: $18K-$45K vs $100K-$200K in the US. Top JCI heart hospitals in Beijing, Shanghai & Guangzhou. 2026 prices, English-speaking surgeons, free case review."
kicker: "Cardiac Surgery Guide"
subtitle: "Complete 2026 guide: costs, top hospitals, and how to arrange CABG surgery in China."
date: 2026-07-10

schema: |
  {
    "@context": "https://schema.org",
    "@type": "Article",
    ...
  }

pageStyle: |
  /* Optional page-specific CSS */
  .my-table { width: 100%; }
---

## How Much Does Heart Bypass Surgery Cost in China?

| | China | US | Singapore |
|---|-------|----|-----------|
| CABG | $18K–$45K | $100K–$200K | $40K–$70K |

## Top Heart Surgery Hospitals in China

### 1. Fuwai Hospital (Beijing)
...
```

### 必填字段

| 字段 | 用途 |
|------|------|
| `layout` | 固定 `blog-post.njk` |
| `title` | `<title>` + `<h1>`，**必须含费用数字** |
| `description` | `<meta name="description">`，≤160 字符 |
| `kicker` | 文章 hero 区顶部标签（如 "Oncology Guide"） |
| `subtitle` | hero 区一句话概述 |
| `date` | `YYYY-MM-DD` |
| `schema` | JSON-LD，**必须含 Article + FAQPage 两套** |

### 选填字段

`canonical`, `ogTitle`, `ogDescription`, `ogType`, `ogImage`, `twitterTitle`, `twitterDescription`, `pageStyle`

---

## 二、内容方向——写什么，不写什么

### 真实患者来源（按搜索量排序）

| 优先级 | 地区 | 最高需求手术 |
|--------|------|------------|
| 🔴 | 东南亚（22%） | 肿瘤、心脏、骨科 |
| 🔴 | 俄罗斯/中亚 | CAR-T、肿瘤、中医 |
| 🟠 | 中东 | CAR-T、高端手术 |
| 🟡 | 非洲 | 复杂手术、性价比 |
| ⚪ | 美欧 | 省钱（量不大） |

### 文章主题优先级

| 优先 | 主题 | 为什么 |
|------|------|--------|
| 🔴 | CAR-T 子专题（淋巴瘤/骨髓瘤/胃癌各一篇） | 最高搜索需求 |
| 🔴 | 肺癌、胃癌、肝癌治疗 | 东南亚+俄罗斯核心需求 |
| 🟠 | 心脏手术（主动脉瓣、二尖瓣、小儿先心） | 高客单价 |
| 🟠 | 膝关节/髋关节置换 | 量大的标准手术 |
| 🟡 | TCM 癌症支持治疗 | 差异化卖点 |
| 🟡 | IVF 费用对比 | 东南亚有搜索量 |

### 不要再写的主题

- 纯整形（不是核心客源）
- 纯牙科城市指南（低流量）
- "为什么选中国医疗旅游"（已有 3 篇泛泛的）
- "X 城市医院排名"（太泛，没人搜）

---

## 三、文章结构规范

### 每篇必须包含 7 要素

1. **标题含费用数字** — `"Procedure Name: $X-$Y China vs $A-$B US"`
2. **费用对比表** — 至少 2 国，HTML `<table>`
3. **3-5 家推荐医院** — 名称、城市、专科排名、国际部信息
4. **FAQ 区**（3-5 问）— 同步输出 FAQPage JSON-LD
5. **转化 CTA**（模板自动包含）
6. **≥2 个内部链接** — 指向 `/treatments/` 或 `/blog/` 其他页面
7. **≥1 个语言页面链接** — `/ru.html` 或 `/ar.html`

### 标题规范

```text
✅ "Heart Bypass Surgery in China 2026: $18K-$45K vs $100K-$200K US"
✅ "CAR-T Therapy in China 2026: 7 Approved Products, Top Hospitals, Complete Guide"
✅ "Knee Replacement in China 2026: $8K-$15K — Save 70% vs US & Singapore"

❌ "Best Eye Hospitals in China for Laser Vision Correction 2026"
   → 用户搜 "lasik cost china"，不是 "best eye hospitals"
❌ "Why Choose China for Medical Tourism"
   → 太泛，没搜索量
```

### H2 结构模板

```markdown
## 1. How Much Does [Procedure] Cost in China? (2026)
## 2. Top [X] Hospitals for [Procedure] in China
## 3. Why China for [Procedure]? (volume, JCI, cost, no waitlists)
## 4. How International Patients Arrange Treatment
## 5. Frequently Asked Questions
```

---

## 四、Schema 输出规范

每篇文章**必须输出两份 JSON-LD**：

### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Title",
  "description": "Your meta description",
  "image": "https://chinahospitalsguide.com/og-image.webp",
  "author": { "@type": "Organization", "name": "China Hospitals Guide" },
  "publisher": { "@type": "Organization", "name": "China Hospitals Guide", "logo": { "@type": "ImageObject", "url": "https://chinahospitalsguide.com/og-image.webp" } },
  "datePublished": "2026-07-10",
  "dateModified": "2026-07-10",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://chinahospitalsguide.com/blog/your-slug.html" }
}
```

### FAQPage Schema（⭐ 抢 Google Featured Snippet）
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does [procedure] cost in China?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Concrete price range], compared to [price] in [country]. Prices are 2026 estimates and include [what's covered]."
      }
    },
    {
      "@type": "Question",
      "name": "Is [procedure] safe in China?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, at JCI-accredited hospitals like [Hospital A] and [Hospital B], which perform [volume] procedures annually with outcomes comparable to international standards. International patient departments provide English-speaking care."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best hospitals in China for [procedure]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Top hospitals: 1) [Hospital A] (city, rank), 2) [Hospital B] (city, rank), 3) [Hospital C] (city, rank). All have international patient departments with English-speaking staff."
      }
    }
  ]
}
```

---

## 五、费用数据基准表

以下数据是文章引用的权威来源。**违反此表的价格数字会被拒绝。**

| 手术 | 中国 | 美国 | 新加坡 | 泰国 |
|------|------|------|--------|------|
| CAR-T（商业产品） | $89K–$151K | $300K–$500K | N/A | N/A |
| CAR-T（临床/公益价） | $30K–$80K | $100K–$200K | N/A | N/A |
| 心脏搭桥 CABG | $18K–$45K | $100K–$200K | $40K–$70K | $15K–$35K |
| 心脏瓣膜置换 | $18K–$40K | $120K–$180K | $45K–$75K | $20K–$40K |
| TAVI/TAVR | $30K–$60K | $150K–$250K | $60K–$90K | $35K–$55K |
| 膝关节置换 | $8K–$15K | $35K–$60K | $20K–$35K | $8K–$18K |
| 髋关节置换 | $10K–$18K | $40K–$70K | $22K–$38K | $9K–$20K |
| 肝移植 | $40K–$80K | $300K–$500K | $150K–$250K | N/A |
| IVF | $3K–$8K | $12K–$25K | $8K–$15K | $4K–$10K |
| LASIK（双眼） | $1.6K–$3K | $4K–$8K | $3K–$6K | $1.5K–$3K |
| 白内障手术（单眼） | $300–$1,200 | $3K–$5K | $2K–$4K | $800–$1,800 |

### 使用规则

- ⚠️ 所有报价标注 "2026 estimates based on published data"
- ⚠️ 不承诺固定价格 — "final cost depends on hospital and clinical complexity"
- ⚠️ 不含旅行/住宿费用

---

## 六、内部链接规则

### 每篇文章必须链接到

| 目标 | 示例 |
|------|------|
| 相关 Treatment 页 | `[CAR-T therapy guide](/treatments/car-t.html)` |
| 相关语言页 | `[Russian-speaking patients](/ru.html)` |
| 相关博文 | `[Read: Heart Surgery Costs](/blog/cardiac-bypass-surgery-china-2026.html)` |

### 禁止

- 链接到竞争分析/内部文档页
- 纯外链替代内链
- 断链

---

## 七、本地化指南

| 语言 | 页面对比国家 | 特殊需求 |
|------|------------|---------|
| 英语（主站） | Singapore、Thailand、US | 默认 |
| 俄语 (`/ru.html`) | Israel、Germany（俄语患者竞争目的地） | Telegram 联系 |
| 阿拉伯语 (`/ar.html`) | UAE、Jordan、Turkey | 清真食品、宗教敏感服务 |

---

## 八、发布检查清单

- [ ] 使用 `blog-post.njk` layout，`.md` 后缀
- [ ] title 含费用数字
- [ ] description ≤160 字符，含价格范围
- [ ] Article Schema + FAQPage Schema
- [ ] 费用对比表 ≥2 国，引用基准表
- [ ] 3-5 家医院 + 国际部信息
- [ ] ≥2 内部链接
- [ ] ≥1 语言页面链接
- [ ] 所有费用标注 "2026 estimates"
- [ ] emoji 用 HTML entities（`&#128300;` 不用 🧬）
- [ ] 不出现虚假统计（"500+ patients"、"98% satisfaction"）

---

## 九、现有 105 篇博文改造优先级

| 页面 | 曝光 | CTR | 状态 |
|------|------|-----|------|
| LASIK | 18K | 0.06% | ✅ 已重写 |
| 医院排名 | 10K | 0.06% | ✅ 已重写 |
| 整形指南 | 4.2K | 0.23% | ✅ 已加 FAQ+CTA |
| 癌症医院 | 2.5K | 0.12% | 🟡 待改 |
| 白内障 | 2.4K | 0.37% | 🟡 待改 |

---

*基于 2026-07-06 深度市场调研 + GSC 数据。每月 review。*
