---
title: '在 IE11 使用 CSS Grid 实现多列卡片列表布局'
description: '我们维护的某网站需要多列布局的、分页的、内容高度不固定的卡片列表，效果如下：'
pubDate: '2024-03-03T11:59:01.000Z'
---

我们维护的某网站需要多列布局的、分页的、**内容高度不固定**的卡片列表，效果如下：

<figure>
  <img
    src="https://file.tcdw.net/blog-res/2024/grid-blog-example.webp"
    alt="网格"
  />
	<figcaption>网格布局的效果。它们的内容高度均不一致，但是在网格中必须做到视觉高度一致。卡片本身的代码是从 <a href="https://adamwathan.me/css-utility-classes-and-separation-of-concerns/">Adam Wathan 的传教博文</a> 抄的，感激不尽（</figcaption>
</figure>

实现这种网格列表，其实使用 CSS Grid 是最为科学的方案，因为它灵活、好用、易于理解，同时对于这种内容不定高的多列卡片列表非常友好：

```css
.grid-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
```

但是有一个棘手的问题是：这个网站的浏览器兼容性要求是 Chrome 60+ 和 **IE11**。没错，都 2022 年了，还有苦逼开发者（比如我）还需要想办法让网站能在 IE11 正常工作。

不过幸运的是，通过对 CSS Grid [兼容性](https://caniuse.com/css-grid) 的查询，我们可以得知：

- IE10+ 支持[旧版的规范](https://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/)，且需要添加 `-ms-` 的前缀
- Chrome 57+ 开箱支持

[根据前辈的指引](https://dev.to/tylerthehaas/using-css-grid-in-ie11-4h4c)，我意识到在 IE11 中用 CSS Grid 实现这种网格列表是完全没问题的，只是需要一些技巧。

我们的项目使用到了 SCSS、PostCSS 和 Autoprefixer，所以，首先在 `postcss.config.js` 中声明使用针对 IE11 的 CSS Grid 转译：

```javascript
module.exports = {  
    plugins: {  
        autoprefixer: {  
            grid: "autoplace"
        }  
    }  
};
```

然后，把这个 mixin 丢进项目中：

```scss
@mixin gridList($maxRow, $column, $rowSize: auto, $columnSize: 1fr, $gapX: 0, $gapY: 0) {
    @for $i from 1 through $maxRow {
        &--grid-#{$i} {
            display: grid;
            grid-template-columns: repeat(#{$column}, #{$columnSize});
            grid-template-rows: repeat(#{$i}, #{$rowSize});
            gap: $gapY $gapX;
        }
    }
}
```

然后在需要的地方使用这个 mixin（假设我们的网格列表一页最多有 9 项，每列有 3 项，即最多会有 3 行）：

```scss
.grid-list {
    padding: 30px;
    @include gridList(3, 3, $gapX: 30px, $gapY: 30px)
}
```

嗯，那么这个 mixin 是干什么的呢？

我们前面提到了 IE11 支持旧版的 CSS Grid 规范，而在该版本的规范中，**必须显式声明你会用到的行数和列数**；而且它并不支持 `gap` 属性。

那么，对于需要显式声明行数和列数的问题，我们可以换一个思路：借助 SCSS 函数的力量，把**所有可能的**卡片列数的 CSS 都生成出来；然后在 HTML 部分，由模板渲染器告诉页面一共有多少行。

以下是 mixin 生成的代码：

```css
.demo-list {
  padding: 30px;
}

.demo-list--grid-1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, auto);
  gap: 30px 30px;
}

.demo-list--grid-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 30px 30px;
}

.demo-list--grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 30px 30px;
}

```

这样，我们就得到了行数有一行、两行和三行时所对应的 CSS 类。我们只要在生成模板时，使用对应的 CSS 类即可：

```html
<!-- 以下伪代码仅供参考，实际使用时请替换为你使用的模板引擎/界面库的语法 -->
<ul class="demo-list demo-list--grid-{{ Math.ceil(Page.PageList.length / 3) }}">
	{%- for PageItem in Page.PageList -%}  
		<li class="demo-card">
			<!-- 略 -->
		</li>
    {%- endfor -%}
</ul>
```

IE 使用的旧版规范属性是以 `-ms-` 开头的，同时我们还需要通过空白的网格来模拟 `gap` 属性。不过，Autoprefixer 可以帮我们进行转译：

```css
.demo-list {
  padding: 30px;
}

.demo-list--grid-1 {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 30px 1fr 30px 1fr;
  grid-template-columns: repeat(3, 1fr);
  -ms-grid-rows: auto;
  grid-template-rows: repeat(1, auto);
  gap: 30px 30px;
}

.demo-list--grid-1 > *:nth-child(1) {
  -ms-grid-row: 1;
  -ms-grid-column: 1;
}

.demo-list--grid-1 > *:nth-child(2) {
  -ms-grid-row: 1;
  -ms-grid-column: 3;
}

.demo-list--grid-1 > *:nth-child(3) {
  -ms-grid-row: 1;
  -ms-grid-column: 5;
}

.demo-list--grid-2 {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 30px 1fr 30px 1fr;
  grid-template-columns: repeat(3, 1fr);
  -ms-grid-rows: auto 30px auto;
  grid-template-rows: repeat(2, auto);
  gap: 30px 30px;
}

.demo-list--grid-2 > *:nth-child(1) {
  -ms-grid-row: 1;
  -ms-grid-column: 1;
}

.demo-list--grid-2 > *:nth-child(2) {
  -ms-grid-row: 1;
  -ms-grid-column: 3;
}

.demo-list--grid-2 > *:nth-child(3) {
  -ms-grid-row: 1;
  -ms-grid-column: 5;
}

.demo-list--grid-2 > *:nth-child(4) {
  -ms-grid-row: 3;
  -ms-grid-column: 1;
}

.demo-list--grid-2 > *:nth-child(5) {
  -ms-grid-row: 3;
  -ms-grid-column: 3;
}

.demo-list--grid-2 > *:nth-child(6) {
  -ms-grid-row: 3;
  -ms-grid-column: 5;
}

/* 后略... you get the idea */ 
```

### 结论

经过一系列的努力，我们终于拥有了在 IE11 正确显示的多列卡片列表。好耶！

尽管业界正积极淘汰 IE11，但现实情况是，还有一些商业应用仍然有着对 IE11 的兼容需求。确实，兼容老旧浏览器是一个让人头疼的问题，然而通过变换思路，我们可以找到一些取巧的解决方案。

当然更好的方法是，提桶跑路，去给历史包袱不重的项目填坑（逃

### 后记

这篇博文本来是一篇在 2022 年私下写的笔记，因为一开始只是写给我自己看的，加上我想应该需要支持 IE11 的项目越来越少，一直没有发布。

但是现实总是骨感的，就连不久前发布了 4.0.0 BETA 的 jQuery 团队 [都说要继续支持 IE11](https://blog.jquery.com/2024/02/06/jquery-4-0-0-beta/)，直到 jQuery 5 再放弃支持。所以这篇博文大概还是能发挥余热吧。

<iframe width="560" height="315" src="https://www.youtube.com/embed/93okxqmlPOU?si=hbleWMYKJhJMcQKw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>