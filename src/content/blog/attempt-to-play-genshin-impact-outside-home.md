---
title: "自建云游戏服务的尝试（2024 更新）"
description: "为什么？"
pubDate: "2024-02-21T15:46:46.000Z"
---

## 为什么？

我最近经常玩《原神》，但是我：

- 只有一台能带动这游戏的远程工作站，我还很难物理访问它
- 平时在外面只能使用弱鸡的旧款 MacBook Pro
- 用 iPhone 12 Pro 玩，感觉体验堪忧

显然，再为这么一款游戏而专门购买游戏本是不划算的，而且游戏本有着笨重、噪音大、外观普遍中二感爆棚、**电池续航几乎不存在**等缺点。

考虑到近年来 [Stadia](https://stadia.google.com/)、[GeForce Now](https://www.nvidia.com/en-us/geforce-now/) 等云游戏服务在国外的兴起，我有了新的主意：拿自己的远程工作站搭建云游戏服务。

本博文不是真正意义上的教程，但是记录了我对若干方案的尝试和使用体验。

## 环境

- ~~服务端（工作站）和客户端都在重重 NAT 之下。~~现在不是问题了，家里和移动网络**都有公网 IPv6**，可以点对点直连。同样我也不再推荐直接 ECS 当跳板、承载游戏流量的方案了，因为流量费是真的奢侈啊 TAT
- 有一台阿里云 ECS 做跳板机，安装有：
  - Wireguard（用于和不同的远程设备连接）
  - nginx（通过 stream 模块向公网转发端口）

## RDP

在此之前，我经常会使用 RDP 来连接我的远程工作站。启动 RDP 服务不需要复杂的服务端设置，在网关机上也只要简单转发一个端口到公网即可。

其实 RDP 对于一般的应用程序是没有问题的，但是完全不适合打游戏：

- 图形渲染过程是交给客户端完成的
- [鼠标工作不正常](https://superuser.com/questions/849918/erratic-mouse-movement-in-3d-games-over-rdp-with-remotefx)

## Moonlight + Sunshine

我的工作站配备有 GTX 1650 Super，因此可以借助 GeForce Experience 的游戏<ruby>串流<rp>(</rp><rt>Streaming</rt><rp>)</rp></ruby>功能和 [Moonlight](https://moonlight-stream.org/) 客户端，轻松搭建自己的云游戏服务。

总体来说，在有合适的网络条件下，Moonlight 可以提供足够好的游戏体验。但是使用官方的 GeForce Experience 时，会有一些蛋疼的问题：

- 配对时必须**在远程主机上**输入四位数字确认
- 一旦连接过 RDP（因为我平时还要工作！），串流服务就会停止工作
  - 所以，上述的配对过程也不能在 RDP 进行，必须使用其它的远程桌面服务（如 Teamviewer）；  
    同时，每次连接过 RDP，都需要用 Teamviewer 再连接一次。

不过幸运的是，现在有 [Sunshine](https://github.com/LizardByte/Sunshine) 了。Sunshine 是一个兼容 Moonlight 的游戏串流服务端，支持带有视频硬件编码功能的 AMD、Intel 和 Nvidia 显卡，而且完美解决了上述的配对麻烦（用 Web GUI 就可以配对）、RDP 导致服务端罢工的问题。

对了，如果你在 Xiaomi HyperOS 设备上使用 Moonlight for Android，需要呼出虚拟键盘，得同时用三指按动屏幕，**而且每根手指距离要有大约 2cm 以上。**别问我是怎么知道的（躺

## Parsec

[Parsec](https://parsec.app/) 是一款与 Moonlight 类似的应用，但是对非技术导向的用户更加友好，而且解决了 Moonlight + Sunshine 的一些痛点：

- 验证是基于他们自家帐号系统的（比在远程主机确认配对方便多了！）
- 连完 RDP 以后可以直接连接
- 灵活的连接方式，可以自动视情况通过局域网、NAT 打洞、Wireguard 等方式连接到服务端
- 支持 AMD 和 Intel 显卡（虽然我现在用的是 Nvidia 显卡）

不过，Parsec 也有一些缺点：

- 你只能使用 Parsec 他们家的帐号系统，而且他们的客户端比较黑箱。我不是很在乎就是了……
- 视频质量并不算很好，就算你在 GUI 把码率开到最大也无济于事。不过，[蚊子写过一篇博文](https://mozz.ie/posts/ultimate-virtual-monitor-solution-indirect-display/)，提到手动在配置文件中加上 `encoder_min_bitrate = 50` 就可以改善
- Android 客户端不算那么好用，而且不支持手柄振动，也不支持将触摸屏当作笔记本触摸板使用。

## 让 GPU 一直工作

我在淘宝上随便买了个 HDMI 锁屏宝，解决了这个问题。但是不要买的太随便，因为如果锁屏宝模拟的显示器分辨率和刷新率不够高，那么想要更好的串流分辨率和帧率是没门的。

不过，也可以试试蚊子提到的 [虚拟显示器](https://mozz.ie/posts/ultimate-virtual-monitor-solution-indirect-display/)。

## 对比

总之，不同的连接方案有着它们的优缺点，所以还得视场合选择使用哪种方式连接到我的工作站。

| 服务/特性         |       RDP        | Moonlight + Sunshine |        Parsec        |
| ----------------- | :--------------: | :------------------: | :------------------: |
| 支持显卡          |       N/A        |         各种         |         各种         |
| 配置难度          |        低        |         中等         |          低          |
| 首次连接          | 输入本机登录信息 | 在服务端完成配对操作 | 输入 Parsec 登录信息 |
| 流量消耗          |        低        |         较高         |         中等         |
| 图形渲染位置      |      客户端      |        服务端        |        服务端        |
| 针对游戏优化      |        否        |          是          |          是          |
| 使用 RDP 后再连接 |       N/A        |      可直接连接      |      可直接连接      |
| 自动打洞          |        无        |          无          |          有          |
| 剪贴板共享        |        有        |          无          |    有（仅限文本）    |
| 开源软件          |        否        | 客户端/服务端均开源  |          否          |

## 自建云游戏服务的优越性

就是可以玩**各种自己喜欢的游戏**啦，而不只局限于云游戏厂商提供的可玩游戏。

不过，如果你没有长期使用 Windows 远程桌面的需求，而且只想玩一些大众游戏，那么类似于 [网易云游戏平台](https://cg.163.com/)、[腾讯云游戏](https://start.qq.com/) 等服务都是可以考虑的。

Update: 如果你是原神国服玩家，还可以考虑一下官方的**云・原神**。

## 流量费

~~别人花 648 抽优菈，我花 648 让游戏跑起来（笑~~

不过现在四大运营商都推出了便宜到爆炸、而且每月流量至少有 100G 的 5G 流量卡（不是物联网卡），同时通过与家里进行点对点连接，现在出门在外都可以省掉不少流量费了。

然后我靠着免费的原石抽到了她（

![优菈](https://file.tcdw.net/blog/post/0ec36dee-1df2-4e47-a2ad-f7930af5473e/AJCKZ1Urns7fEvD.png)
