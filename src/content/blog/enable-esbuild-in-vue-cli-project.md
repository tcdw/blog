---
title: '如何在已有的 Vue CLI 项目使用 esbuild'
description: 'EDIT: 其实可以试着用相同的方法把 Babel 换成 SWC，因为它最低可以编译到 ES5。不过我现在不需要负责这个兼容 IE11 的项目了哈哈哈哈'
pubDate: '2022-04-16T06:20:11.000Z'
updatedDate: '2025-02-20T09:54:29.000Z'
---

EDIT 2: Vue CLI 都凉了，建议更换 Rspack

EDIT: 其实可以试着用相同的方法把 Babel 换成 [SWC](https://swc.rs/)，因为它最低可以编译到 ES5。不过我现在不需要负责这个兼容 IE11 的项目了哈哈哈哈

## 背景

我们的门户网站项目（Vue 2 / Vue CLI 5 / TypeScript / Element UI）前端部分编译所需时间太长，因此开始考虑在不对已有项目进行过于伤筋动骨的调整的前提下，提升编译速度的方式。

由于 Vite 使用了 esbuild 进行编译速度的提升，我们想到了一个主意：借助 [esbuild-loader](https://github.com/privatenumber/esbuild-loader)，把 Vue CLI 中的 Babel 替换为 esbuild。

## 分析

在项目根目录执行 `npx vue-cli-service inspect`，可以看到最终生成的 Webpack 配置中，以下部分涉及到了 babel-loader：

```javascript
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('js').use('babel-loader') */
          // （略）
        ]
      },
      /* config.module.rule('ts') */
      {
        test: /\.ts$/,
        use: [
          /* config.module.rule('ts').use('babel-loader') */
          // （略）
          /* config.module.rule('ts').use('ts-loader') */
          // （略）
        ]
      },
      /* config.module.rule('tsx') */
      {
        test: /\.tsx$/,
        use: [
          /* config.module.rule('tsx').use('babel-loader') */
          // （略）
          /* config.module.rule('tsx').use('ts-loader') */
          // （略）
        ]
      }
```

由此可知，我们需要将 `js`、`ts` 和 `tsx` 的默认规则进行清空处理，然后让 `js`、`ts` 和 `tsx` 使用 `esbuild-loader`。

## 操作

首先，安装 `esbuild-loader`：

```bash
npm i -D esbuild-loader
```

然后，在 `vue.config.js` 下的 `chainWebpack` 中加入以下内容：

```javascript
// 清空已有的使用 `babel-loader` 的规则
config.module.rule("js").uses.clear();
config.module.rule("ts").uses.clear();
config.module.rule("tsx").uses.clear();

// 注入使用 `esbuild-loader` 的新规则
config.module.rule("js")
    .test(/\.m?jsx?$/)
    .use("esbuild-loader")
    .loader("esbuild-loader")
    .options({
        loader: "jsx",
        target: "es2015"
    })
    .end();
config.module.rule("ts")
    .test(/\.ts$/)
    .use("esbuild-loader")
    .loader("esbuild-loader")
    .options({
        loader: "ts",
        target: "es2015"
    })
    .end();
config.module.rule("tsx")
    .test(/\.tsx$/)
    .use("esbuild-loader")
    .loader("esbuild-loader")
    .options({
        loader: "tsx",
        target: "es2015"
    })
    .end();
```

就可以了。

## 已知问题

- 如果项目中有使用到 Web Worker，肯定会炸掉，出现 `TypeError: Failed to construct 'URL': Invalid URL` 错误。采用 Babel 则正常工作。

## 遗憾

尽管 esbuild 是好文明，我们依然无法在那个门户网站项目中使用；因为我们项目要求兼容 IE11，而 [esbuild 目前最低只能编译到 ES2015](https://github.com/evanw/esbuild/issues/297)，这就导致编译产物无法在 IE11 等不（完全）支持 ES2015 的浏览器中运行；不过，在本地调试时还是很爽的，因为开发环境冷启动和热更新速度确实快了不少。

不过，如果你的项目不需要兼容 IE11 等老浏览器，但恰好还没有升级到 Vue 3 + Vite，完全可以试一试。能快一点是一点啊）

<div class="video-container"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/8WRdfXYwuWU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
