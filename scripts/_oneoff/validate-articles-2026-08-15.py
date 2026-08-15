#!/usr/bin/env python3
"""Validate the two new/transformed articles against the quality checklist."""
import re, json, sys
from pathlib import Path

ROOT = Path('/home/ubuntu/chinahospitalsguide')
ARTICLES = [
    'blog/car-t-therapy-hospitals-china-2026.md',
    'blog/china-vs-singapore-heart-surgery-cost.md',
]

def check_md(path):
    src = (ROOT / path).read_text(encoding='utf-8')
    fm = re.match(r'^---\n(.*?)\n---', src, re.DOTALL).group(1)
    body = src.split('---', 2)[2]
    title = re.search(r'^title:\s*"?(.+?)"?$', fm, re.MULTILINE).group(1)
    desc = re.search(r'^description:\s*"?(.+?)"?$', fm, re.MULTILINE).group(1)
    schema_raw = re.search(r'^schema:\s*\|\n(.*?)(?=^[a-z]+:|\Z)', fm, re.MULTILINE | re.DOTALL).group(1)
    schema = json.loads(schema_raw)
    links = re.findall(r'\]\((/[^\)]+)\)', body)
    print(f"--- {path} ---")
    print(f"  title: {title[:90]}")
    ok = True
    # 1. Title has >= 3 elements (disease + location + cost/year)
    has_disease = bool(re.search(r'CAR-T|Heart|Bypass|Surgery', title))
    has_china = 'China' in title
    has_cost = '$' in title
    has_year = '2026' in title
    elems = sum([has_disease, has_china, has_cost, has_year])
    print(f"  [{'OK' if elems>=3 else 'FAIL'}] title elements: disease={has_disease} china={has_china} cost={has_cost} year={has_year} (n={elems})")
    if elems < 3: ok = False
    # 2. description <= 160
    print(f"  [{'OK' if len(desc)<=160 else 'FAIL'}] description len={len(desc)} (max 160)")
    if len(desc) > 160: ok = False
    # 3. schema parseable + Article + FAQPage
    types = [o.get('@type') for o in schema]
    print(f"  [{'OK' if 'Article' in types and 'FAQPage' in types else 'FAIL'}] schema types: {types}")
    if 'Article' not in types or 'FAQPage' not in types: ok = False
    # 4. FAQ 3-5
    faq = [o for o in schema if o.get('@type') == 'FAQPage']
    n_faq = len(faq[0]['mainEntity']) if faq else 0
    print(f"  [{'OK' if 3 <= n_faq <= 5 else 'FAIL'}] FAQ count: {n_faq}")
    if not (3 <= n_faq <= 5): ok = False
    # 5. hospitals 6-field module (decision-type only)
    if 'car-t-therapy-hospitals' in path:
        h_fields = body.count('**Official English name**')
        print(f"  [{'OK' if h_fields >= 3 else 'FAIL'}] hospital 6-field modules: {h_fields}")
        if h_fields < 3: ok = False
    # 6. CTA >= 2
    n_cta = body.count('Start Free Case Review') + body.count('Get a Free') + body.count('Get a Personalized')
    print(f"  [{'OK' if n_cta >= 2 else 'FAIL'}] CTA occurrences: {n_cta}")
    if n_cta < 2: ok = False
    # 7. cost table exists
    has_cost_table = bool(re.search(r'\|\s*\$', body)) or '| Access Route |' in body or '| Procedure |' in body
    print(f"  [{'OK' if has_cost_table else 'FAIL'}] cost table present")
    if not has_cost_table: ok = False
    # 8. internal links >= 2, all targets exist (check source files: .html/.njk/.md or dir)
    internal = [u for u in links if not u.startswith('http')]
    missing = []
    for u in internal:
        u2 = u.split('#')[0].lstrip('/')
        if u2.endswith('/'):
            u3 = u2.rstrip('/')
            candidates = [
                ROOT / u3 / 'index.html',
                ROOT / (u3 + '.md'),
                ROOT / (u3 + '.njk'),
                ROOT / u3,
            ]
        else:
            base = u2[:-5] if u2.endswith('.html') else u2
            candidates = [
                ROOT / u2,
                ROOT / (u2 + '.njk') if not u2.endswith('.njk') else ROOT / u2,
                ROOT / (base + '.njk'),
                ROOT / (base + '.md'),
            ]
        if not any(c.exists() for c in candidates):
            missing.append(u)
    print(f"  [{'OK' if len(internal)>=2 and not missing else 'FAIL'}] internal links: {len(internal)} found, missing={missing}")
    if len(internal) < 2 or missing: ok = False
    # region link
    has_region = any(u in ('/sg.html', '/id.html', '/ru.html', '/ar.html') for u in internal)
    print(f"  [{'OK' if has_region else 'FAIL'}] region page link present")
    if not has_region: ok = False
    # 9. no absolute medical promises
    bad = re.findall(r'\b(100%\s*(cure|effective|success)|guarantee[ds]?\s+(cure|success)|best\s+doctor|cure\s+all)\b', body, re.I)
    print(f"  [{'OK' if not bad else 'FAIL'}] no absolute promises (found: {bad})")
    if bad: ok = False
    # 10. 2026 estimates phrase
    has_est = '2026 estimates' in body
    print(f"  [{'OK' if has_est else 'FAIL'}] '2026 estimates' phrase present")
    if not has_est: ok = False
    # 11. schema mainEntityOfPage trailing slash URL matches slug
    a = [o for o in schema if o.get('@type') == 'Article'][0]
    main_url = a.get('mainEntityOfPage', {}).get('@id', '')
    slug = path.split('/')[-1].replace('.md', '')
    expected = f'https://chinahospitalsguide.com/blog/{slug}/'
    print(f"  [{'OK' if main_url == expected else 'FAIL'}] schema @id: {main_url}")
    if main_url != expected: ok = False
    print(f"  RESULT: {'PASS ✅' if ok else 'FAIL ❌'}")
    return ok

all_ok = True
for a in ARTICLES:
    if not check_md(a): all_ok = False
sys.exit(0 if all_ok else 1)
