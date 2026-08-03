const fs = require('fs');
const path = require('path');

module.exports = function() {
  // 2026-08-03: news/ 版面已删除 — read latest articles from blog/ instead.
  const blogDir = path.join(__dirname, '..', 'blog');
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}-.+\.(html|md)$/.test(f))
    .map(f => {
      const fullPath = path.join(blogDir, f);
      // Parse date from filename prefix (YYYY-MM-DD)
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : '';
      // Read title from file
      let title = '';
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (f.endsWith('.md')) {
          // frontmatter title
          const titleMatch = content.match(/^title:\s*"([^"]+)"/m) || content.match(/^title:\s*(.+)$/m);
          if (titleMatch) title = titleMatch[1].trim();
        } else {
          const titleMatch = content.match(/<title>([^<]+)<\/title>/);
          if (titleMatch) {
            title = titleMatch[1].replace(/ \| China Hospitals Guide$/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }
        }
      } catch(e) { title = f.replace(/\.(html|md)$/, ''); }
      // .md renders as trailing-slash directory URL; .html serves as-is
      const url = f.endsWith('.md')
        ? `/blog/${f.replace(/\.md$/, '')}/`
        : `/blog/${f}`;
      return { file: f, date, title, url, sortKey: date || '0000-00-00' };
    })
    // Sort by filename date descending (not mtime — unreliable on CI clones)
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .slice(0, 3);

  return files.map(f => ({
    url: f.url,
    title: f.title || f.file,
    date: f.date
  }));
};
