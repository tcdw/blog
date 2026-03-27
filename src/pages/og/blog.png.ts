import type { APIRoute } from "astro";
import { SITE_TITLE } from "@/consts";
import { renderOgImage } from "@/utils/og-render";

export const prerender = true;

export const GET: APIRoute = async () => {
  return renderOgImage({
    title: `${SITE_TITLE} / 博客`,
    description: "最近发布的文章、随笔，以及按时间整理的博客内容。",
    eyebrow: "Blog",
    pathLabel: "/blog/",
  });
};
