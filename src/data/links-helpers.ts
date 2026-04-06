import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parse } from "smol-toml";

import { FRIENDS_CACHE_FILE, FRIENDS_CACHE_TTL_MS, FRIENDS_TOML_URL } from "./links.const";

export interface FriendItem {
  name: string;
  url: string;
  avatar: string;
  description?: string;
  hidden?: boolean;
}

export interface FriendCategory {
  title: string;
  items: FriendItem[];
}

interface CachedFriendCategories {
  fetchedAt: string;
  categories: FriendCategory[];
}

interface RawFriendItem {
  name?: unknown;
  url?: unknown;
  avatar?: unknown;
  description?: unknown;
  hidden?: unknown;
}

interface RawFriendsToml {
  blogs?: unknown;
  nonBlogs?: unknown;
}

const cacheFilePath = resolve(FRIENDS_CACHE_FILE);

async function ensureCacheDirectory() {
  await mkdir(dirname(cacheFilePath), { recursive: true });
}

function isFreshCache(updatedAtMs: number) {
  return Date.now() - updatedAtMs < FRIENDS_CACHE_TTL_MS;
}

function toFriendItem(value: RawFriendItem): FriendItem | null {
  if (typeof value.name !== "string" || typeof value.url !== "string" || typeof value.avatar !== "string") {
    return null;
  }

  return {
    name: value.name,
    url: value.url,
    avatar: value.avatar,
    description: typeof value.description === "string" ? value.description : undefined,
    hidden: typeof value.hidden === "boolean" ? value.hidden : undefined,
  };
}

function toFriendItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => toFriendItem((item ?? {}) as RawFriendItem))
    .filter((item): item is FriendItem => item !== null);
}

function normalizeFriendCategories(data: RawFriendsToml): FriendCategory[] {
  return [
    {
      title: "博客",
      items: toFriendItems(data.blogs),
    },
    {
      title: "非博客",
      items: toFriendItems(data.nonBlogs),
    },
  ].filter(({ items }) => items.length > 0);
}

async function readCachedFriendCategories() {
  try {
    const [cacheStat, cacheContent] = await Promise.all([stat(cacheFilePath), readFile(cacheFilePath, "utf8")]);
    const parsed = JSON.parse(cacheContent) as CachedFriendCategories;

    return {
      categories: parsed.categories,
      isFresh: isFreshCache(cacheStat.mtimeMs),
    };
  } catch {
    return null;
  }
}

async function writeCachedFriendCategories(categories: FriendCategory[]) {
  const payload: CachedFriendCategories = {
    fetchedAt: new Date().toISOString(),
    categories,
  };

  await ensureCacheDirectory();
  await writeFile(cacheFilePath, JSON.stringify(payload, null, 2));
}

async function fetchFriendCategories() {
  const response = await fetch(FRIENDS_TOML_URL, {
    headers: {
      accept: "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch friends list: ${response.status} ${response.statusText}`);
  }

  const toml = await response.text();
  const parsed = parse(toml) as RawFriendsToml;

  return normalizeFriendCategories(parsed);
}

export async function getFriendCategories() {
  const cached = await readCachedFriendCategories();

  if (cached?.isFresh) {
    return cached.categories;
  }

  try {
    const categories = await fetchFriendCategories();
    await writeCachedFriendCategories(categories);

    return categories;
  } catch (error) {
    if (cached) {
      console.warn("[links] Failed to refresh friends list, using stale cache instead", error);
      return cached.categories;
    }

    throw error;
  }
}
