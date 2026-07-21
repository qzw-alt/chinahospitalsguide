const fs = require('fs');
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');

const updates = {
    'lasik-eye-surgery-china-2026.html': '2026-07-17',
    'fuzhou-orthopedic-hospital-rankings-2026.html': '2026-07-17'
};

for (const [page, date] of Object.entries(updates)) {
    const pattern = new RegExp(
        '(<loc>https://chinahospitalsguide\\.com/blog/' +
        page.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '</loc>\\s*<lastmod>)[^<]+(</lastmod>)',
        'g'
    );
    const before = sitemap;
    sitemap = sitemap.replace(pattern, '$1' + date + '$2');
    if (sitemap !== before) {
        console.log('Updated lastmod for ' + page + ' to ' + date);
    } else {
        console.log('WARNING: Could not find ' + page + ' in sitemap');
    }
}

fs.writeFileSync('sitemap.xml', sitemap);
console.log('Sitemap updated successfully');
