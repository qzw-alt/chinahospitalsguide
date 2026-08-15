#!/usr/bin/env python3
"""Update internal links from old car-t-therapy-hospitals .html to trailing-slash URL."""
import io

files = [
    "blog/2026-08-07-in-vivo-car-t-liver-cancer-cellorigin-walvax-gpc3.md",
    "blog/best-hospitals-china-international-patients.html",
    "blog/2026-08-12-indonesia-bpom-nmpa-regulatory-cooperation-cart-tcm.md",
    "blog/best-cancer-hospitals-china-2026.html",
    "blog/crispr-gene-therapy-china-clinical-trials.html",
    "blog/car-t-clinical-trials-china-2026.html",
    "blog/car-t-lymphoma-china-cost.md",
    "blog/index.html",
]

old_full = "https://chinahospitalsguide.com/blog/car-t-therapy-hospitals-china-2026.html"
new_full = "https://chinahospitalsguide.com/blog/car-t-therapy-hospitals-china-2026/"
old_rel = "car-t-therapy-hospitals-china-2026.html"
new_rel = "car-t-therapy-hospitals-china-2026/"

for f in files:
    with io.open(f, encoding="utf-8") as fh:
        c = fh.read()
    c2 = c.replace(old_full, new_full).replace(old_rel, new_rel)
    if c2 != c:
        with io.open(f, "w", encoding="utf-8") as fh:
            fh.write(c2)
        print("UPDATED", f)
    else:
        print("no change", f)
