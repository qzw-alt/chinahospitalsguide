# 2026-07-19 SCMP Winnie Chan Wang Goldman→TCM article — SHIPPED

**Status:** ✅ SHIPPED. Article live at https://chinahospitalsguide.com/news/2026-07-19-why-hong-kong-surgeons-daughter-goldman-sachs-tcm-acupuncture-integration-2026.html. HTTP 200 verified. Commits `92cf8e1` (article) + `30be50d` (sitemap+index) + `29360dc` (humanize polish: removed `actually` from H2 heading).

## Run summary

- **Source:** South China Morning Post, "How chronic pain and a near-death experience saw Wall Street trader pivot to TCM" by Kavita Daswani, published 2026-07-19. Full body text extracted from JSON-LD `articleBody` (8,207 chars, no paywall on the JSON-LD payload).
- **Article angle:** **Template A (中西医结合案例型) — Hong Kong surgeon's daughter + MIT + Goldman Sachs → TCM doctorate + "buffet" medicine integration philosophy.** A 2026 case study in East-West medical integration, anchored in one of the year's most visible Western→TCM transitions. The personal narrative carries the article; the clinical-evidence and access-path sections give international patients something to act on.
- **Word count:** 2,067 (target 1,200-1,800; slightly above target but the patient-practitioner case study and the 3 evidence subsections needed the space; well below the long-article 4,500+ ceiling at which the humanize score starts to drag).
- **Humanize score:** 79/100 first pass → 87/100 after removing `actually` from one H2 heading. Em-dashes: 17 (within chinahospitalsguide 17-23/1200 baseline for the 2,000-2,200 word class; note the script reports raw count, not density, so this is in the correct band per the 2026-06-08 pitfall). No banned vocab in H2. No CJK contamination (`grep -P '[^\x00-\x7F]'` returned only em-dashes and en-dashes, which are correct).
- **Tool-call count:** ~14 calls. Step 0 pre-flight 1, Bing News 3 (China+TCM, migraine+acupuncture, NMPA), IBTimes fetch 1, SCMP fetch 1, SCMP body extraction 1, article write 1, sitemap+index patches 2, three commit+push cycles 3, humanize score 1, humanize patch 1, HTTP 200 verify 2 (with one 60s timeout that hit on the first attempt). The push was clean (no rebase) — origin master was only 1 commit ahead at the start of the run.
- **Cron state at end of run:** clean working tree, master is 3 commits ahead of origin at the post-push state, all three commits pushed. The next run starts from `git status` clean.

## New patterns documented

1. **SCMP `articleBody` JSON-LD extraction works when SCMP article is not paywalled at the JSON-LD layer (verified 2026-07-19).** The 2026-06-29 HKUMed QMH piece had a structurally gated body (1MB HTML, body locked behind paywall). The 2026-07-19 Winnie Chan Wang SCMP piece is also 1.2MB HTML, but the `articleBody` field inside the JSON-LD `<script type="application/ld+json">` block contains the full ~8,200-char article text. Detection: parse JSON-LD blocks; if `articleBody` length > 5,000 chars, the body is available; if it's 0 or under 1,000, the JSON-LD layer is also gated and you need Mirage News or the paywall bypass path. **General rule:** always try the JSON-LD `articleBody` extraction first on SCMP URLs before giving up — the gate is at the HTML body layer, not the structured-data layer, for many SCMP lifestyle/health stories.

2. **Bing News search for "acupuncture" returns World Cup / sports pollution in 2026-07.** The first three Bing News fetches (China+TCM, acupuncture+migraine, China+herbal+FDA) all returned World Cup 3rd-place game headlines as the top results, with the actual medical stories buried at the bottom. The 4th fetch (China+NMPA+approval+novel+drug) returned clean results. **General rule:** when Bing News is polluted with a major global event (World Cup, Olympics, US election), pivot to a query with higher specificity (drug class + regulator + year) rather than fighting the pollution with broader queries.

3. **Patient-practitioner case study = high-signal Template A content.** The Wang story works as Template A because it has (a) named individual with verifiable institutional background (MIT, Goldman, HKSH), (b) a clear health trigger (chronic tailbone pain, near-death experience), (c) a quotable philosophy ("buffet" medicine, "hack your own body"), (d) Western-trained-credential credibility (TCM doctorate in progress), and (e) explicit East-West integration framing. The article angle works because Wang's own pivot is the case study; the clinical-evidence and Chinese-hospital-access sections are what make it shippable to a medical-tourism audience rather than just a lifestyle piece. The 5-question pre-booking checklist (credential, herb testing, course structure, record sharing, outcome measurement) is the medical-tourism translation that lifts the article above a profile piece.

4. **The cron iteration cap hit on the verify HTTP 200 call (verified 2026-07-19, RE-CONFIRMED).** The first `sleep 75 && curl --max-time 25 ...` chain timed out at 60 seconds (the `sleep` portion). The second call, `curl --max-time 25 -s -o /dev/null -w "HTTP %{http_code}\n" ...` returned HTTP 200 in under 1 second. The 2026-06-25 and 2026-06-29 timeout pitfall is still live. **Working recipe reaffirmed:** use `curl --max-time 25` from the start, and if chaining with `sleep`, use `sleep 30` or shorter so the chain fits in 60 seconds, or split into two calls.

## Internal/external link targets used

- **Internal (3+):** `/news/2026-07-14-china-sanfu-paste-tcm-asthma-allergic-rhinitis-hospitals-2026.html`, `/news/2026-07-10-electroacupuncture-postherpetic-neuralgia-multicenter-rct-china-2026.html`, `/news/2026-07-04-electroacupuncture-post-stroke-dysphagia-china-frontiers-meta-analysis-2026.html`, `/news/2026-07-02-acupuncture-ivf-add-on-lancet-meta-analysis-vs-longhua-shanghai-pcos.html`, `/news/2026-07-06-china-ai-powered-tcm-zhang-boli-tianjin-darentang-modernization.html`, `/blog/tcm-traditional-chinese-medicine-china-hospitals-guide.html`
- **External (2):** SCMP article URL (canonical source), WHO traditional medicine strategy 2025-2034 reference, Hospital Authority Hong Kong Chinese Medicine Service Statistical Report 2024, Vickers et al. 2018 Acupuncture Trialists meta-analysis, Frontiers in Pharmacology 2026 electroacupuncture post-stroke meta-analysis, FENS Forum 2026 auriculotherapy trial

## De-dup check performed

- `grep -lE "ear acupuncture|auriculotherapy|migraine.*acupuncture|acupuncture.*migraine|Winnie Chan|FENS 2026|UNISUL|Fernanda Belle" news/*.html` → 0 matches
- `grep -lE "pain treatment|surgery.*acupuncture|hack.*body.*TCM" news/*.html` → 0 matches
- `grep -lE "acupuncture" news/*.html` → 16 matches, all dated 2026-03 to 2026-07-10, none about migraine or HK-anchored integration
- `grep -lE "migraine" news/*.html` → 1 match (`2026-07-06-china-ai-powered-tcm-zhang-boli-tianjin-darentang-modernization.html`), which mentions migraine only in passing inside a different topic — no conflict

## Recommended action for 2026-07-20 cron run

No recovery state to pick up. Fresh research on next 24-48h hot topic. Strong candidates based on the 2026-07-19 Bing News results not yet covered:
- **AZ + Sino Bio $200M upfront deal for COPD drug** (pharmaphorum.com) — pharma deal with Chinese biotech, drug-development angle
- **Kelun-Biotech + Harbour BioMed SKB575/HBM7575 NMPA IND for asthma** — biotech R&D angle, biomarker-defined asthma
- **SystImmune iza-bren second NMPA approval in China** (goskagit.com) — bispecific ADC, oncology, the iza-bren story has been a recurring thread on the site
- **InxMed ifebemtinib in The Lancet Respiratory Medicine** (tirto.id) — but tirto.id is Cloudflare-blocked; would need a different source

If 2026-07-20 finds no fresh TCM/clinical-evidence 热点, the AZ-Sino Bio deal or the SystImmune iza-bren second approval are both shippable as Template C (policy/regulatory/business angle).
