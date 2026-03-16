---
title: "tcdw 与 ECMAScript"
description: "其实 tcdw 小时候并没有对计算机特别感兴趣，tcdw 曾经的梦想是当一名建筑设计师。但是，因为在 tcdw 很小的时候家里就有了一台电脑，tcdw 还是玩了很多奇怪的东西，包括 Frontpage 2003。  那时 tcdw 出于好玩的目的，设计了一个又一个版本的个人网站框架，除了内容。 tcdw 还设计了一套自己的『前端样式库』（其实只是在 Frontpage 的 CSS 选项菜单里把所有 HTML 标签都那么定义了一下样式）。"
pubDate: "2018-05-27T01:23:46.000Z"
updatedDate: "2024-06-07T14:42:23.000Z"
---

其实 tcdw 小时候并没有对计算机特别感兴趣，tcdw 曾经的梦想是当一名建筑设计师。但是，因为在 tcdw 很小的时候家里就有了一台电脑，tcdw 还是玩了很多奇怪的东西，包括 Frontpage 2003。

那时 tcdw 出于好玩的目的，设计了一个又一个版本的个人网站框架，除了内容。 tcdw 还设计了一套自己的『前端样式库』（其实只是在 Frontpage 的 CSS 选项菜单里把所有 HTML 标签都那么定义了一下样式）。

然而 tcdw 发现自己的网站总是缺点什么。好奇的 tcdw 通过右键点击来观察，终于发现了有一种神奇的东西叫 Flash。2006 年， tcdw 的舅舅送给 tcdw 一张 Macromedia MX 全家桶光盘、一张网页素材大全 DVD，还有一本 Flash MX 教材。于是 tcdw 便很开心的开始制作奇怪的 Flash，并嵌入到自己做的网页里。后来 tcdw 又缠着母上大人买了一本《精通 Flash 8》和一张 Flash 8 的盗版 CD。有了滤镜特性，tcdw 做的更来劲了。

2007 年，tcdw 从《小读者》杂志注意到袁日涉拥有自己的环保网站，tcdw 很羡慕，便进去看了看。当 tcdw 看到她在 2006 年的获奖作品《从纸到树的生态研究》里的 Flash 导航菜单，tcdw 很诧异：为什么那个菜单背景可以跟着鼠标移动，而且还会缓动变色？

虽然那本书上已经讲了一些 ActionScript，tcdw 也能照着书上的例子使用 `gotoAndPlay` 之类的 API 控制播放，但是那两本书讲的非常粗略，**因为都是主要讲 Flash 动画制作，而不是 Flash 编程。**

后来 tcdw 摸爬滚打的求助度娘，终于发现有一家网站叫**闪吧**，那边有大量的 Flash 资源。tcdw 如饥似渴的下载了大量的 Flash 源文件，观察它们是如何运作的。这时 tcdw 才发现，原来 ActionScript 可以写的更加复杂！

于是，tcdw 照葫芦画瓢的尝试，凭借小学学的那点英语判断各种关键词的意图，初步建立了编程的概念。而当时 tcdw 也发现了有一款软件叫**网页特效制作专家**，里面集合了大量的网页特效。因为它们的本质都是 JavaScript，tcdw 也开始靠着复制粘贴奇怪的代码片段，试着拼凑一些不需要 Flash 的网页特效，结果还很成功。不过因为 HTML 4 的表现力太有限了（而且 tcdw 还在用 Frontpage 2003 + IE 6 的坑爹组合），所以 tcdw 的重心依然在 Flash 上。

闪吧投稿的质量也是参差不齐。因为很多投稿人本身对编程也没有太深入的研究，只是用一些意大利面代码完成一些交互性的东西，以至于他们写的代码就有很多逻辑缺陷，而 tcdw 盲目学习他们，对自己的编程思维产生了很多负面影响。

2008 年，tcdw 为 [杨静](https://www.nt-yangjing.com/) 翻唱的《雪人》做了一个 Flash MV。那是 tcdw 当时做过的最复杂的 Flash 了，不仅用到了很多 Flash 元件，还使用了 tcdw 学到的 ActionScript 实现了雪花特效以及一个很中二的『拖动光盘到标题文字即可开始播放』的功能（用到了 `hitTest` 这个 API）。做完以后，得到了父母的赞扬，还在小学的多媒体设备上，向全班同学放了一遍。**那是 tcdw 最信心满满的时刻之一了。**

<div class="video-container"><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" id="index">
  <param name="movie" value="https://file.tcdw.net/blog/misc/snowman_yangjing.swf" />
  <param name="allowFullScreen" value="true" />
  <param name="quality" value="high" />
  <param name="wmode" value="opaque" />
  <embed src="https://file.tcdw.net/blog/misc/snowman_yangjing.swf" name="index" allowFullScreen="true" quality="high" wmode="opaque" pluginspage="https://get.adobe.com/cn/flashplayer/" type="application/x-shockwave-flash"></embed>
</object></div>

## 闪吧投稿

到了 2010 年，tcdw 感到自己的 Flash 制作已经有了套路，而且有些东西看起来比闪吧上已有的一些源文件（包括粗制滥造的、从同一个教程复制粘贴的）质量还要好。那时，tcdw 做过的最复杂的 Flash 作品是一个交互性比较高的音乐播放器，可以调节进度、音量、播放列表，还有 LRC 展示，以及 [没有完工的、基于搜搜的在线搜索音乐并添加到当前播放列表的功能](/post/split)（换成 2018 年应该是基于网易云音乐的吧）。不过遗憾的是，这个播放器在 2010 年的一次 U 盘故障中丢失了。

于是，tcdw 大胆的尝试往闪吧投稿。tcdw 做的一个中看不中用的光影特效、俩鼠标特效和一个 Flash 调色板都审核通过了。 tcdw 在自己的作品介绍里都留下了 QQ 号，然后还真的有不少人加 tcdw 好友，而且大概有 30 多人吧。于是 tcdw 还建了一个 QQ 群，叫『闪客交流』。

每当有人问 tcdw 问题，tcdw 一般出于保持脸面的考虑，会凑合回答一下；tcdw 也遇到过一大堆伸手党，这时 tcdw 就很高冷的说：『闪客教学，收费。』然后他们就走了（没人真的来付费希望 tcdw 教他们

其实 tcdw 也不是没有接纳过伸手党的所谓任务。有一个伸手党希望 tcdw 帮忙做一下他的 Flash 作业， tcdw 当时傻乎乎的同意了。但 tcdw 后来发现他的那个作业还很难做，而 tcdw 还没在人家的 deadline 以前搞定。 tcdw 就想：『我凭什么要为他做作业？』

想到这里， tcdw 便告诉他：『你的作业我不做了。』因为 tcdw 当时的态度也不得当，人家便进 tcdw 的 QQ 空间大骂 tcdw 是骗子云云（当然那些评论都被 tcdw 删除了）。后来吸取了教训，就再也没有承担过那种一上来就求做作业的伸手党的任务。

## 牛逼的 QQ 空间红人

从闪吧过来加 tcdw QQ 的人，有两位开了很多钻，QQ 空间里面全是 Flash，看起来特别炫酷，还标榜是『blahblah 的腾讯博客』、『网络红人』什么的， tcdw 羡慕死了，为什么 tcdw 的同学开了黄钻，却还在用官方那几套模板？如果做一套很炫酷的 QQ 空间模板，一定会受到周围的人羡慕、尊敬啊！

当时 tcdw 也开通了自己的个人网站，用的是 5944 的免费空间，而且访问地址更新事宜已经在 tcdw 的 QQ 空间公告了好几次（虽然大概没人真的看过）。于是， tcdw 把专门为自己 QQ 空间做的 Flash 传到了自己的免费空间，再在 QQ 空间引用自己做好的 Flash。果然，有很多『萌新』开始加 tcdw 的 QQ 了。

其实 tcdw 当时做的 Flash 并没有什么技术含量：把一些非主流的元素加进去，用 tcdw 小时候学会的 Flash 动画制作方法把它们耦合在一起，再用意大利面的 ActionScript 代码让它们做点什么交互性的事情，最后把 Flash 糊上 QQ 空间就是了。

当时还有一种叫 QCC 的东西非常火爆。其中有一家推出的 QCC 模板非常华丽，功能也很齐全（比如可以读取你的日志列表、显示最近访客等等），收费还记得是 60 元一年、100 元永久。但人家的反逆向工程还是可以的，用 Sothink SWF Decomplier 和 ASV2010 打开，程序都会崩溃。不过后来 tcdw 还是想办法把他们的那个音乐播放器元件结构逆向了出来，并填充了 tcdw 自己写的 ActionScript 代码，实现了一致的功能。

至于空间日志展示等功能， tcdw 也解决了。2010 年的某一期《电脑爱好者》杂志，有篇文章安利了 Chrome 浏览器，表示你可以用里面的开发者工具做很多事情，比如通过录制 Network 动态来下载 FLV 视频。于是 tcdw 下载了 Chrome 浏览器，通过观察 Network 的动态，发掘了很多 tcdw 梦寐以求的 QQ 空间私有 API。然后 tcdw 通过 split 大法解析 JSON，实现了各种付费 QCC 才有的高级功能，吸引了好多人的目光（其实最多也就几十人）。**同时 tcdw 发现 Chrome 浏览器在他爸花 2k 装的坑爹 Windows XP 台式机运行非常快，于是 tcdw 便从 IE 6 / 8 用户变成了一名 Chrome 用户，直到今天。**

## 原来 Flash 已经开始被人讨厌了呢

然而好景不长，当 tcdw 在制作功能更高级的 QQ 空间 Flash 时，腾讯突然宣布：为了防止有人通过 Flash 盗取 QQ 密码，从 2011 年 8 月起只允许在白名单列表的网站的 Flash 被插入到 QQ 空间首页。

那还玩个屁啊！只见各种 QCC 卖家和 QQ 空间 FD 模块作者哭天喊地，希望 QQ 空间能够解除这种限制，但是并没有什么用。期间虽然有人发现了一些绕过方法，但是后来都被封堵了。再后来 QQ 空间推出 6.0 版，以前的一大堆套路全失效了。tcdw 也是在那时渐渐跟 tcdw 认识的那群闪客疏远，最后在一两年前的一次 QQ 好友清理中被 tcdw 删除了。

没有 Flash 的 QQ 空间是无聊的。再往后，tcdw 觉得 QQ 空间没什么好玩的，就不再续费黄钻。tcdw 的黄钻等级从 7 级一路下滑到 1 级了。

2011 年，tcdw 恰好通过 ZYH 的 NES 模拟器『ZYH Emulator』知道了百度超级马里奥吧，后来又找到了超吧大水库吧，然后认识了 [Jixun](https://jixun.moe)。Jixun 菊苣是一个很厉害的人，不仅帮助 tcdw 修改过很多意大利面代码，还让 tcdw 知道了 HTML5、GitHub、响应式页面等很多新奇的东西，让 tcdw 大开眼界。

但在接下来几年里，由于学业原因，tcdw 的 JavaScript 学习就停滞了。虽然期间 tcdw 利用 HTML5 API 做过一些类似 HTML5 音乐播放器之类的东西，但是他的编程思维还是小时候的那套。

## 吐槽大王与主流 JavaScript

2014 年底，tcdw 在百度免费空间吧 QQ 群看到有人发布了 Hostker 的链接。tcdw 进去一看，发现跟自己熟悉的那种虚拟主机官网很不一样，看上去非常亲和。在示例用户那一栏，tcdw 看到了 [卜卜口](http://i.mouto.org/) 的博客，点进去一看，发现样式很新奇，页面加载速度也很快。tcdw 试图查看源文件，却发现只有几个看似单薄的 js 文件。后来通过体验他的 [妹 blog](http://github.com/itorr/imouto)，tcdw 第一次拥有了关于 SPA 的概念。

后来，tcdw 在一次偶然的机会认识了 [佳佳酱](https://luojia.me/)，进而认识了一群有趣的人。tcdw 从他们那里知道了 Node.js，便信心满满的开始编写一些会读取文件的、看起来很正经的东西。然后 tcdw 便发现，自己写的代码不符合他的期望：

```javascript
var fs = require("fs");
var str;
fs.readFile("1.txt", { encoding: "utf8" }, function (err, txt) {
  if (err) throw err;
  console.log("文件读取成功！");
  str = txt;
});
console.log(str);
```

tcdw 想：我是想先输出『文件读取成功』再输出 1.txt 的内容啊，为什么是先输出 undefined 再输出『文件读取成功』？tcdw 很困惑，他上网搜索答案，知道了这是因为 JavaScript 的异步处理方式导致的，但是一大堆文章都没有给出较好的解决方案。后来，tcdw 便改用了 fs.readFileSync 来读取他的文件，实现了他期望的那种顺序执行。

但后来 tcdw 想使用 [superagent](https://www.npmjs.com/package/superagent) 库来读取网络的内容来帮他不断在 SMW Central 的某活动中刷帖，但那个库并没有提供同步方法。于是，tcdw 想到了一个馊主意来实现他期望的同步执行，其实就是 [Callback Hell](http://callbackhell.com/)。

tcdw 还通过 setTimeout 来延时，并递归调用请求函数，试图实现不间断定时刷帖。但 tcdw 的程序运行了没多久，就因为 `Maximum call stack size exceeded` 错误崩溃了。那时的 tcdw 想不到更好的办法，就只好在他的 VPS 上设置了一个 cron 任务，每半分钟重新调用一次脚本来发帖。

问题是解决了，但 tcdw 渴望知道究竟该如何玩转 JavaScript 的异步编程，于是通过不断努力，终于搞明白了这些奇怪的事情。

## 好耶，是 ES2015

直到 2017 年，tcdw 终于结束了高考。tcdw 终于开始系统性的学习 ES2015，不仅学到了很多已经存在几年的新特性，还拥有了新的思维。

同时，tcdw 终于开始大胆尝试接触以前他觉得很复杂、难以搞懂的东西，比如 webpack、rollup 之类的打包工具。与此同时，tcdw 深入的学习了一些更加抽象的知识，比如 DOM 和面向对象思维。总之大学以来的一年是 tcdw 进步最大的一年，算是可喜可贺吧。

## 总结

由此可见，tcdw 走的这条路其实非常不科学，以至于 tcdw 尽管很小就接触编程，但不仅没有取得骄人的成绩，还跟很多同龄菊苣的水平差距巨大。tcdw 还残留了很多古董的编程思想，以至于很多人看到 tcdw 写的代码都感到有些莫名其妙。

不过那些事情都过去了，而且我距离毕业还有几年。于是对于弥补一些事情来说，还是来得及的吧。
