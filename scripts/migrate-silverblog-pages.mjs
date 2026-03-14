import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SILVER_PAGES = join(ROOT, "SilverBlog", "documents", "page");
const ASTRO_PAGES = join(ROOT, "src", "pages", "page");

// ── 1. About page ──────────────────────────────────────────────

const aboutContent = readFileSync(join(SILVER_PAGES, "0eb2cc55-f281-56d3-9a61-bb680c902a6f"), "utf-8");
writeFileSync(join(ASTRO_PAGES, "_about.md"), aboutContent, "utf-8");
console.log("OK: _about.md");

// ── 2. Links page ──────────────────────────────────────────────

const linksContent = readFileSync(join(SILVER_PAGES, "f35ac53d-96ec-5300-b58d-4a0f1cf68a1b"), "utf-8");

/**
 * Decode common HTML entities.
 */
function decodeEntities(str) {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

/**
 * Escape a string for use inside an Astro component attribute (double-quoted).
 */
function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// Parse the HTML to extract categories and friend entries.
// Structure: <h3 class="friends-title">CATEGORY</h3> followed by <ul class="friends-grid">...</ul>
// Each <li> contains: href, img src, name, description

const categories = [];
// Split by <h3 class="friends-title"> to get each category section
const categoryParts = linksContent.split(/<h3 class="friends-title">/);

for (let i = 1; i < categoryParts.length; i++) {
  const part = categoryParts[i];

  // Extract category title
  const titleMatch = part.match(/^(.+?)<\/h3>/);
  if (!titleMatch) continue;
  const categoryTitle = decodeEntities(titleMatch[1].trim());

  // Extract all friend entries from <li class="friends-item"> blocks
  const friends = [];
  const liRegex = /<li class="friends-item">([\s\S]*?)<\/li>/g;
  let liMatch;
  while ((liMatch = liRegex.exec(part)) !== null) {
    const li = liMatch[1];

    const hrefMatch = li.match(/href="([^"]+)"/);
    const imgMatch = li.match(/src="([^"]+)"/);
    const nameMatch = li.match(/<p class="friends-item__name">(.+?)<\/p>/);
    const descMatch = li.match(/<aside class="friends-item__description">(.*?)<\/aside>/);

    if (!hrefMatch || !nameMatch) continue;

    friends.push({
      url: decodeEntities(hrefMatch[1]),
      avatarUrl: imgMatch ? decodeEntities(imgMatch[1]) : undefined,
      name: decodeEntities(nameMatch[1].trim()),
      description: descMatch ? decodeEntities(descMatch[1].trim()) : "",
    });
  }

  categories.push({ title: categoryTitle, friends });
}

// Extract the bottom section (友链申请) - the <div class="prose ..."> block
const proseMatch = linksContent.match(/<div\s[^>]*class="prose[\s\S]*$/);
const bottomHTML = proseMatch ? proseMatch[0].trim() : "";

// Keep as raw HTML (markdown supports inline HTML).
// Just strip the outer <div class="prose ..."> wrapper since MarkdownBody provides its own.
function stripProseWrapper(html) {
  return (
    html
      .replace(/^<div\s+[^>]*class="prose[^"]*"[^>]*>\s*/s, "")
      .replace(/\s*<\/div>\s*$/s, "")
      .trim() + "\n"
  );
}

const linksMarkdown = stripProseWrapper(bottomHTML);
writeFileSync(join(ASTRO_PAGES, "_links.md"), linksMarkdown, "utf-8");
console.log("OK: _links.md");

// Generate links.astro
function generateFriendTag(friend) {
  const attrs = [`url="${escapeAttr(friend.url)}"`, `name="${escapeAttr(friend.name)}"`];
  if (friend.description) {
    attrs.push(`description="${escapeAttr(friend.description)}"`);
  }
  if (friend.avatarUrl) {
    attrs.push(`avatarUrl="${escapeAttr(friend.avatarUrl)}"`);
  }
  return `        <Friend ${attrs.join(" ")} />`;
}

const friendSections = categories
  .map(cat => {
    const friendTags = cat.friends.map(generateFriendTag).join("\n");
    return `    <FriendCategoryTitle>${cat.title}</FriendCategoryTitle>
    <FriendList>
${friendTags}
    </FriendList>`;
  })
  .join("\n");

const linksAstro = `---
import BlogPage from "../../layouts/BlogPage.astro";
import Friend from "../../components/friend/Friend.astro";
import FriendList from "../../components/friend/FriendList.astro";
import FriendCategoryTitle from "../../components/friend/FriendCategoryTitle.astro";
import MarkdownBody from "../../components/MarkdownBody.astro";

import * as markdownData from "./_links.md";
---

<BlogPage title="链接" description="">
${friendSections}
    <MarkdownBody class="mt-6">
        <markdownData.Content />
    </MarkdownBody>
</BlogPage>
`;

writeFileSync(join(ASTRO_PAGES, "links.astro"), linksAstro, "utf-8");
console.log("OK: links.astro");

console.log(`\nPage migration complete.`);
console.log(`  Categories: ${categories.length}`);
console.log(`  Total friends: ${categories.reduce((sum, c) => sum + c.friends.length, 0)}`);
