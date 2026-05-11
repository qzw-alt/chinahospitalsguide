module.exports = function(eleventyConfig) {
  // Passthrough copy: static assets that don't need processing
  eleventyConfig.addPassthroughCopy("styles.css");
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

  // HTML files without frontmatter are auto-passthrough-copied (not skipped)
  eleventyConfig.addPassthroughCopy("news/");
  eleventyConfig.addPassthroughCopy("blog/");
  eleventyConfig.addPassthroughCopy("stories/");
  eleventyConfig.addPassthroughCopy("treatments/");
  eleventyConfig.addPassthroughCopy("services/");

  // Preserve existing URL structure: file.html stays as file.html
  // (prevents 11ty from converting to pretty URLs like file/index.html)
  eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    // Preserve existing URL structure: file.html stays as file.html
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md"]
  };
};
