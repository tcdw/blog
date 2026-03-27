import type { APIRoute, GetStaticPaths } from "astro";
import { STATIC_PAGE_OG } from "@/utils/og";
import { renderOgImage } from "@/utils/og-render";

export const prerender = true;

export const getStaticPaths = (() => {
  return Object.entries(STATIC_PAGE_OG).map(([slug, page]) => ({
    params: { slug },
    props: page,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const page = props as (typeof STATIC_PAGE_OG)[keyof typeof STATIC_PAGE_OG];

  return renderOgImage({
    title: page.title,
    description: page.description,
    eyebrow: "Page",
    pathLabel: page.pathLabel,
  });
};
