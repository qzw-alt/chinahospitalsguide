// Clean the Eleventy output directory before a build.
// Without this, deleted source files leave stale HTML behind in _site/,
// which then get walked into sitemap.xml (dead links) and deployed.
const fs = require('fs');

try {
  fs.rmSync('_site', { recursive: true, force: true });
  console.log('Cleaned _site');
} catch (e) {
  console.error('Failed to clean _site:', e.message);
  process.exit(1);
}
