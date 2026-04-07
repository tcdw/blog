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
  categories: FriendCategory[];
}

interface RawFriendsToml {
  blogs?: FriendItem[];
  nonBlogs?: FriendItem[];
}

const cacheFilePath = resolve(FRIENDS_CACHE_FILE);

async function ensureCacheDirectory() {
  await mkdir(dirname(cacheFilePath), { recursive: true });
}

function isFreshCache(updatedAtMs: number) {
  return Date.now() - updatedAtMs < FRIENDS_CACHE_TTL_MS;
}

function toFriendItem(value: FriendItem): FriendItem {
  let avatar = value.avatar;
  switch (true) {
    case avatar.includes("gravatar"): {
      avatar += "?s=128&r=g";
      break;
    }
    case avatar.includes("avatars.githubusercontent.com"): {
      avatar += "?s=128&v=4";
      break;
    }
  }

  return {
    ...value,
    avatar,
  };
}

function normalizeFriendCategories(data: RawFriendsToml): FriendCategory[] {
  return [
    {
      title: "博客",
      items: (data.blogs ?? []).map(toFriendItem),
    },
    {
      title: "非博客",
      items: (data.nonBlogs ?? []).map(toFriendItem),
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
