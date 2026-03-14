---
title: "选择 vps-hosting.ca 的廉价 VPS 是个糟糕的主意"
description: "结论  tcdw 脑子一热，相信了这个看起来就很离谱的东西。   它是被如何发现的   2015 年 10 月，我在某人的 QQ 群里看见有人提及这款廉价 VPS，便果断注册帐号，并上去看了下，发现价格诱人爆了。      这低价，恰好我的 Conoha VPS 就要到期了，于是我便头脑一热，用 Paypal 交了 8 USD，买下了一年的 1 核、1 GB RAM、10 GB SSD 配置套餐，然后开了一个他们的 CloudPro 机器。"
pubDate: "2015-10-31T08:27:18.000Z"
---

## 结论

tcdw 脑子一热，相信了这个看起来就很离谱的东西。

## 它是被如何发现的

2015 年 10 月，我在某人的 QQ 群里看见有人提及这款廉价 VPS，便果断注册帐号，并上去看了下，发现价格诱人爆了。

![虚拟 CPU](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/2299721000.png)
![RAM](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/2680619006.png)
![“SSD”](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/1515559297.png)

这低价，恰好我的 Conoha VPS 就要到期了，于是我便头脑一热，用 Paypal 交了 8 USD，买下了一年的 1 核、1 GB RAM、10 GB SSD 配置套餐，然后开了一个他们的 CloudPro 机器。

顺便一提的是，他们提供的镜像中，还有 Minecraft 服务器预装。

（实践证明，他们的机器恐怕跑不了）

## VPS 部署

我一开始就对这 VPS 不报希望，但结果依然远远超乎了我的预料！

我安装的是 CentOS 7 操作系统，便开始`yum update`。一堆软件包下载完以后，都要卡一会儿，才会继续安装；我以前用过一个 1 核、256 MB RAM、10 GB SSD 的机器，速度都没有这么缓慢。

整个过程花费一个小时完成。

接下来安装各种服务器用到的软件，我挂 screen 来完成操作，最后当我把需要的东西都准备好时，**居然花了近一天半的时间。**

我对他们 SSD 硬盘的描述产生了怀疑，才想起来自己验证，然后我傻了眼。

### df -h

![执行结果](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/3321872264.png)

尽管这里并没有什么缩水，但是硬盘 io 果然如我后来所料：**真心不咋的！**

我再执行`dd if=/dev/zero of=test.bin bs=100MB count=1`，得到结果：

![执行结果](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/1069170927.png)

### dmidecode -q

![执行结果](https://assets.tcdww.cn/website/blog/post/0fe683ec-481c-56b8-b971-c490092b6acd/387850477.png)

天真的 tcdw 还以为会是至强处理器呢，结果居然是这样。

_不对，他们也没说他们家的服务器 CPU 究竟是什么。人家还是打好了埋伏的。_

你们自行 Google 下处理器名称吧。

## 结局

便宜没好货。

这家 VPS 虽然在数字上达到了他们宣称的目标，但是在硬盘 io、处理器等关键的、一般人很少注意的暗面大幅缩水。

我用 8 USD 当了一回小白鼠（毕竟国内关于它家的信息还是很少），换来了这篇博文。

> You are about to get access to the best Cloud on earth!

Derp.

## 1 月 13 日更新

他们家不是有什么 Free cPanel License 吗，今天我装了一个，居然是 Trial License，刷新许可状态也没用。

真会玩文字游戏。
