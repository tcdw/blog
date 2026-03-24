import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // 请修改为你自己的线上地址，谢谢茄子
  site: "https://tcdw.github.io/blog",

  // 如果你的网站在子路径下（例如 `https://example.com/koi/`），则填写 `/koi/`
  // 在根路径下（例如 `https://example.com/`）则填写 `/`
  base: process.env.NODE_ENV === "production" ? "/blog/" : "",

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
