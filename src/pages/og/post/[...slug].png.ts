import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { formatOgDate, normalizeOgDescription, trimOgText } from "@/utils/og";
import { renderOgImage } from "@/utils/og-render";
import { filterPosts } from "@/utils/misc";
import removeMarkdown from "@/utils/vendors/markdown-to-text";

export const prerender = true;

export const getStaticPaths = (async () => {
  const posts = filterPosts(await getCollection("blog"), {
    filterDraft: true,
    filterUnlisted: false,
  });

  return posts.map(post => {
    const fallbackDescription = trimOgText(normalizeOgDescription(removeMarkdown(post.body ?? "")), 120);

    return {
      params: { slug: post.id },
      props: {
        title: post.data.title,
        description: post.data.description || fallbackDescription,
        meta: `发布于 ${formatOgDate(post.data.pubDate)}`,
        pathLabel: `/post/${post.id}/`,
      },
    };
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props as {
    title: string;
    description: string;
    meta: string;
    pathLabel: string;
  };

  return renderOgImage({
    title: post.title,
    description: post.description,
    eyebrow: "Post",
    meta: post.meta,
    pathLabel: post.pathLabel,
  });
};
