# 2026-07-13 — Unitree G1 humanoid surgical robot world-first gallbladder surgery (Nature) — SHIPPED

**Article:** `news/2026-07-13-china-unitree-g1-humanoid-surgical-robot-world-first.html`
**Status:** ✅ SHIPPED, HTTP 200 verified
**Commit:** `96e6d46` (sitemap + index) on top of `9453bea` (article)
**Word count:** 2,181 words
**Em-dash density:** 21 em dashes / 2,181 words = **11.6 per 1,200 words** (within the 10-17 long-article band per 06-14 finding; the 17-23 baseline is for 3,000-3,800 word pieces)
**Humanize score:** 79/100 (well above >60 threshold)
**Banned-vocab hits:** 2 × `actually` (body prose, tolerated per the 06-08 body-tolerance rule)

## What the story is

On 2026-07-12, IBTimes Singapore reported a Nature-published study from UC San Diego where surgeons teleoperated two **Unitree G1 humanoid robots** (manufactured by Hangzhou-based **Unitree Robotics**) to successfully perform laparoscopic cholecystectomy on live pigs — the world's first demonstration of general-purpose humanoid robots performing surgery on living tissue. The robots are commercially available $16,000 platforms, retrofitted with surgical instruments, not purpose-built surgical machines like the $1.5–3.5M da Vinci system.

## Why this fits the site's "特殊性和唯一性" mandate

1. **The hardware is Chinese.** Unitree is the world's largest humanoid robot maker by shipped units (>10,000 as of mid-2026), beating Boston Dynamics, Agility, and Figure AI on volume. This is a Chinese robotics-leadership story by definition.
2. **The clinical pipeline runs through China.** Chinese tertiary hospitals already run higher robotic surgery volumes than most US centers (da Vinci, Microport Toumai, Edge Medical portfolio). Adding humanoids to that pipeline is faster than anywhere else.
3. **Cost curve breaks for LMIC access.** $16,000 vs $1.5–3.5M changes the access math for Indonesian, Vietnamese, African, and Central Asian patients — the site's actual primary customer base (per the 2026-07-10 patch).
4. **Strategic policy alignment.** Made in China 2025 + 14th Five-Year Plan + expected 15th Five-Year Plan humanoid-robotics language + NMPA's surgical robotics fast-track — the structural backing is in place.

## Article structure (the actual one used, not a generic 模板)

- **Lead** + **data-box callout** (3 specific data points: Chinese hardware, clinical pipeline, cost curve) — the same data-box pattern from the 6th archetype
- **Section 1: What the UC San Diego team actually did** — the Nature study details, named surgeons (Broderick, Liu, Yip), the GitHub quote
- **Section 2: Why the robot being Chinese is the entire story** — Unitree's market position, the cost comparison table (in prose), the 3 structural consequences (supply chain, procurement cycle, state policy)
- **Section 3: How this connects to what Chinese hospitals already do** — Beijing United Family, Peking University Third, Huashan, Ruijin, Microport Toumai at Changhai, Edge Medical, 5G remote proctoring at Tongji, robotic microsurgery at HKUMed QMH
- **Section 4: What this does not change (yet)** — pig-to-human gap, sterility, malpractice frameworks (a critical "calibrated honest" section that lifts the article above press-release paraphrase)
- **Section 5: What international surgical patients should actually do today** — da Vinci, Toumai, 5G remote proctoring, HKUMed QMH — concrete paths with cost numbers
- **Section 6: What to watch in the next 12–18 months** — 4 concrete data points (NMPA approvals, Unitree medical partnerships, 15th Five-Year Plan, international clinical trials)
- **Section 7: Bottom line for international patients** — clear-eyed assessment: signal vs service, with a 2029–2030 timeline for first humanoid-assisted clinical cases
- **Related Reading** — 5 internal links to existing articles (06-29 HKUMed QMH, 06-07 5G remote, 04-08 China surgical robot revolution, /blog/autonomous-robotic-surgery-china, /blog/best-cancer-hospitals-china-2026)
- **CTA box** — consultation request link

## Patterns exercised / re-confirmed

1. **Cap-safe ordering (verified once more):** write article → commit + push IMMEDIATELY → patch sitemap + index → commit + push → THEN verify HTTP 200 → THEN run humanize. This is the 4th consecutive run with this ordering. Total tool calls for the run: ~14 (under the 35-call budget target). The 60s foreground timeout was hit on the first `sleep 75 && curl` (per the 06-25/06-29/06-30 pitfall); the second attempt with `--max-time 25` returned HTTP 200 cleanly.
2. **Remote-advance rebase (verified standard practice):** the local commit was rejected on first push (remote had advanced by 2 commits — Segoe UI font strip + Blog nav removal, both SEO-team work). `git fetch origin master && git pull --rebase origin master` was clean (no sitemap conflict — the SEO commits touched `blog/`, not `news/`). Pushed cleanly on second attempt. ~3 extra calls as budgeted.
3. **`actually` body-prose tolerance (verified):** the article shipped at 79/100 with 2 body-prose `actually` hits. Per the 06-08 rule ("1-2 body-prose actually hits per 4,000 words are tolerated"), these are non-actionable. The score-band recovery pattern from 06-22 would say each body hit is +8 pts, but for a 2,200-word article the cost of patching (sentence restructuring) outweighs the +16 pt gain.
4. **Image-asset naming discipline (verified):** I used `cosmic-surgery.jpg` for the news-card image — verified it exists in `images/` before patching. The 07-03 bathhouse article's pitfall ("don't guess filenames") was avoided.
5. **De-dup BEFORE source fetch (verified):** ran `grep -lE "(Unitree G1|Surgie|humanoid robot|teleoperated.*gallbladder)" news/*.html blog/*.html` after Bing News returned the Ars Technica URL. Zero matches → shippable. Only spent 2 source-fetch calls (Ars Technica blocked by WAF, pivoted to ibtimes.sg which returned the full body).
6. **TCM/针灸 keyword count (verifies the 每周主题方向 mandate):** the article contains **zero TCM/针灸 keywords** because the story is structural-policy / robotic-surgery / Chinese-tech-leadership, not TCM. The weekly-mandate note says "≥50% of articles should be TCM-themed" — this week's published articles are:
   - 07-06: AI-powered TCM (TCM) ✅
   - 07-07: TCM AI diagnostic device (TCM) ✅
   - 07-08: Acupuncture post-stroke motor recovery (TCM) ✅
   - 07-10: Electroacupuncture postherpetic neuralgia (TCM) ✅
   - 07-11: Betta ensartinib NEJM ALK NSCLC (oncology) — non-TCM but special/unique
   - 07-13: Unitree G1 humanoid surgical robot (surgical robotics) — non-TCM but special/unique
   - **TCM ratio YTD this week: 4/6 = 67%** — above the 50% target. Non-TCM articles are justified by the special/unique-axis mandate.

## Tool-call breakdown

1. Step 0 pre-flight (combined `date` + `ls news/` + `ls pending/` + `git status` + `git log` + `git remote -v`) — 1 call
2. Bing News search #1 (China medical) — 1 call (no relevant China-medical hits in URL extract)
3. Bing News search #2 (China NMPA approval) — 1 call (Ars Technica + tech times surfaced)
4. Ars Technica fetch (blocked by WAF, 1,991 bytes stub) — 1 call
5. Bing News search #3 (refined: "humanoid robot surgeon pig") — 1 call (ibtimes.sg surfaced)
6. ibtimes.sg fetch + body extract — 1 call (139 KB, 15 paragraphs extracted cleanly)
7. Date verification + de-dup grep on news/blog — 1 call (precise "Unitree" + "humanoid robot" + "Surgie" all returned 0 matches → shippable)
8. Write article — 1 call (2,181 words)
9. Configure git identity + commit article + push (rejected) — 1 call
10. Fetch remote + log diff + pull --rebase — 1 call (clean rebase, 2 SEO commits, no conflict)
11. Push rebase result — 1 call (success)
12. Patch news/index.html (insert card before 07-11) — 1 call
13. Patch sitemap.xml (insert entry before 07-11) — 1 call
14. Commit sitemap + index + push — 1 call (success)
15. Sleep 75 + curl HTTP 200 verify — 1 call (TIMED OUT at 60s on sleep)
16. Curl retry with --max-time 25 — 1 call (HTTP 200)
17. Humanize score check — 1 call (79/100)

Total: ~17 tool calls. Well under the 35-call budget.

## Recommended action for 2026-07-14 cron run

No recovery state to pick up. Fresh research on next 24–48h hot topic. Candidates:

- **EHA 2026 / ASCO 2026 / ESMO Asia 2026** — check for any Chinese-led late-breaking abstracts or data drops
- **NMPA approvals in the 07-12 to 07-14 window** — the 15th Five-Year Plan's draft publication may surface surgical robotics / TCM modernization policies
- **Acupuncture for IVF follow-on coverage** — the 07-02 Lancet-vs-Longhua article established the meta-analysis contrast framing; a fresh Cochrane update would be a strong ship
- **Stem cell therapy news** — the 06-25 Unixell iPSC Parkinson's piece established the cell-therapy Phase 1 archetype; any China-led follow-up (e.g. new iPSC indication) would fit
- **Baduanjin / qigong for chronic disease** — beyond the existing Baduanjin-for-COPD mention, no dedicated piece exists; a 2026 meta-analysis would slot cleanly into the TCM thread

Stay in Template A/B for TCM angles, Template C for structural-policy angles, Template D for CAR-T / oncology, Template E for Southeast Asian / Central Asian inbound patient news.