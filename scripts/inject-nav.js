// Post-build: give legacy pages the same top navbar as the rest of the site.
//
// Most pages get the navbar from _includes/nav.njk via _layouts/base.njk. The
// legacy pages (hand-written blog/*.html, stories/, zh/, and a few root files)
// are passthrough copies with no frontmatter, so they cannot use the layout and
// never received a navbar. Some were worse off: an older injection put the navbar
// markup inside the <head> JSON-LD script of 33 blog posts, which both hid the
// navbar and split a JSON string so the structured data no longer parsed.
//
// Because the source of these pages is not a template we can include into, the
// navbar is copied from the rendered home page each build. That keeps one source
// of truth (nav.njk) instead of ~100 hand-maintained copies that drift apart.
const fs = require('fs');
const path = require('path');

const SITE = process.env.NAV_SITE || path.join(__dirname, '..', '_site');
const CANONICAL = path.join(SITE, 'index.html');

// Navbar payload, taken from the rendered home page so it always matches nav.njk.
function loadNavPayload() {
  const html = fs.readFileSync(CANONICAL, 'utf8');
  const m = html.match(/<div class="nav-overlay"[\s\S]*?<\/nav>/);
  if (!m) throw new Error('inject-nav: could not find navbar in _site/index.html');
  return m[0];
}

// Pages that must not receive a navbar: error pages, internal docs, generated
// stubs, and directories that should not be published at all.
const SKIP_PATH = /^(404\.html|panel\.html|api\/|reports\/|figma-friends-circle\/|BLOG-PUBLISHING-SOP\/|blog-articles\/|news\/|treatments\/|services\/)/;

// The navbar is position:fixed at 70px tall, so a page needs 70px of top padding
// or the navbar covers its first line. Pages that already reserve space for a
// navbar declare it themselves; only add the offset when nothing does.
function hasOwnNavOffset(html) {
  for (const block of html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []) {
    const bodyRule = block.match(/(^|[},])\s*(body|html)\s*\{([^}]*)\}/i);
    if (bodyRule) {
      const pad = bodyRule[3].match(/padding-top\s*:\s*(\d+)px/i);
      if (pad && Number(pad[1]) >= 56) return true;
    }
    if (/padding-top\s*:\s*(1[0-9]{2}|[6-9][0-9])px\s*!important/i.test(block)) return true;
  }
  return false;
}

const OFFSET_STYLE =
  '<style data-nav-offset>body{padding-top:70px}' +
  '@media(max-width:768px){body{padding-top:64px}}</style>';

// Pages built before the shared layout keep their own stylesheet, which targets the
// same names the shared navbar uses (.nav-container, .nav-links, .nav-logo) and
// sometimes a bare `nav`. That CSS was written for the navbar we just removed and
// now fights the one we inject — on one post it dims the links to grey on navy, on
// another it turns the bar white and sticky, on another it wraps the links so the
// bar grows to 117px.
//
// Rather than hand-edit dozens of stylesheets (several rules sit inside media
// queries, where a careless edit breaks the page), copy the navbar rules straight
// out of the real stylesheet and re-emit them as a page-local guard. Doubling each
// class name and forcing !important means the shared navbar always wins regardless
// of where the page's own rules sit, and because the guard is generated it cannot
// drift from styles.css.
function loadNavGuard() {
  const css = fs.readFileSync(path.join(SITE, 'styles.css'), 'utf8');
  const NAV_SEL = /(^|[\s,>+~])(\.navbar|\.nav-container|\.nav-links|\.nav-logo|\.nav-cta|\.nav-cta-mobile|\.nav-lang|\.lang-flag|\.nav-toggle|\.nav-overlay)\b/;

  const important = body => body.split(';')
    .map(d => d.trim())
    .filter(Boolean)
    .map(d => /!important$/.test(d) ? d : d + '!important')
    .join(';');

  // .navbar -> .navbar.navbar so a page's single-class !important rule still loses
  const boost = sel => sel.split(',').map(part => {
    const t = part.trim();
    const m = t.match(/^\.[A-Za-z0-9_-]+/);
    return m ? m[0] + t : t;
  }).join(',');

  function filter(css) {
    let out = '', i = 0;
    while (i < css.length) {
      let j = i;
      while (j < css.length && css[j] !== '{' && css[j] !== '}') j++;
      if (j >= css.length) break;
      if (css[j] === '}') { i = j + 1; continue; }
      const sel = css.slice(i, j).trim();
      i = j + 1;
      let depth = 1, k = i;
      while (k < css.length && depth > 0) {
        if (css[k] === '{') depth++;
        else if (css[k] === '}') { depth--; if (depth === 0) break; }
        k++;
      }
      const body = css.slice(i, k);
      i = k + 1;
      if (sel.startsWith('@')) {
        if (/^@(media|supports)/i.test(sel)) {
          const inner = filter(body);
          if (inner.trim()) out += sel + '{' + inner + '}';
        }
      } else if (NAV_SEL.test(sel)) {
        out += boost(sel) + '{' + important(body) + '}';
      }
    }
    return out;
  }
  return '<style data-nav-guard>' + filter(css) + '</style>';
}

// Guarded so a page that already carries the navbar script does not bind the
// toggle twice (double-binding makes the menu open and immediately close).
const NAV_SCRIPT =
  '<script data-nav-script>(function(){' +
  'var t=document.getElementById("navToggle"),l=document.getElementById("navLinks");' +
  'if(!t||!l||t.dataset.navBound)return;t.dataset.navBound="1";' +
  'var o=document.getElementById("navOverlay");' +
  'function c(){l.classList.remove("active");if(o)o.classList.remove("active");}' +
  't.addEventListener("click",function(){l.classList.toggle("active");if(o)o.classList.toggle("active");});' +
  'if(o)o.addEventListener("click",c);' +
  'document.querySelectorAll(".nav-links a").forEach(function(a){a.addEventListener("click",c);});' +
  'document.addEventListener("keydown",function(e){if(e.key==="Escape")c();});' +
  '})();</script>';

// Index just past the close tag matching the element that opens at openIdx.
const VOID_TAGS = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'track', 'wbr', 'area', 'base', 'col', 'embed', 'param']);
function matchingClose(html, openIdx) {
  const m = html.slice(openIdx).match(/^<([a-zA-Z][a-zA-Z0-9]*)\b/);
  if (!m) return -1;
  const tag = m[1].toLowerCase();
  if (VOID_TAGS.has(tag)) return openIdx + m[0].length;
  const re = new RegExp('<' + tag + '\\b|</' + tag + '\\s*>', 'gi');
  re.lastIndex = openIdx;
  let depth = 0, hit;
  while ((hit = re.exec(html))) {
    if (hit[0][1] === '/') { depth--; if (depth === 0) return hit.index + hit[0].length; }
    else depth++;
  }
  return -1;
}

// An earlier injection left navbar markup stranded inside <head> (in a JSON-LD
// script on 31 posts and a <style> rule on some). Excise any such navbar and
// swallow the whitespace around it, so a JSON string or CSS declaration that was
// torn in half rejoins exactly.
function stripStaleNav(html) {
  let out = html;
  let stripped = 0;
  for (;;) {
    const navStart = out.indexOf('<nav class="navbar"');
    if (navStart === -1) break;
    const navEnd = out.indexOf('</nav>', navStart);
    if (navEnd === -1) break;

    let start = navStart;
    // The overlay div immediately precedes the navbar it belongs to.
    const overlayStart = out.lastIndexOf('<div class="nav-overlay"', navStart);
    if (overlayStart !== -1 && /<div class="nav-overlay"[^>]*><\/div>\s*$/.test(out.slice(overlayStart, navStart))) {
      start = overlayStart;
    }
    let end = navEnd + '</nav>'.length;
    while (start > 0 && /\s/.test(out[start - 1])) start--;
    while (end < out.length && /\s/.test(out[end])) end++;

    out = out.slice(0, start) + out.slice(end);
    stripped++;
  }
  return { html: out, stripped };
}

// Pages built before the shared layout each carry their own navbar under one of
// several names: <nav>, <nav class="nav-header">, <div class="nav-bar">, or a
// <header> wrapping a <nav>. None has the mobile toggle, so the check above does
// not see them and a second navbar would be stacked on top. Drop whichever one
// sits at the top of the body; anything that is not a navigation list is left be.
function stripOwnNav(html) {
  let out = html;
  let stripped = 0;
  for (;;) {
    const bodyTag = out.match(/<body[^>]*>/);
    if (!bodyTag) break;
    let i = out.indexOf(bodyTag[0]) + bodyTag[0].length;
    // skip whitespace and comments so "<!-- HEADER with nav -->" does not stop us
    for (;;) {
      const skip = out.slice(i).match(/^(?:\s|<!--[\s\S]*?-->)+/);
      if (!skip) break;
      i += skip[0].length;
    }
    const tagM = out.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/);
    if (!tagM) break;
    const tag = tagM[1].toLowerCase();
    const isNavBar = tag === 'nav' || tag === 'header' || (tag === 'div' && /\bnav-bar\b/.test(tagM[0]));
    if (!isNavBar) break;

    const end = matchingClose(out, i);
    if (end === -1) break;
    if (!/class="nav-links"/.test(out.slice(i, end))) break;   // not a navigation list

    let e2 = end;
    while (e2 < out.length && /\s/.test(out[e2])) e2++;
    out = out.slice(0, i) + out.slice(e2);
    stripped++;
  }
  return { html: out, stripped };
}

// Does the page's own <style> restyle the navbar's class names or a bare `nav`?
const NAV_CLASSES = /(^|[\s,>+~])(\.navbar|\.nav-container|\.nav-links|\.nav-logo|\.nav-cta|\.nav-lang|\.lang-flag|\.nav-toggle|\.nav-overlay)\b/;
const BARE_NAV = /(^|[\s,}{])nav\s*(,|\{|$)/i;
function hasNavCssCollision(html) {
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    if (NAV_CLASSES.test(m[1]) || BARE_NAV.test(m[1])) return true;
  }
  return false;
}

function processFile(file, navPayload, navGuard) {
  const rel = path.relative(SITE, file).split(path.sep).join('/');
  if (SKIP_PATH.test(rel)) return null;

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('http-equiv="refresh"')) return null;       // redirect stub

  const bodyOpen = html.match(/<body[^>]*>/);
  if (!bodyOpen) return null;
  const bodyIdx = html.indexOf(bodyOpen[0]) + bodyOpen[0].length;

  // A navbar counts only when it sits in the body. 33 posts carry a stranded copy
  // in <head> (inside a JSON-LD script) that renders nothing, so those pages must
  // still be treated as missing one.
  if (html.slice(bodyIdx).includes('class="nav-toggle"')) return null;

  const stale = stripStaleNav(html);
  const own = stripOwnNav(stale.html);
  const stripped = stale.stripped + own.stripped;
  html = own.html;

  const newBody = html.match(/<body[^>]*>/);
  const insertAt = html.indexOf(newBody[0]) + newBody[0].length;
  html = html.slice(0, insertAt) + navPayload + html.slice(insertAt);

  const notes = [];
  if (stripped) notes.push('removed ' + stripped + ' stale nav');
  if (!hasOwnNavOffset(html)) {
    html = html.replace(/<\/head>/i, OFFSET_STYLE + '</head>');
    notes.push('added offset');
  }
  // only worth carrying where the page brings its own stylesheet that collides
  if (hasNavCssCollision(html)) {
    html = html.replace(/<\/head>/i, navGuard + '</head>');
    notes.push('added nav guard');
  }
  if (!html.includes("getElementById('navToggle')") && !html.includes('getElementById("navToggle")')) {
    html = html.replace(/<\/body>/i, NAV_SCRIPT + '</body>');
    notes.push('added script');
  }

  fs.writeFileSync(file, html);
  return { rel, notes: notes.join(', ') };
}

// Exported so one-off migrations can reuse the same strip logic instead of
// reimplementing it; the build only runs the walk below.
module.exports = { stripStaleNav, stripOwnNav, matchingClose };

if (require.main === module) {
  const navPayload = loadNavPayload();
  const navGuard = loadNavGuard();
  const results = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!e.name.startsWith('_') && !e.name.startsWith('.')) walk(full);
      } else if (e.name.endsWith('.html')) {
        const r = processFile(full, navPayload, navGuard);
        if (r) results.push(r);
      }
    }
  })(SITE);

  for (const r of results) console.log('  nav -> ' + r.rel + (r.notes ? '  [' + r.notes + ']' : ''));
  console.log('inject-nav: navbar added to ' + results.length + ' pages');
}
