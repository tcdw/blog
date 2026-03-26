import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

const deploymentSite = process.env.SITE_URL || process.env.CF_PAGES_URL || "https://www.tcdw.net";
const normalizedSite = /^https?:\/\//.test(deploymentSite) ? deploymentSite : `https://${deploymentSite}`;

// https://astro.build/config
export default defineConfig({
  // 生产环境优先使用显式配置的线上地址，其次退回到 Cloudflare Pages 提供的部署 URL
  site: normalizedSite,

  // Cloudflare Pages 部署在根路径
  base: "/",

  integrations: [mdx(), sitemap(), solid(), icon()],

  markdown: {
    remarkRehype: {
      footnoteLabel: "脚注",
      footnoteBackLabel: "文档内容的脚注",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
