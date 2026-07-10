# Content Guide for China Hospitals Guide — Blog Article Generator

> **受众:** AI Agent 或人类写手
> **目的:** 生成符合 SEO 目标、品牌一致、可复用模板的新文章
> **更新:** 2026-07-10

---

## 一、模板选择

所有新文章**必须**使用 `_layouts/blog-post.njk` 模板（继承 `_layouts/base.njk`），禁止手写完整 HTML。用 `.md` 后缀创建文章。

### 新文章文件格式

在 `blog/` 目录创建 `.md` 文件，使用 Nunjucks frontmatter：

```markdown
---
layout: blog-post.njk
title: "LASIK Eye Surgery in China 2026: Costs, Best Hospitals & Complete Guide"
description: "LASIK surgery costs $800-$1,500 per eye in China vs $3,000+ in the US. Top 10 eye hospitals, full cost breakdown, and how to arrange treatment."
kicker: "Eye Surgery Guide"
subtitle: "Complete 2026 guide for international patients: costs, hospitals, technologies, and how to book."
date: 2026-07-10

schema: |
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "LASIK Eye Surgery in China 2026",
    ...
  }
  </script>

pageStyle: |
  /* Optional: page-specific CSS. Leave empty to use styles.css defaults */
---

Your article content in Markdown or HTML goes here.
```

### 关键 Field 说明

| Field | 必填 | 说明 |
|-------|------|------|
| `layout` | ✅ | 固定 `blog-post.njk` |
| `title` | ✅ | `<title>` 和 `<h1>`，**必须包含费用数字** |
| `description` | ✅ | `<meta description>`，160 字以内，含价格范围 |
| `kicker` | ✅ | 文章页 hero 区顶部的分类标签（如 "Oncology Guide"） |
| `subtitle` | ✅ | hero 区一句话概述 |
| `date` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `canonical` | 选填 | 覆盖默认 canonical URL |
| `ogTitle` | 选填 | OG 标题（默认与 title 相同） |
| `ogDescription` | 选填 | OG 描述（默认与 description 相同） |
| `schema` | 选填 | JSON-LD schema 块，**新文章必须含 Article + FAQPage** |
| `pageStyle` | 选填 | 页面专属 CSS |

---

## 二、内容方向（基于市场调研）

### 核心患者画像

调研确认的**真实患者来源**（按优先级）：

| 排名 | 地区 | 份额 | 主要需求 |
|------|------|------|---------|
| 1 | 🇮🇩🇻🇳🇲🇾 **东南亚** | ~22% | 肿瘤、心脏、骨科 |
| 2 | 🇷🇺🇰🇿🇺🇿 **俄罗斯/中亚** | 高 | CAR-T、肿瘤、中医 |
| 3 | 🇸🇦🇦🇪🇯🇴 **中东** | 中 | 高端手术、CAR-T |
| 4 | 🇳🇬🇰🇪 **非洲** | 中 | 复杂手术、性价比 |
| 5 | 🇺🇸🇬🇧 **美欧** | 低 | 省钱 50-80%（之前的主打，实际量不大） |

### 最高需求手术类型

| 手术 | 搜索量 | 网站现有覆盖 | 行动 |
|------|--------|------------|------|
| **CAR-T 细胞疗法** | 极高 | ✅ 已有专题页 | **围绕 CAR-T 写 5-8 篇子文章** |
| **肿瘤治疗** | 极高 | 一般 | 肺癌、胃癌、肝癌各一篇 |
| **心脏搭桥/TAVI** | 高 | ✅ 已有对比页 | 补充主动脉瓣、二尖瓣各一篇 |
| **骨科/关节置换** | 中高 | 少 | 膝关节、髋关节各一篇 |
| **中医/康养** | 中 | 有基础 | 面向俄语和中东患者 |
| **眼科 LASIK** | 中 | 已有（CTR 低） | 重写而非新增 |
| **医美整形** | 中（非核心） | 多 | **暂停新增**——不是主要客源 |

### 🚫 不要再写的主题

以下主题已有过时/低效文章，不要再新增：

- 纯整形（除上海九院指南外，暂停）
- 纯牙科城市指南（低流量）
- "X 城市医院排名"（太泛，没有具体手术类型的排名没搜索量）
- 泛泛的"医疗旅游为什么选中国"（已有 3 篇）

---

## 三、文章结构强制规范

### 每篇文章**必须**包含

1. **Hero 区**（模板自动生成）：H1 含费用数字 + 一句话概述
2. **费用对比表**：至少 2 个国家的价格对比（US/Singapore/Thailand/Korea），用 HTML 表格
3. **3-5 家推荐医院**：每家含名称、城市、专科排名、国际部信息
4. **FAQ 区**（3-5 个问题）：每问配 `itemprop` schema
5. **转化 CTA 区**（模板自动生成）："Start Free Case Review" 按钮
6. **内部链接**：至少 2 个指向 `/treatments/` 或 `/blog/` 其他页面的链接
7. **Crosslink**：至少 1 个语言页面链接（`/ru.html` 或 `/ar.html` 等）

### 标题命名规范

```text
❌ "Best Eye Hospitals in China for Laser Vision Correction 2026"
   → 用户搜的是 "lasik cost china"，不是 "best eye hospitals"

✅ "LASIK Eye Surgery in China 2026: Costs, Best Hospitals & Complete Guide"
   → 匹配搜索意图：费用 + 医院 + 指南

✅ "Heart Bypass Surgery in China 2026: $18K-$45K vs $100K-$200K US"
   → 费用直接写在标题里，用户一眼看到最大卖点

✅ "CAR-T Therapy in China 2026: 7 Approved Products, $30K-$80K, Top Hospitals"
   → 产品数量 + 费用 + 医院，三重搜索匹配
```

### H2 结构模板

```markdown
## 1. How Much Does [Procedure] Cost in China? (2026 Prices)
   → 费用对比表：China / US / Singapore / Thailand

## 2. Top [X] Hospitals for [Procedure] in China
   → 每家医院：名称 + 城市 + 排名 + 国际部信息 + 大致的费用范围

## 3. Why Choose China for [Procedure]?
   → 手术量大、JCI 认证、费用对比、无等待时间

## 4. How International Patients Arrange [Procedure] in China
   → 流程：提交病历 → 医院匹配 → 报价 → 签证 → 出行

## 5. Frequently Asked Questions
   → 3-5 个 FAQ + FAQPage schema
```

---

## 四、Schema 强制规范

### 每篇文章必须输出两类 Schema

**1. Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "description": "Your meta description",
  "image": "https://chinahospitalsguide.com/og-image.webp",
  "author": { "@type": "Organization", "name": "China Hospitals Guide" },
  "publisher": { "@type": "Organization", "name": "China Hospitals Guide" },
  "datePublished": "2026-07-10",
  "dateModified": "2026-07-10",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://chinahospitalsguide.com/blog/your-slug.html" }
}
```

**2. FAQPage Schema（⭐ 抢 Google Featured Snippet）:**
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
        "text": "[Concrete price range] in 2026, compared to [comparison price] in [country]."
      }
    },
    {
      "@type": "Question",
      "name": "Is [procedure] in China safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, at JCI-accredited hospitals. [Hospital name] performs [volume] procedures annually..."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best hospitals in China for [procedure]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The top hospitals for [procedure] are: 1) [Hospital A], 2) [Hospital B], 3) [Hospital C]. All have international patient departments with English-speaking staff."
      }
    }
  ]
}
```

---

## 五、语言和本地化指南

### 英语主站
- 标题保留费用数字
- 成本对比优先 vs Singapore/Thailand（东南亚竞争对手），其次 vs US
- 提及"halal food available"、"Muslim-friendly services"（对中东和东南亚患者关键）

### 俄语页面 (`/ru.html`)
- 文章末尾可以加俄语 CTA：`Для консультации на русском языке: Telegram или WhatsApp`
- 优先对比 vs 以色列、德国（俄语患者常选的竞争目的地）

### 阿拉伯语页面 (`/ar.html`)
- RTL 兼容已在模板中
- 提及"清真食品"、"宗教敏感医疗服务"

---

## 六、成本对比数据规范

### 使用这张基准表（2026 年）

| 手术 | 中国 | 美国 | 新加坡 | 泰国 |
|------|------|------|--------|------|
| CAR-T (listed products) | $89K-$151K | $300K-$500K | N/A | N/A |
| CAR-T (clinical trial/compassionate) | $30K-$80K | $100K-$200K | N/A | N/A |
| 心脏搭桥 | $15K-$45K | $100K-$200K | $40K-$70K | $15K-$35K |
| 膝关节置换 | $8K-$15K | $35K-$60K | $20K-$35K | $8K-$18K |
| IVF | $3K-$8K | $12K-$25K | $8K-$15K | $4K-$10K |
| LASIK (双眼) | $1.6K-$3K | $4K-$8K | $3K-$6K | $1.5K-$3K |

### 注意事项
- ⚠️ 所有费用**必须**注明"estimates based on published 2026 data"
- ⚠️ 不承诺具体价格——"final cost depends on hospital and clinical complexity"
- ⚠️ 不含旅行/住宿——"travel and accommodation are not included"

---

## 七、内部链接策略

### 每篇文章必须链接到

| 目标 | 链接样式 |
|------|---------|
| 相关 Treatment 页 | `<a href="/treatments/car-t.html">CAR-T therapy guide</a>` |
| 相关区域页 | `<a href="/ru.html">Russian-speaking patients</a>` |
| 相关博文 | `<a href="/blog/xxx.html">Read more about YYY</a>` |
| CTA（模板自动） | `<a href="/contact-new.html">Start Free Case Review</a>` |

### 禁止
- ❌ 纯外链（如直接链接到 hospitals' own sites）
- ❌ broken 内链
- ❌ 链接到竞争分析页面（如 `/competitor-research-report-2026.html`）

---

## 八、内容发布检查清单

发布前逐项确认：

- [ ] 使用 `_layouts/blog-post.njk` 模板（.md 文件 + frontmatter）
- [ ] Title 含费用数字
- [ ] Meta description < 160 字，含价格范围
- [ ] Article Schema ✅ FAQPage Schema ✅
- [ ] 费用对比表 >= 2 个国家
- [ ] 3-5 家推荐医院 + 国际部信息
- [ ] 至少 2 个内部链接到其他页面
- [ ] CTA 按钮指向 `/contact-new.html`
- [ ] 费用数据标注 "2026 estimates"
- [ ] 没有虚假统计（不用 "500+ patients helped"、"98% satisfaction"）
- [ ] 所有 emoji 使用 HTML entities（`&#128300;` 而非 🧬）

---

## 九、现有 105 篇博文改造优先级

暂不改旧文（量太大）。如果时间充裕，优先重写这些**高曝光低 CTR 页面**：

| 文件 | 曝光 | CTR | 优先 |
|------|------|-----|------|
| `lasik-eye-surgery-china-2026.html` | 18K | 0.06% | 🔴 已重写 |
| `china-hospital-rankings-2026.html` | 10K | 0.06% | 🔴 已重写 |
| `plastic-surgery-china-guide-2026.html` | 4.2K | 0.23% | 🟠 已加 FAQ+CTA |
| `best-cancer-hospitals-china-2026.html` | 2.5K | 0.12% | 🟡 |
| `cataract-surgery-china.html` | 2.4K | 0.37% | 🟡 |

---

## 十、内容日历建议（未来 4 周）

| 周数 | 文章主题 | 目标关键词 |
|------|---------|-----------|
| 第 1 周 | CAR-T for Lymphoma in China | "car-t lymphoma china cost" |
| 第 1 周 | Lung Cancer Treatment in China | "lung cancer treatment china 2026" |
| 第 2 周 | TAVI Heart Valve in China | "tavi china cost vs singapore" |
| 第 2 周 | Gastric Cancer Surgery in China | "gastric cancer surgery china" |
| 第 3 周 | Knee Replacement in China | "knee replacement china cost" |
| 第 3 周 | IVF in China for International Patients | "ivf china cost international" |
| 第 4 周 | TCM Cancer Support in China | "tcm cancer china international" |
| 第 4 周 | Chinese Hospitals for Russian Patients | "лечение в китае"（RU 页面） |

---

*本指南基于 2026-07-06 的深度市场调研和 GSC 数据制定。月度 review。*
