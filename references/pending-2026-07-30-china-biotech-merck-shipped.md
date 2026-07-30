# Pending: 2026-07-30 China biotech Merck shipping notes

**Status:** SHIPPED
**Article:** `blog/2026-07-30-china-biotech-merck-76-innovative-drugs-record-pipeline-2026.md`
**Live URL:** https://chinahospitalsguide.com/blog/2026-07-30-china-biotech-merck-76-innovative-drugs-record-pipeline-2026/
**Word count:** 2,422 words
**Humanize score:** ~75/100 (post-patches)
**Em-dash density:** 14.4 per 1200 words (within tolerance for long articles)
**Commits:**
- `49aef5a` article: 2026-07-30 China biotech Merck 76 innovative drugs + 30% global pipeline
- `9b75e62` sitemap: add 2026-07-30 China biotech Merck article
- `406631a` humanize: drop actually from 2 H2 headings

**HTTP verify:** 200 OK on trailing-slash URL (Eleventy render pattern, .md → `/blog/YYYY-MM-DD-slug/`)

## Source

[China Daily exclusive interview with Andre Musto, Merck Healthcare China MD](https://www.chinadaily.com.cn/a/202607/27/WS6a66fa69a310986e2b4677a6.html), published 2026-07-27 (meta tag says 2026-07-24 but article URL says 2026-07-27). Key data points (all attributed in body):
- NMPA approved 76 innovative drugs in 2025 (up from 48 in 2024)
- China = ~30% of global biopharma pipeline (up from 2% a decade ago)
- "China speed" — 1.5x faster target-to-trial, 2-5x faster patient enrollment (McKinsey)
- 150+ outbound licensing deals in 2025, $130B+ combined value (record)
- Quote from Andre Musto on Merck's continued China commitment

## Article angle

轴线 A (China unique/leading medical projects) — biopharma innovation framework. Fits Template C (policy & access — biopharma innovation infrastructure for international access) but framed around the Merck executive interview with hard NMPA/McKinsey numbers.

Patient angle: international cancer patients who want clinical-trial access for cutting-edge CAR-T, bispecific antibodies, ADCs. Emphasized real Southeast Asian and Middle East patient flows (Indonesia, Vietnam, Kazakhstan). Did NOT default to US/EU patient framing per 2026-07-10 patch #1 (客源定位).

Pricing: kept $89K-$151K CAR-T (commercial) vs $30K-$80K (trial) dual-track per 2026-07-10 patch #2.

## Internal cross-links (5)

- /blog/solid-tumor-car-t-china.html
- /blog/car-t-therapy-china-2026.html
- /blog/best-cancer-hospitals-china-2026.html
- /blog/hainan-boao-lecheng-medical-tourism.html
- /blog/why-international-patients-choose-china-medical-treatment-2026.html
- /blog/integrated-chinese-western-medicine-china.html

## External source (1)

- https://www.chinadaily.com.cn/a/202607/27/WS6a66fa69a310986e2b4677a6.html (Merck interview, cited inline)

## Pitfalls hit

- **Bing News returned 0 relevant TCM/medical URLs** on the day's main queries — pollution + format issue. Pivoted to ChinaDaily.com.cn `/business/` section scraping, which surfaced the Merck article cleanly.
- **NCBI PubMed eutils returned 302 redirect to abuse page** — rate-limited. CrossRef returned irrelevant old items. Direct PubMed is unreliable from cron sandbox today.
- **Remote origin/master advanced 1 commit between fetch and push** — 2026-07-30 13:00 had `a887922` (pending file from 07-29), 13:01 was `729bc71` (Telegram username fix from origin). Standard 3-call fetch+rebase+retry-push worked cleanly. This is now STANDARD cron workflow per 2026-06-21 + 2026-07-02 verified pattern.
- **Two `actually` H2 hits** — patched both in single cycle. Score went from ~56 (estimated 16-pt penalty) to ~75.

## Tool-call budget

Approximately 22 calls — within the 35-call cap. Sequence:
- 1 (preflight) + 2 (Bing 1+2) + 1 (ChinaDaily scrape) + 1 (CD biotech fetch + extract) + 1 (de-dup grep) + 1 (write article) + 2 (commit + rebase push + sitemap push) + 1 (article head verify) + 1 (humanize patches 1+2) + 1 (commit + push) + 1 (sleep + verify) + 1 (this pending note) = ~14 calls.

Cap-safe ordering (commit+push BEFORE humanize loop) was followed. Article shipped at 75/100 (vs ideal 80+) — tradeoff acceptable per the cap-safe rule "ship at 60, polish later if budget remains."

## Next cron run guidance

No recovery state. Pending files are all shipped. Fresh research recommended for 2026-07-31.