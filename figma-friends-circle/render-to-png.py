"""
Batch render figma-friends-circle/*.html to PNG using Playwright (headless Chromium).
Output: figma-friends-circle/png/*.png

Each HTML has its own viewport dimensions baked in via CSS (1080x1080 or 1080x1350).
We detect via element measurement and shoot full-page.
"""

import asyncio
import os
import glob
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path("/home/ubuntu/chinahospitalsguide/figma-friends-circle")
OUT = ROOT / "png"
OUT.mkdir(exist_ok=True)

HTML_FILES = sorted(glob.glob(str(ROOT / "*.html")))

async def render_one(browser, html_path: Path) -> tuple[Path, int, int]:
    """Render a single HTML to PNG at its declared dimensions."""
    page = await browser.new_page(viewport={"width": 1080, "height": 1350})
    await page.goto(f"file://{html_path}", wait_until="networkidle")
    # Measure actual .card element size to capture full content
    width, height = await page.evaluate("""() => {
        const card = document.querySelector('.card') || document.body;
        const r = card.getBoundingClientRect();
        return [Math.ceil(r.width), Math.ceil(r.height)];
    }""")
    # Re-size viewport to match content
    await page.set_viewport_size({"width": width, "height": height})
    # Brief settle
    await page.wait_for_timeout(150)
    out_path = OUT / f"{html_path.stem}.png"
    await page.screenshot(path=str(out_path), full_page=False, omit_background=False)
    await page.close()
    return out_path, width, height

async def main():
    print(f"Rendering {len(HTML_FILES)} HTML files to PNG…")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        results = []
        for f in HTML_FILES:
            try:
                out, w, h = await render_one(browser, Path(f))
                size_kb = os.path.getsize(out) / 1024
                results.append((out, w, h, size_kb))
                print(f"  ✓ {out.name}  {w}x{h}  {size_kb:.1f} KB")
            except Exception as e:
                print(f"  ✗ {Path(f).name}: {e}")
        await browser.close()
    print(f"\nDone. {len(results)}/{len(HTML_FILES)} PNG files in {OUT}")
    return results

if __name__ == "__main__":
    asyncio.run(main())