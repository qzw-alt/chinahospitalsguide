const fs = require('fs');
const path = require('path');

module.exports = function() {
  const newsDir = path.join(__dirname, '..', 'news');
  const files = fs.readdirSync(newsDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}-.+\.html$/.test(f))
    .map(f => {
      const fullPath = path.join(newsDir, f);
      // Parse date from filename prefix (YYYY-MM-DD)
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : '';
      // Read title from file
      let title = '';
      try {
        const html = fs.readFileSync(fullPath, 'utf8');
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        if (titleMatch) {
          title = titleMatch[1].replace(/ \| China Hospitals Guide$/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      } catch(e) { title = f.replace(/\.html$/, ''); }
      return { file: f, date, title, sortKey: date || '0000-00-00' };
    })
    // Sort by filename date descending (not mtime — unreliable on CI clones)
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .slice(0, 3);

  return files.map(f => ({
    url: `/news/${f.file}`,
    title: f.title || f.file,
    date: f.date
  }));
};
