"""Convert root HTML pages to Nunjucks (.njk) templates with frontmatter."""
import re, os

pages = [
    'index.html', 'pricing.html', 'about.html', 'services.html',
    'how-it-works.html', 'hospitals.html', 'contact.html', 'contact-new.html'
]

for fname in pages:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    title_m = re.search(r'<title>(.+?)</title>', html)
    title = title_m.group(1) if title_m else 'Untitled'

    desc_m = re.search(r'<meta name="description" content="(.+?)"', html)
    description = desc_m.group(1) if desc_m else ''

    canon_m = re.search(r'<link rel="canonical" href="(.+?)"', html)
    canonical = canon_m.group(1) if canon_m else ''

    # Page-specific <style>
    style_m = re.search(r'(<style>.*?</style>)', html, re.DOTALL)
    page_style = ''
    if style_m:
        raw = style_m.group(1)
        page_style = re.sub(r'</?style>', '', raw).strip()

    og_title_m = re.search(r'<meta property="og:title" content="(.+?)"', html)
    og_title = og_title_m.group(1) if og_title_m else ''
    og_desc_m = re.search(r'<meta property="og:description" content="(.+?)"', html)
    og_desc = og_desc_m.group(1) if og_desc_m else ''

    # Hreflang links (index.html)
    hreflangs = re.findall(r'<link rel="alternate" hreflang=.+?>', html)

    # Schema blocks
    schemas = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)

    # Extract body content between nav and footer
    body_match = re.search(r'<body[^>]*>(.*?)<footer class="site-footer"', html, re.DOTALL)
    body_html = ''
    if body_match:
        body_html = body_match.group(1)
        # Remove nav block
        body_html = re.sub(r'<div class="nav-overlay".*?</nav>', '', body_html, flags=re.DOTALL)
        # Remove exit popup
        body_html = re.sub(r'<div id="exitPopup">.*?</div>\s*<script>.*?exitPopup.*?</script>', '', body_html, flags=re.DOTALL)
        # Remove floating buttons
        body_html = re.sub(r'<div class="floating-buttons">.*?</div>', '', body_html, flags=re.DOTALL)
        # Remove mobile bottom bar
        body_html = re.sub(r'<div class="mobile-bottom-bar">.*?</div>', '', body_html, flags=re.DOTALL)
        # Remove inline nav toggle scripts
        body_html = re.sub(r'<script>.*?navToggle.*?</script>', '', body_html, flags=re.DOTALL)
        body_html = body_html.strip()

    # Build frontmatter
    fm = ['---']
    fm.append('layout: base.njk')

    def esc(s):
        return s.replace('"', '\\"').replace('\n', '\\n')

    fm.append(f'title: "{esc(title)}"')
    if description:
        fm.append(f'description: "{esc(description)}"')
    if canonical:
        fm.append(f'canonical: "{canonical}"')
    if og_title and og_title != title:
        fm.append(f'ogTitle: "{esc(og_title)}"')
    if og_desc and og_desc != description:
        fm.append(f'ogDescription: "{esc(og_desc)}"')

    if page_style:
        fm.append('pageStyle: |')
        for line in page_style.split('\n'):
            fm.append(f'  {line}')

    if hreflangs:
        hl_str = ''.join(hreflangs)
        fm.append(f'extraHead: "{esc(hl_str)}"')

    if schemas:
        fm.append('schema: |')
        for s in schemas:
            for line in s.strip().split('\n'):
                fm.append(f'  {line}')

    fm.append('---')
    frontmatter = '\n'.join(fm)
    output = frontmatter + '\n' + body_html + '\n'

    outname = fname.replace('.html', '.njk')
    with open(outname, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f'OK {fname} -> {outname}  ({len(body_html)} chars content, {len(page_style)} css, {len(schemas)} schemas)')
