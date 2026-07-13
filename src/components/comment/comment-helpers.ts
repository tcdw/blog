import type { CommentPost, CommentThread } from "./types";

const USER_STORAGE_KEY = "pomment_user_info";

export interface SavedCommentUser {
  name: string;
  email: string;
  website: string;
}

export function buildCommentTree(posts: CommentPost[]): CommentThread[] {
  const postMap = new Map(posts.map(post => [post.id, { ...post }]));
  const threads: CommentThread[] = [];
  const threadMap = new Map<number, CommentThread>();

  for (const post of postMap.values()) {
    if (post.parent) {
      post.parentPost = postMap.get(post.parent);
      continue;
    }

    const thread = { parentPost: post, childPost: [] };
    threads.push(thread);
    threadMap.set(post.id, thread);
  }

  for (const post of postMap.values()) {
    if (!post.parent) continue;

    let root = post;
    const visited = new Set<number>();
    while (root.parentPost && !visited.has(root.id)) {
      visited.add(root.id);
      root = root.parentPost;
    }
    threadMap.get(root.id)?.childPost.push(post);
  }

  threads.sort((a, b) => b.parentPost.createdAt - a.parentPost.createdAt);
  for (const thread of threads) {
    thread.childPost.sort((a, b) => a.createdAt - b.createdAt);
  }
  return threads;
}

export function formatCommentDate(timestamp: number): string {
  const elapsed = timestamp - Date.now();
  const formatter = new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 365 * 24 * 60 * 60 * 1000],
    ["month", 30 * 24 * 60 * 60 * 1000],
    ["day", 24 * 60 * 60 * 1000],
    ["hour", 60 * 60 * 1000],
    ["minute", 60 * 1000],
  ];

  for (const [unit, duration] of units) {
    if (Math.abs(elapsed) >= duration) {
      return formatter.format(Math.round(elapsed / duration), unit);
    }
  }
  return formatter.format(Math.round(elapsed / 1000), "second");
}

export function getAvatarUrl(emailHashed: string, size: number, baseUrl: string): string {
  return `${baseUrl}${emailHashed}?s=${size}&d=identicon`;
}

export function getAvatarSrcset(emailHashed: string, size: number, baseUrl: string): string {
  return `${getAvatarUrl(emailHashed, size, baseUrl)} 1x, ${getAvatarUrl(emailHashed, size * 2, baseUrl)} 2x`;
}

export function getSavedCommentUser(): SavedCommentUser | null {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? (JSON.parse(value) as SavedCommentUser) : null;
  } catch {
    return null;
  }
}

export function saveCommentUser(user: SavedCommentUser): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}
