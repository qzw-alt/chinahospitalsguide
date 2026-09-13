// Render the medical tourism guide to a print-ready PDF.
//
// Run manually AFTER a build, from the repo root:
//   npx eleventy && node scripts/generate-guide-pdf.js
//
// Output (downloads/medical-tourism-guide-2026.pdf) is committed to the repo:
// CI (GitHub Actions) has no Chromium, so the PDF is a static asset, not a build step.
// Re-run this whenever the guide's content changes.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SRC = path.resolve('_site/medical-tourism-guide.html');
const OUT_DIR = path.resolve('downloads');
const OUT = path.join(OUT_DIR, 'medical-tourism-guide-2026.pdf');

const PRINT_CSS = `
  @page { size: A4; margin: 15mm 14mm 18mm; }

  nav, .toc-sidebar, .toc-toggle, .toc-mobile,
  footer, .site-footer, .floating-elements, .mobile-bottom-bar,
  .pdf-download-strip, #matchForm, .hero-actions, script { display: none !important; }

  body { background: #fff !important; font-size: 11pt; }
  .guide-container { display: block !important; max-width: 100% !important; padding: 0 !important; }
  .guide-hero { padding: 24px 20px !important; margin-bottom: 24px !important; border-radius: 10px; }
  .guide-hero h1 { font-size: 22pt !important; }
  .guide-hero .subtitle { font-size: 11pt !important; }
  .guide-content h2 { font-size: 15pt !important; margin-top: 26px !important; padding-top: 20px !important; page-break-after: avoid; }
  .guide-content h3 { font-size: 12pt !important; page-break-after: avoid; }

  /* Keep tables and boxes intact across page breaks */
  .cost-table, .info-box, .chapter-intro, .dive-deeper { page-break-inside: avoid; }
  .info-box, .chapter-intro, .dive-deeper { box-shadow: none !important; border: 1px solid #e2e8f0; }

  /* Print dive-deeper links as plain text, not web chips */
  .dive-deeper a { padding: 0 !important; border: none !important; background: none !important; color: #2a5298 !important; }
  .dive-deeper ul { display: block !important; }
  .dive-deeper li { margin-bottom: 4px !important; }

  .cta-section { page-break-inside: avoid; padding: 24px !important; margin-top: 30px !important; }
`;

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`Not found: ${SRC}\nRun "npx eleventy" first.`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + SRC.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: PRINT_CSS });

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-size:8pt;color:#94a3b8;padding:0 14mm;font-family:Helvetica,Arial,sans-serif;">' +
      'chinahospitalsguide.com &nbsp;·&nbsp; Medical Tourism in China: The Complete 2026 Guide' +
      '<span style="float:right">Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: '15mm', bottom: '18mm', left: '14mm', right: '14mm' },
  });

  await browser.close();

  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${kb} KB)`);
})();
