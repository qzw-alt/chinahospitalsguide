module.exports = function(eleventyConfig) {
  // Passthrough copy: static assets that don't need processing
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("ga4-events.js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Watch targets for live reload during development
  eleventyConfig.addWatchTarget("styles.css");
  eleventyConfig.addWatchTarget("images/");

  // Ignore markdown source files that conflict with existing HTML
  // (e.g., blog/*.md when blog/*.html already exists)
  eleventyConfig.ignores.add("blog/*.md");
  eleventyConfig.ignores.add("news/*.md");
  eleventyConfig.ignores.add(".agents/");

  // Ignore duplicate content directories (canonical versions are in /blog/)
  eleventyConfig.ignores.add("blog-articles/");
  eleventyConfig.ignores.add("blog-export/");
  eleventyConfig.ignores.add("docs/");

  // HTML files without frontmatter are auto-passthrough-copied (not skipped)
  // 2026-07-10: Blog/news/stories/treatments stay as passthrough for now.
  // Core pages are converted to .njk (Eleventy outputs them as .html).
  // New blog posts should use blog-post.njk layout via frontmatter.
  eleventyConfig.addPassthroughCopy("news/");
  eleventyConfig.addPassthroughCopy("blog/");
  eleventyConfig.addPassthroughCopy("stories/");
  eleventyConfig.addPassthroughCopy("treatments/");
  // Root HTML files — only passthrough the ones we haven't converted to .njk yet
  const glob = require("glob");
  glob.sync("*.html").forEach(file => {
    // Skip files that have a .njk counterpart (template takes precedence)
    const njkPath = file.replace(/\.html$/, '.njk');
    if (!require('fs').existsSync(njkPath)) {
      eleventyConfig.addPassthroughCopy(file);
    }
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md"]
  };
};
