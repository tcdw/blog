import type { APIRoute } from "astro";
import { getSiteOgCard } from "@/utils/og";
import { renderOgImage } from "@/utils/og-render";

export const prerender = true;

export const GET: APIRoute = async () => {
  const siteCard = getSiteOgCard();

  return renderOgImage({
    title: siteCard.title,
    description: siteCard.description,
    eyebrow: "Home",
    pathLabel: siteCard.pathLabel,
    includeIdent: false,
    largeText: true,
  });
};
