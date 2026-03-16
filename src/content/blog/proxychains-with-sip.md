---
title: "故事：试图不关闭 SIP 在 macOS Sierra 上使用 proxychains-ng"
description: "因为一些原因，我需要通过 proxychains 代理我的 ssh 来连接远程主机。我按部就班地用 homebrew 装好了 proxychains-ng，运行系统上已有的 ssh 客户端（/usr/bin/ssh），期望着就像 Debian Linux 上那样可以轻松代理，然而并！不！能！"
pubDate: "2017-09-24T12:39:39.000Z"
---

2022 更新：强行让一个应用走代理的方式现在真的太多了。我目前用的是 [Surge](https://nssurge.com/)，真是太香了（

---

因为一些原因，我需要通过 proxychains 代理我的 ssh 来连接远程主机。我按部就班地用 homebrew 装好了 proxychains-ng，运行**系统上已有的** ssh 客户端（`/usr/bin/ssh`），期望着就像 Debian Linux 上那样可以轻松代理，然而并！不！能！

你会被卡在这里：

![被卡住](https://file.tcdw.net/blog/post/3e32c611-9950-5c4f-92ce-4524ff89f5ce/pcng-epic-fail.png)

我们启用一个国外代理，运行**系统上已有的** curl（`/usr/bin/curl`），你猜怎么着？

```bash
tcdw@tcdw-mac.local ~ $ proxychains4 curl ip.cn
[proxychains] config file found: /usr/local/etc/proxychains.conf
[proxychains] preloading /usr/local/Cellar/proxychains-ng/4.12_1/lib/libproxychains4.dylib
当前 IP：blah blah 来自：内蒙古自治区呼和浩特市 电信
```

看来，proxychains 此时并不能让那些程序走代理。

## 试图解决

Google 了一下，发现很多博文建议关闭 SIP：

> macOS 10.11 后下由于开启了 SIP（System Integrity Protection） 会导致命令行下 proxychains-ng 代理的模式失效，如果你要使用 proxychains-ng 这种简单的方法，就需要先关闭 SIP。
>
> 具体的关闭方法如下：blah blah

我不想关闭 SIP，怎么办呢？办法还是有的。

根据苹果的 [官方说明](https://support.apple.com/zh-cn/HT204899)，以下路径受到保护：

```
/System
/usr (不包含 /usr/local)
/bin
/sbin
Apps that are pre-installed with OS X
```

……

这样就知道如何解决了：把那些二进制复制到不受保护的路径，就可以了！

我在我的 .profile 文件中定义过这个：

```bash
export PATH=/Users/tcdw/usr/bin:$PATH
```

于是我把 ssh 和 curl 复制到我的 bin 路径：

```bash
cp $(which ssh) ~/usr/bin/ssh
cp $(which curl) ~/usr/bin/curl
```

再试试，果然可以代理了！

```bash
tcdw@tcdw-mac.local ~ $ proxychains4 curl ip.cn
[proxychains] config file found: /usr/local/etc/proxychains.conf
[proxychains] preloading /usr/local/Cellar/proxychains-ng/4.12_1/lib/libproxychains4.dylib
[proxychains] DLL init: proxychains-ng 4.12
[proxychains] Dynamic chain  ...  127.0.0.1:1080  ...  ip.cn:80  ...  OK
当前 IP：blah blah 来自：日本
```

## 总结

- 把二进制放到 SIG 的保护范围以外即可正常使用 proxychains-ng，而无需关闭 SIG
- 通过 homebrew 安装的二进制基本在 `/usr/local` 目录下，因此无需担心此问题。所以，你可以直接通过 homebrew 单独安装 OpenSSH
- 你也可以考虑下 [Proxifier](https://www.proxifier.com)，只要设置好规则即可无痛让各种应用（包括位于被保护路径的命令行工具）使用代理。这是一款商业软件，有 30 天的试用期
