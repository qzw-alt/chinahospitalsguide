/**
 * 404 URL Checker for chinahospitalsguide.com
 * Parses sitemap.xml and verifies all URLs have corresponding files in _site/
 * Run: node _check_urls.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const SITE_DIR = path.join(__dirname, '_site');
const REDIRECTS_PATH = path.join(__dirname, '_redirects');

function parseSitemap(xmlPath) {
    const xml = fs.readFileSync(xmlPath, 'utf-8');
    const urls = [];
    const regex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

function parseRedirects(redirectsPath) {
    if (!fs.existsSync(redirectsPath)) return new Set();
    const content = fs.readFileSync(redirectsPath, 'utf-8');
    const redirectSources = new Set();
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
            redirectSources.add(parts[0]); // source path
        }
    }
    return redirectSources;
}

function urlToFilePath(url, baseUrl = 'https://chinahospitalsguide.com') {
    // Remove base URL to get path
    let relPath = url.replace(baseUrl, '');
    if (!relPath.startsWith('/')) relPath = '/' + relPath;

    // If it's a root path like "/" → index.html
    if (relPath === '/') return path.join(SITE_DIR, 'index.html');

    // If it ends with /, it's a directory with index.html inside
    if (relPath.endsWith('/')) {
        return path.join(SITE_DIR, relPath, 'index.html');
    }

    // Otherwise it's a direct file path
    return path.join(SITE_DIR, relPath);
}

function main() {
    console.log('=== chinahospitalsguide.com 404 URL Checker ===\n');

    if (!fs.existsSync(SITEMAP_PATH)) {
        console.error('ERROR: sitemap.xml not found at', SITEMAP_PATH);
        process.exit(1);
    }

    if (!fs.existsSync(SITE_DIR)) {
        console.error('ERROR: _site/ directory not found. Run eleventy build first.');
        process.exit(1);
    }

    const urls = parseSitemap(SITEMAP_PATH);
    const redirects = parseRedirects(REDIRECTS_PATH);
    console.log(`Total URLs in sitemap: ${urls.length}`);
    console.log(`Redirects in _redirects: ${redirects.size}\n`);

    const missing = [];
    const hasRedirect = [];
    let checked = 0;

    for (const url of urls) {
        checked++;
        const filePath = urlToFilePath(url);

        if (fs.existsSync(filePath)) {
            continue; // File exists, all good
        }

        // Check if this URL has a redirect entry
        const urlPath = new URL(url).pathname;
        if (redirects.has(urlPath) || redirects.has(urlPath.replace(/\/$/, '')) || redirects.has(urlPath + '/')) {
            hasRedirect.push({ url, filePath, reason: 'Has redirect in _redirects' });
            continue;
        }

        missing.push({ url, filePath, reason: 'File not found in _site/' });
    }

    console.log(`Checked: ${checked}`);
    console.log(`  OK: ${checked - missing.length - hasRedirect.length}`);
    console.log(`  Redirected: ${hasRedirect.length}`);
    console.log(`  404: ${missing.length}\n`);

    if (hasRedirect.length > 0) {
        console.log('--- Redirected URLs (OK, these are handled by Netlify) ---');
        for (const item of hasRedirect) {
            console.log(`  [REDIRECT] ${item.url}`);
        }
        console.log();
    }

    if (missing.length > 0) {
        console.log('--- MISSING FILES (Will 404!) ---');
        for (const item of missing) {
            console.log(`  [404] ${item.url}`);
            console.log(`        Expected: ${item.filePath}`);
        }
        console.log();
    } else {
        console.log(' All sitemap URLs verified OK!');
    }

    // Additional check: look for _site files that are NOT in sitemap (orphaned pages)
    console.log('\n--- Orphaned Pages Check (files in _site/ not in sitemap) ---');
    const sitemapUrlPaths = new Set(urls.map(u => new URL(u).pathname));

    function findOrphaned(dir, baseDir) {
        const orphans = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                orphans.push(...findOrphaned(fullPath, baseDir));
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                const relPath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
                // Normalize: /index.html → /
                const normalized = relPath === '/index.html' ? '/' :
                    relPath.replace(/\/index\.html$/, '/');
                if (!sitemapUrlPaths.has(normalized) && !sitemapUrlPaths.has(relPath)) {
                    orphans.push(relPath);
                }
            }
        }
        return orphans;
    }

    const orphans = findOrphaned(SITE_DIR, SITE_DIR);
    if (orphans.length > 0) {
        console.log(`Found ${orphans.length} HTML files not in sitemap:`);
        for (const o of orphans.slice(0, 20)) {
            console.log(`  [ORPHAN] ${o}`);
        }
        if (orphans.length > 20) console.log(`  ... and ${orphans.length - 20} more`);
    } else {
        console.log(' No orphaned pages found.');
    }

    // Summary
    console.log('\n=== Summary ===');
    console.log(`Sitemap URLs: ${urls.length}`);
    console.log(`Verified OK: ${checked - missing.length - hasRedirect.length}`);
    console.log(`With Redirects: ${hasRedirect.length}`);
    console.log(`404 Errors: ${missing.length}`);
    console.log(`Orphaned Pages: ${orphans.length}`);
}

main();
