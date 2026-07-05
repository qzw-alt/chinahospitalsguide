# Pending: 2026-07-03 china-bathhouse-wellness-straits-times — SHIPPED

## Outcome

Article shipped. **HTTP 200 verification in progress at end of cron run** — origin confirmed live (raw.githubusercontent.com returns full article HTML), CDN has not propagated yet at terminate time (~6 min post-push). Per `references/github-pages-cdn-propagation.md`, GH Pages can take 7+ minutes; re-verify with `curl --max-time 30 -sI https://chinahospitalsguide.com/news/2026-07-03-china-bathhouse-wellness-boom-120-billion-yuan-straits-times-2026.html | head -5` from any subsequent agent run.

## Run summary

- **Cron run date:** 2026-07-04 (Saturday)
- **Article date:** 2026-07-03
- **Article:** `news/2026-07-03-china-bathhouse-wellness-boom-120-billion-yuan-straits-times-2026.html`
- **Word count:** 3,605 (raw HTML) / 4,360 (file size with markup)
- **Humanize score:** 90/100
- **Em-dashes:** 27 (7.5 per 1200 words — in band for 3,000+ word explanatory article)
- **1st-person:** 5 (thread-continuity voice, consistent with the June thread)
- **Commit:** `c8b1210` (local), `c8c4505` (after remote rebase, on origin/master)
- **Local commit before rebase:** `c8b1210 article: 2026-07-03 china-bathhouse-wellness-boom-120-billion-yuan-straits-times-2026`
- **Push:** succeeded (`f197387..c8c4505  master -> master`)
- **HTTP 200 on live URL:** PENDING (CDN not yet refreshed at 6-min mark; root still shows `last-modified: Thu, 02 Jul 2026`)

## State matrix

| Run variant | Detected? | Result |
|---|---|---|
| Step 0 Check 1 (today's article) | YES — `news/2026-07-03-...html` untracked | RECOVERED |
| Step 0 Check 2 (git status) | YES — modified sitemap.xml + news/index.html + untracked article | RECOVERED |
| Step 0 Check 3 (pending files) | NO new pending files; old shipped ones for 06-30 / 07-01 / 07-02 present | NOT applicable |
| Push origin master | REJECTED | remote 8 commits ahead (SEO batch: 43-page schema coverage, plastic-surgery optimization, Formspree activation, MS Clarity) |
| Remote advance | YES | standard 06-21 + 07-02 pattern |
| Rebase | CLEAN | 1 rebased commit `c8b1210` → `c8c4505` (no sitemap conflict in this case — the remote commit `c66e65e` that touched sitemap.xml did not conflict with our insert-at-top patch) |
| Push 2 | SUCCEEDED | `f197387..c8c4505  master -> master` |
| HTTP 200 verify | TIMING OUT | CDN propagation slow, ~6 min and counting |

## Recovery recipe used (10 tool calls)

1. `terminal` — pre-flight (Check 1, 2, 3, 4, 5 combined) → confirmed mid-pipeline state
2. `terminal` — article head/tail + sitemap grep + index grep + git diff stat → confirmed article, sitemap, index all ready, just uncommitted
3. `terminal` — `humanize_score.py` → 90/100, ship-able
4. `terminal` — git config identity + add + commit (`c8b1210`) + initial push → REJECTED (remote advanced)
5. `terminal` — `git fetch origin master` + `git log HEAD..origin/master` + `git log HEAD..origin/master -- sitemap.xml news/index.html news/` → 8 commits ahead, 1 remote commit `c66e65e` touched sitemap.xml
6. `terminal` — `GIT_EDITOR=true git rebase origin/master` → clean rebase, no conflict
7. `terminal` — `git push origin master` → SUCCEEDED
8. `terminal` — `sleep 150 && curl --max-time 25 ... 200` → HTTP 404 (CDN stale)
9. `terminal` — origin check + root `last-modified` check → confirmed origin live, CDN stale
10. `terminal` — additional `sleep 180 && curl` → still 404; documented state and committed pending file

## Key pattern reinforcement

**Recovery from mid-pipeline cap-hit (06-17 / 06-30 / 07-03 variant) is a 7-10 call workflow once detected.** The state at start of run was: article on disk, sitemap + index updated, no commit, no push. The recovery was:

```
Step 0 detection → humanize verify → git config + commit → push (rejected) → 
fetch + log stat → rebase → push (succeed) → sleep + curl verify
```

This is the THIRD documented mid-pipeline cap-hit recovery (after 06-17 and 06-30); the recipe is now standard cron workflow. Tool-call cost: 10 calls including the CDN wait + 404 + retry cycle.

## NEW pitfall documented in this run

**GH Pages CDN propagation slow (RE-CONFIRMED, distinct from 06-25 timeout pitfall):** the 06-25 pitfall was the `sleep 180 && curl` chain hitting the 60s foreground timeout, with no way to know if the push succeeded. The 07-03 manifestation is different: push succeeds, curl returns cleanly with HTTP 404, but root `last-modified` shows the prior date. This means GH Pages is rebuilding but the CDN has not yet fetched the new commit. Per the 07-04 reference (`references/github-pages-cdn-propagation.md`), this is normal — typical Pages rebuild is 5-7 minutes, can be 10+ when a sitemap rewrite is in the commit. The diagnostic is `curl -sI SITE_ROOT | grep -i last-modified`; fix is to wait and re-verify from a subsequent agent run, do NOT re-push (duplicates the commit) or `git reset` (drops the local commit).

## Recommended action for 2026-07-04 cron run

**First verify HTTP 200 on the 07-03 article**:
```bash
curl --max-time 25 -s -o /dev/null -w "HTTP %{http_code}\n" https://chinahospitalsguide.com/news/2026-07-03-china-bathhouse-wellness-boom-120-billion-yuan-straits-times-2026.html
```

If 200: pick up the 07-04 thread (the bathhouse article references Bo'ao Lecheng TCM access and hot-spring convalescence — possible next angle is **Hainan Bo'ao Lecheng's TCM service center** expansion or **Hainan hot-spring wellness** article, both per the weekly theme of TCM wellness + accessibility).

If still 404: wait another 5-10 minutes (it's been ~6 min since the push at terminate time), check again with the `--max-time 25` flag. If still 404 after 20 minutes, the push genuinely failed and needs investigation (this has NOT happened on this repo since 06-07's SSH switch).

## Pending files status

All three pre-existing pending files were SHIPPED files (06-30, 07-01, 07-02), not actionable. New pending file written: this one (07-03 SHIPPED status + HTTP 200 verify pending).
