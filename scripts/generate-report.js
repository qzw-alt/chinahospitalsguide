#!/usr/bin/env node
/**
 * generate-report.js — Generate customer-specific HTML report pages
 *
 * Usage:
 *   node scripts/generate-report.js <markdown-file> [--name "Customer Name"] [--case "Diagnosis"] [--type premium|basic]
 *
 * Example:
 *   node scripts/generate-report.js hospital-directory-premium-399.md --name "John Smith" --case "Nutcracker Syndrome" --type premium
 *
 * Output:
 *   reports/report-john-smith-{timestamp}.html
 */

const fs = require('fs');
const path = require('path');

// ─── Parse CLI args ──────────────────────────────────────────────
const args = process.argv.slice(2);
const mdFile = args.find(a => !a.startsWith('--'));
const opts = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && args[i+1]) { opts.name = args[i+1]; i++; }
  if (args[i] === '--case' && args[i+1]) { opts.case = args[i+1]; i++; }
  if (args[i] === '--type' && args[i+1]) { opts.type = args[i+1]; i++; }
  if (args[i] === '--output' && args[i+1]) { opts.output = args[i+1]; i++; }
}

if (!mdFile) {
  console.error('Usage: node scripts/generate-report.js <markdown-file> [--name "Name"] [--case "Diagnosis"] [--type premium|basic]');
  process.exit(1);
}

const MD_PATH = path.resolve(mdFile);
if (!fs.existsSync(MD_PATH)) {
  console.error(`File not found: ${MD_PATH}`);
  process.exit(1);
}

// ─── Read templates ──────────────────────────────────────────────
const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'report-page.html');
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
const markdown = fs.readFileSync(MD_PATH, 'utf-8');

// ─── Simple markdown to HTML converter ───────────────────────────
function mdToHtml(md) {
  let html = '';
  const lines = md.split('\n');

  let inTable = false;
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const nextLine = lines[i + 1] || '';

    // Close open tags
    function closeList() { if (inList) { html += '</ul>\n'; inList = false; } }
    function closeBlockquote() { if (inBlockquote) { html += '</blockquote>\n'; inBlockquote = false; } }

    // Inline formatting
    function inline(text) {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }

    // Images
    if (/^!\[/.test(line)) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) html += `<img src="${match[2]}" alt="${match[1]}" style="max-width:100%;border-radius:10px;margin:12px 0;">\n`;
      continue;
    }

    // Horizontal rule
    if (/^---/.test(line)) {
      closeList(); closeBlockquote();
      html += '<hr>\n';
      continue;
    }

    // Headings
    if (/^#####/.test(line)) {
      closeList(); closeBlockquote();
      html += `<h5 style="font-size:0.95rem;color:#4b5563;margin:12px 0 6px;">${inline(line.replace(/^#####\s*/, ''))}</h5>\n`;
      continue;
    }
    if (/^#### /.test(line)) {
      closeList(); closeBlockquote();
      html += `<h4 style="font-size:1rem;color:#2a5298;margin:16px 0 8px;">${inline(line.replace(/^####\s*/, ''))}</h4>\n`;
      continue;
    }
    if (/^### /.test(line)) {
      closeList(); closeBlockquote();
      html += `<h3>${inline(line.replace(/^###\s*/, ''))}</h3>\n`;
      continue;
    }
    if (/^## /.test(line)) {
      closeList(); closeBlockquote();
      html += `<h2>${inline(line.replace(/^##\s*/, ''))}</h2>\n`;
      continue;
    }
    if (/^# /.test(line)) {
      closeList(); closeBlockquote();
      html += `<h1 style="font-size:1.3rem;color:#1e3c72;margin:0 0 16px;">${inline(line.replace(/^#\s*/, ''))}</h1>\n`;
      continue;
    }

    // Blockquote
    if (/^> /.test(line)) {
      closeList();
      if (!inBlockquote) { html += '<blockquote>\n'; inBlockquote = true; }
      html += inline(line.replace(/^>\s*/, '').trim()) + '<br>\n';
      continue;
    }

    // Table
    if (/^\|.+\|$/.test(line) && line.includes('|')) {
      closeList(); closeBlockquote();
      // Skip separator row (|---|)
      if (/^\|[-:\s|]+\|$/.test(line)) {
        if (inTable) html += '</thead><tbody>\n';
        continue;
      }
      if (!inTable) { html += '<table>\n<thead>\n'; inTable = true; }
      const cells = line.split('|').filter(c => c.trim());
      const tag = inTable && !html.includes('</thead>') ? 'th' : 'td';
      html += `<tr>${cells.map(c => `<${tag}>${inline(c.trim())}</${tag}>`).join('')}</tr>\n`;
      continue;
    } else if (inTable) {
      html += '</tbody></table>\n';
      inTable = false;
    }

    // Unordered list
    if (/^[-*•] /.test(line)) {
      closeBlockquote();
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${inline(line.replace(/^[-*•]\s*/, ''))}</li>\n`;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      if (inList) { html += '</ul>\n'; inList = false; }
      if (inBlockquote) { html += '</blockquote>\n'; inBlockquote = false; }
      continue;
    }

    // Regular paragraph
    closeList(); closeBlockquote();
    html += `<p>${inline(line.trim())}</p>\n`;
  }

  // Close any remaining open tags
  if (inList) html += '</ul>\n';
  if (inBlockquote) html += '</blockquote>\n';
  if (inTable) html += '</tbody></table>\n';

  return html;
}

// ─── Generate report ─────────────────────────────────────────────
const customerName = opts.name || 'Customer';
const customerCase = opts.case || 'Medical Consultation';
const customerTitle = opts.name ? (opts.name.split(' ')[0] || opts.name) : 'Customer';
const dateStr = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});
const reportType = opts.type === 'basic' ? '¥49' : '¥399';
const badgeText = reportType === '¥49'
  ? 'Hospital Match & Plan (¥49)'
  : 'PREMIUM · Pre-Arrival Coordination (¥399)';
const title = reportType === '¥49'
  ? '中国医疗旅游医院推荐报告'
  : '🏥 中国医疗旅游医院推荐报告 · 升级版';

const contentHtml = mdToHtml(markdown);

let page = template
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{BADGE\}\}/g, badgeText)
  .replace(/\{\{SUBTITLE\}\}/g, 'Your personalized hospital recommendation report')
  .replace(/\{\{CUSTOMER_NAME\}\}/g, customerName)
  .replace(/\{\{CASE_INFO\}\}/g, customerCase)
  .replace(/\{\{DATE\}\}/g, dateStr)
  .replace(/\{\{CONTENT\}\}/g, contentHtml)
  .replace(/\{\{DESCRIPTION\}\}/g, `Personalized medical tourism report for ${customerName} - ${customerCase}`)
  .replace(/\{\{DOWNLOAD_FILENAME\}\}/g, `china-hospitals-guide-report-${customerName.toLowerCase().replace(/\s+/g, '-')}.txt`);

// Replace template placeholders in the report content
page = page
  .replace(/\[客户姓名\]/g, customerName)
  .replace(/\[客户称呼\]/g, customerTitle)
  .replace(/\[诊断\/需求\]/g, customerCase)
  .replace(/\[病症名称\]/g, customerCase)
  .replace(/\[具体技术\/术式\]/g, 'the recommended procedure');

// ─── Write output ────────────────────────────────────────────────
const safeName = customerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const timestamp = Date.now();
const filename = `report-${safeName}-${timestamp}.html`;
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const outputPath = opts.output || path.join(REPORTS_DIR, filename);
fs.writeFileSync(outputPath, page, 'utf-8');

console.log(`\n✅ Report generated!`);
console.log(`   File: ${outputPath}`);
console.log(`   Size: ${(page.length / 1024).toFixed(0)} KB`);
console.log(`   Customer: ${customerName}`);
console.log(`   Type: ${reportType}`);
console.log(`\n📎 Send this link to customer:`);
console.log(`   https://chinahospitalsguide.com/reports/${path.basename(outputPath)}\n`);
