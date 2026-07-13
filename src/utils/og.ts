import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts";

export const DEFAULT_OG_IMAGE = "/og/index.png";
export const BLOG_OG_IMAGE = "/og/blog.png";
export const NOT_FOUND_OG_IMAGE = "/og/404.png";

export const STATIC_PAGE_OG = {
  about: {
    title: "关于",
    description: "小站的简单介绍",
    image: "/og/page/about.png",
    pathLabel: "/page/about/",
  },
  archive: {
    title: "归档",
    description: "按年份整理的文章归档",
    image: "/og/page/archive.png",
    pathLabel: "/page/archive/",
  },
  links: {
    title: "链接",
    description: "朋友们的博客",
    image: "/og/page/links.png",
    pathLabel: "/page/links/",
  },
  guestbook: {
    title: "留言",
    description: "它真的只是个留言本（",
    image: "/og/page/guestbook.png",
    pathLabel: "/page/guestbook/",
  }
} as const;

export function getPostOgImagePath(slug: string) {
  return `/og/post/${slug}.png`;
}

export function getPageOgImagePath(slug: keyof typeof STATIC_PAGE_OG) {
  return STATIC_PAGE_OG[slug].image;
}

export function normalizeOgDescription(description?: string) {
  const source = description?.trim() || SITE_DESCRIPTION;
  return source.replace(/\s+/g, " ").trim();
}

export function trimOgText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function formatOgDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getSiteOgCard() {
  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    pathLabel: "/",
  };
}
