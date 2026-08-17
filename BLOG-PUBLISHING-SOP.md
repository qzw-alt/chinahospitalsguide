# 博客发布标准流程（SOP）—— 给 Hermes / 所有发博客的 Agent

> 这份文件是**强制规范**。每次发布博客文章，必须逐条执行，不得跳步、不得简化。
> 目的：`blog/index.html` 是一个**手写静态 HTML 列表页**，它**不会**自动从 `.md` 文章生成。
> 如果漏掉第 2 步（加卡片）或第 2 步写错，博客首页就会「乱」——新文章消失、卡片布局塌陷、分页错乱。

---

## 核心认知（先读这一句）

发一篇新博客，**不是**只写一个 `.md` 文件就完事。必须同时改 **3 个文件**，缺一不可：

| # | 文件 | 作用 | 漏掉的后果 |
|---|------|------|-----------|
| 1 | `blog/YYYY-MM-DD-slug.md` | 文章正文 | 没有文章 |
| 2 | `blog/index.html` | 列表页卡片 | **新文章在博客页看不到，或布局塌陷** |
| 3 | `sitemap.xml` | 搜索引擎收录 | 搜索引擎抓不到新文章（构建时自动生成，无需手改） |

---

## 标准流程（6 步）

### 第 1 步：写文章 `.md` 文件

文件路径：`blog/YYYY-MM-DD-slug.md`

- **news 型文章**：文件名必须带日期前缀 `YYYY-MM-DD-slug.md`
  （例：`2026-08-13-chinese-3d-printed-pelvic-implant-lahore-pakistan.md`）
- **decision 型文章**：文件名不带日期 `slug.md`
  （例：`lung-cancer-treatment-china-2026.md`）

Frontmatter 模板（**逐字复制，不要改字段名**）：

```markdown
---
layout: blog-post.njk
title: "标题（一句话，含关键词）"
description: "150 字以内的描述，用于 SEO 和列表摘要"
kicker: "分类标签，如 China's 3D-Printed Implant Technology"
subtitle: "1-3 句副标题，介绍文章讲什么"
date: 2026-08-13
schema: |
  [ { "@context": "https://schema.org", "@type": "Article", ... } ]
---

正文（Markdown）
```

关键点：
- `layout` 固定写 `blog-post.njk`，**不要改**。
- `date` 必须和文件名里的日期**完全一致**。
- `title` / `description` 里不要放未转义的 `"`（英文引号）以外的双引号，避免破坏 frontmatter。

### 第 2 步：往 `blog/index.html` 加卡片（最易错，重点看）

打开 `blog/index.html`，找到这一行：

```html
<div class="blog-grid" id="blog-grid">
```

把新卡片**插在这一行之后的第一位**（即列表最顶部，最新文章在最上面）。

**卡片必须严格单行**，结构如下（**逐字复制模板，只替换 `[]` 里的内容**）：

```html
<div class="blog-card"><div class="blog-image" style="background:linear-gradient(135deg,#7b2cbf 0%,#c77dff 100%);">LC</div><div class="blog-content"><div class="blog-category">Oncology</div><h3 class="blog-title"><a href="[URL]">[标题]</a></h3><p class="blog-excerpt">[一句话摘要]</p><div class="blog-meta"><span>[August 2026]</span><span>[12 min read]</span></div><a href="[URL]" class="read-more">Read Article →</a></div></div>
```

**5 个必须遵守的规则**（违反任何一条都会让页面乱）：

1. **URL 规则**：`[URL]` 必须等于 `.md` 文件名去掉 `.md` 后加一个尾斜杠 `/`。
   - 带日期文章：`2026-08-13-chinese-3d-printed-pelvic-implant-lahore-pakistan.md` → `2026-08-13-chinese-3d-printed-pelvic-implant-lahore-pakistan/`
   - 不带日期文章：`lung-cancer-treatment-china-2026.md` → `lung-cancer-treatment-china-2026/`
   - **禁止**写 `.html` 结尾（那是旧文章的格式），**禁止**漏掉尾斜杠。
2. **严格 5 个 `<div>` 开、5 个 `</div>` 闭**，一个都不能多、不能少。
   结构是：`blog-card` → `blog-image` → `blog-content` → `blog-category` → `blog-meta`，最后 `</div></div>` 收尾。
3. **整张卡片只能占一行**（中间不许换行）。换行会让分页脚本 `scripts/paginate-blog.js` 的正则抓错。
4. 卡片最后必须以 `</a></div></div>` 结尾（read-more 链接 + 关闭 content + 关闭 card）。
5. `blog-image` 里的两个字母（如 `LC`）是占位缩写，随便写两个大写字母即可；渐变色随意，保持和相邻卡片不一样即可。

**检查方法**（写完立刻做）：数一下你插入的这行里 `<div ` 出现 5 次、`</div>` 出现 5 次。

### 第 3 步：sitemap.xml 自动生成（无需手工编辑）

`sitemap.xml` 由 `scripts/generate-sitemap.js` 在构建时**自动生成**——它会遍历 `_site/`，自动收录所有公开页面（包括你刚写的新文章），并排除内部文档、noindex 页、分页页和重复 `.html`。

**不要手工编辑 `sitemap.xml`**（改了也会被下次构建覆盖）。你只需在第 5 步构建后，验证新文章已被自动收录：

```bash
grep -c "[URL]" sitemap.xml   # 期望 ≥1
```

- 如果返回 **0**，说明新文章 `.md` 没生成 `_site/blog/[slug]/index.html`（检查第 1 步 frontmatter 的 `layout: blog-post.njk`），回去重做第 1 步。

### 第 4 步（仅需要时）：更新内部链接 / 404 / _redirects

如果这篇文章替换了旧页面（如 `html → md` 转换），才需要同步更新其他页面里指向旧 URL 的链接、`404.html` 和 `_redirects`。普通新文章**跳过这步**。

### 第 5 步：构建 + 自检（不能跳过）

在项目根目录（`temp_repo`）运行（本地验证用下面的 Eleventy 构建链；`npm run build` 现在也安全——`generate-sitemap.js` 已修好，但本地验证用轻量链更快）：

```bash
node scripts/clean.js && npx @11ty/eleventy --quiet && \
node scripts/generate-sitemap.js && \
node scripts/inject-hints.js && node scripts/fix-webp.js && \
node scripts/inject-enhancements.js && node scripts/inject-robots-meta.js && \
node scripts/fix-duplicate-schema.js && node scripts/inject-schema.js && \
node scripts/inject-crosslinks.js && node scripts/paginate-blog.js && \
npx cleancss -o _site/styles.css _site/styles.css && node scripts/minify-html.js
```

构建完成后，**必须**执行这 4 项检查：

```bash
# ① 列表页第 1 页应有 30 张卡片，卡片总数 = 文章总数
grep -o 'class="blog-card"' _site/blog/index.html | wc -l

# ② 新文章应该出现在列表页里（把 [URL] 换成你的文章 URL）
grep -c "[URL]" _site/blog/index.html

# ③ 分页目录已生成（文章 >30 篇时应有 /blog/2/ /blog/3/）
ls -d _site/blog/*/

# ④ 新文章已被自动收录进 sitemap.xml（应 ≥1）
grep -c "[URL]" sitemap.xml
```

- 如果 `grep -c "[URL]" _site/blog/index.html` 返回 **0**，说明第 2 步卡片没插进去或 URL 写错了，**回去重做第 2 步**，不要提交。
- 如果 `grep -c "[URL]" sitemap.xml` 返回 **0**，说明新文章没生成独立页（检查第 1 步 frontmatter 的 `layout: blog-post.njk`），**回去重做第 1 步**，不要提交。
- 如果构建报错，先修错误，再提交。

### 第 6 步：git 提交

一次提交包含**全部改动**（.md + index.html + sitemap），不要拆成多笔导致中间状态出错。

```bash
git add blog/[slug].md blog/index.html sitemap.xml
git commit -m "article: [slug]"
```

（如还改了 404/_redirects，一并 `git add`。）

---

## 禁止事项（红线）

- ❌ **不要**手动编辑 `_site/` 目录里的任何文件——那是构建产物，下次构建会被覆盖。
- ❌ **不要**只写 `.md` 就提交，忘记 `blog/index.html` 和 `sitemap.xml`。
- ❌ **不要**在卡片里用非标准结构（多写/少写 `<div>`、卡片内换行、href 写成 `.html`）。
- ❌ **不要**跳过第 5 步的自检就提交。
- ❌ **不要**删除或改写别人的卡片时改动到相邻卡片的 div 结构。
- ❌ **不要**改 `blog/index.html` 里 `blog-grid` 以外的 HTML（header/footer/newsletter），除非任务明确要求。

---

## 常见错误对照表（历史上真实踩过的坑）

| 错误 | 表现 | 正确做法 |
|------|------|---------|
| 卡片没写闭合 `</div>` | 后面所有卡片嵌套进去，整页 CSS 网格塌陷（历史提交 `090d0f4`） | 卡片必须 5 开 5 闭，末尾 `</a></div></div>` |
| 只写 `.md` + sitemap，漏了 index.html 卡片 | 新文章在博客页看不到（8-03~8-13 的 11 篇文章全部中招） | 三步一个都不能少 |
| href 写成 `.html` | 新文章 404 | 新 `.md` 文章 href 一律尾斜杠 `slug/` |
| 卡片里换行 | 分页脚本正则抓错，分页错乱 | 卡片严格单行 |
| 新卡片插到列表中间/末尾 | 顺序乱，最新文章不显示在第一页 | 统一插在 `blog-grid` 后第一位 |
| `paginate-blog.js` 用 `indexOf('<div class="blog-grid">')` 找网格，但源码是 `<div class="blog-grid" id="blog-grid">`（带 id） | 匹配返回 -1，每个分页页丢失 `<!DOCTYPE>`/`<head>`/CSS/导航/页头，整页无样式（2026-08-17 修复） | 已改为正则匹配并保留 id；找不到网格/卡片时直接抛错让 CI 失败 |
| `generate-sitemap.js` 盲目遍历 `_site` 全部 `.html`，且构建不清空输出目录 | sitemap.xml 被覆盖成污染版：塞进内部文档（planning/internal-research-notes/BLOG-PUBLISHING-SOP/api）、noindex 页、陈旧死链（已删除的 news/、treatments/、course.html）→ GSC 大量 404（2026-08-17 修复） | 已重写排除逻辑（内部目录/noindex/分页/重复 .html 全排除）；构建前先 `node scripts/clean.js` 清空 `_site`；sitemap 改为自动生成，勿手改 |

---

## 一句话总结

**发文章 = 写 `.md` + 往 `blog/index.html` 顶部插一张「单行、5 开 5 闭 div、尾斜杠 URL」的卡片，`sitemap.xml` 由构建自动生成，然后用第 5 步的构建链（含 `clean.js` + `generate-sitemap.js`）自检 4 项全过再提交。**
