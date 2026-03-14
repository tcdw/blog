import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const indexPath = join(ROOT, "SilverBlog", "documents", "index.json");
const entries = JSON.parse(readFileSync(indexPath, "utf-8"));

const outputDir = join(ROOT, "src", "content", "blog");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

/**
 * Escape a string for use as a YAML single-quoted scalar.
 * The only escape in single-quoted YAML is '' for a literal '.
 */
function yamlQuote(str) {
  return "'" + str.replace(/'/g, "''") + "'";
}

/**
 * Convert Unix timestamp (seconds) to ISO 8601 string.
 */
function unixToISO(ts) {
  return new Date(ts * 1000).toISOString();
}

/**
 * Clean excerpt for use as description:
 * take the first paragraph and collapse newlines to spaces.
 */
function cleanDescription(excerpt) {
  const firstPara = excerpt.split("\n\n")[0];
  return firstPara.replace(/\n/g, " ").trim();
}

let successCount = 0;
let skipCount = 0;

for (const entry of entries) {
  const { Name, UUID, Title, Time, UpdateTime, Excerpt } = entry;

  const srcPath = join(ROOT, "SilverBlog", "documents", "post", `${UUID}.md`);
  if (!existsSync(srcPath)) {
    console.warn(`SKIP: Source file not found for "${Name}" (${UUID})`);
    skipCount++;
    continue;
  }
  const content = readFileSync(srcPath, "utf-8");

  // Build frontmatter
  const fm = ["---"];
  fm.push(`title: ${yamlQuote(Title)}`);

  if (Excerpt) {
    fm.push(`description: ${yamlQuote(cleanDescription(Excerpt))}`);
  }

  fm.push(`pubDate: ${yamlQuote(unixToISO(Time))}`);

  if (UpdateTime && UpdateTime !== Time) {
    fm.push(`updatedDate: ${yamlQuote(unixToISO(UpdateTime))}`);
  }

  fm.push("---");

  const output = fm.join("\n") + "\n\n" + content;

  const targetPath = join(outputDir, `${Name}.md`);
  if (existsSync(targetPath)) {
    console.warn(`SKIP: Target already exists: ${Name}.md`);
    skipCount++;
    continue;
  }

  writeFileSync(targetPath, output, "utf-8");
  console.log(`OK: ${Name}.md`);
  successCount++;
}

console.log(`\nMigration complete: ${successCount} posts created, ${skipCount} skipped.`);
