import type { APIRoute } from "astro";
import { renderOgImage } from "@/utils/og-render";

export const prerender = true;

export const GET: APIRoute = async () => {
  return renderOgImage({
    title: "页面走丢了",
    description: "这个地址可能已经改名、搬家，或者链接里混进了奇怪的东西。",
    eyebrow: "404",
    pathLabel: "/404",
  });
};
