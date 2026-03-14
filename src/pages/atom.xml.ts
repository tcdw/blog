import { Feed } from "feed";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_AUTHOR_NAME, SITE_COPYRIGHT_YEAR_START } from "../consts";
import { filterPosts } from "@/utils/misc";
import type { APIContext } from "astro";
import { marked } from "marked";

export async function GET(context: APIContext) {
  const posts = filterPosts(await getCollection("blog"), {
    filterDraft: true,
    filterUnlisted: true,
  });

  const siteUrl = context.site ? context.site.toString() : "https://tcdw.github.io/blog/";

  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: siteUrl,
    link: siteUrl,
    language: "zh-CN",
    image: new URL("favicon.svg", siteUrl).toString(),
    favicon: new URL("favicon.svg", siteUrl).toString(),
    copyright: `All rights reserved ${SITE_COPYRIGHT_YEAR_START}-${new Date().getFullYear()}, ${SITE_AUTHOR_NAME}`,
    updated: posts[0]?.data.pubDate,
    generator: "Astro",
    author: {
      name: SITE_AUTHOR_NAME,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.data.title,
      id: new URL(`/blog/${post.slug}/`, siteUrl).toString(),
      link: new URL(`/blog/${post.slug}/`, siteUrl).toString(),
      description: post.data.description,
      content: await marked.parse(post.body),
      author: [
        {
          name: SITE_AUTHOR_NAME,
        },
      ],
      date: post.data.pubDate,
    });
  }

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
