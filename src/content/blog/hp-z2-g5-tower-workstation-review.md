---
title: "新的桌面工作站：HP Z2 G5 Tower"
description: "我的上一代桌面工作站是台戴尔的 Inspiron 660，购于 2013 年初。经过数年来的多次升级，它拥有了三代 i7 处理器、16GB 内存和固态硬盘。  其实这台机器的性能直到今天依然不算逊色，基本上可以满足日常使用。但是，因为一些个人原因，我开始日常需要开启多个虚拟机，于是这台机器的 CPU 就开始有些吃不消了。"
pubDate: "2021-03-02T11:44:19.000Z"
---

我的上一代桌面工作站是台戴尔的 [Inspiron 660](https://www.dell.com/support/home/zh-cn/product-support/product/inspiron-660/overview)，购于 2013 年初。经过数年来的多次升级，它拥有了三代 i7 处理器、16GB 内存和固态硬盘。

其实这台机器的性能直到今天依然不算逊色，基本上可以满足日常使用。但是，因为一些个人原因，我开始日常需要开启多个虚拟机，于是这台机器的 CPU 就开始有些吃不消了。

考虑到这台机器已经有 8 年历史，于是我便决定让它退居二线，同时将主力工作站进行升级换代。

经过反复的挑选，我最终选中了惠普的 [Z2 G5 Tower](https://www8.hp.com/us/en/workstations/z2-tower.html)。它在这些方面非常吸引我：

- 免工具维护
- 极高的可扩展性，有着合理的升级路线
- 没有光污染，但是不失颜值的机箱箱体

在我购买这台机器时，我其实已经听说了 11 代酷睿系列处理器即将发布的消息，但是我这台机器预期服役 5 年以上，感觉差上一代应该问题不大。

以及我买的配置其实听起来就感觉有点尴尬：i7-10700 / 8GB DDR4 2666 x1 / **2TB 机械硬盘**，不过我自己已经有一些配件了，可以直接换上去用。

最终，成功在国内商家以 6.8k 拿下。

## 安装

因为卖家发的是顺丰，所以我下单以后第三天就到了。毕竟在内蒙古这种地方，这个速度已经算是很快了。

![包装](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-1.jpg)

机箱的颜值确实不错，不过感觉比想象中的要略小一点。

- 正面 IO：
  - 2 个 USB 3.1 Gen1
  - 2 个 USB 3.1 Gen2
  - 耳麦接口
- 背面 IO：
  - 2 个 USB 2.0
  - 2 个 USB 3.1 Gen1
  - 2 个 USB 3.1 Gen2
  - 1 个 RJ-45（I219-LM，千兆以太网）
  - 线路输入和线路输出
  - 2 个全尺寸 DisplayPort
  - 1 个 VGA (Flex IO modules)

<div class="hpws-grid-container">
<img alt="机箱前面" src="https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-3.jpg">
<img alt="机箱后面" src="https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-4.jpg">
</div>

打开机箱也非常简单，只要扳动背面右侧的黑色开关即可。

![初见机箱内部](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-5a.jpg)

后盖上粘贴的贴纸介绍了主板各个部位的用途。

![后盖贴纸](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-service.jpg)

中间那个横着的玩意是……显卡风扇。应该是辅助散热的，不过也给我后面的显卡安装带来了一些麻烦（见后文）。

![显卡散热器](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-6.jpg)

工作站的主板。这块主板的可扩充性的确非常丰富，主要亮点有：

- 4 条 DDR4 内存插槽
- 4 个 SATA 3 接口
- **两个** M.2 M Key 插槽**（只支持 2280 尺寸）**和一个 M.2 E Key 插槽（我这台已经预装了 AX201）
- 4 个 PCI-E 插槽

顺便主板是前后一体贯通的，而且是非标准螺丝孔位，所以是没法更换市售主板的。不过对我来说无所谓啦。

![主板](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-7.jpg)

传说中的 Flex IO modules；我这台配的是 VGA 输出。

![Flex IO modules](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-8a.jpg)

预装的 AX201 网卡，支持 Wi-Fi 6 和蓝牙 5.0。

![AX201 网卡](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-8b.jpg)

主板的 PCI-E 插槽，配置如下：

- 1 个 PCI-E x16
- 2 个 PCI-E x4（x1 信号）
- 1 个 PCI-E x16（x4 信号）

![PCI-E 插槽](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-8c.jpg)

## 其它配件

我的附带了一个笔记本尺寸的 DVD-RW 驱动器，不过还预留了一个空的 5.25 寸扩展槽。

![DVD-RW 驱动器](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-dvd-spec.jpg)

700W 的电源适配器，**有着 80 Plus 铂金认证。**预留了两条 6+2 的显卡供电。

虽然是非标准的电源，不过使用一些高端显卡应该是绰绰有余。

Edit: 有 Telegram 群友指出这个电源适配器应该是符合 ATX12VO 标准的。电源参数看起来确实如此，但是实际上孔位和尺寸跟正常的 ATX 电源完全对不上，而且电源接口也是非标准的。

![电源适配器](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-psu-spec.jpg)

三星 8G DDR4 2666 内存。

![内存](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-11.jpg)

东芝 DT01ACA200 机械硬盘（2TB / CMR）；拆下来以后被我塞进 NAS 里了。

![机械硬盘](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-12.jpg)

硬盘托架；这台机器可以安装两块 3.5 寸硬盘。

![硬盘托架](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-13.jpg)

## 其它附带的东西

包装中除了主机本体，还有小册子、品字电源线、键盘和鼠标。

![其它物品](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-14a.jpg)

附带的键盘和鼠标；朴实无华，但是手感还算说得过去。

![鼠标](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-14b.jpg)
![键盘](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-14c.jpg)

## 安装我自己的配件

随后，我安装了我自己已有的一些配件：

- 显卡：ZOTAC GTX 1650 Super (4GB GDDR6)
- NVMe SSD：铠侠 RC10 500GB
- 内存：英睿达 16GB DDR4 2666

但是安装显卡时，我发现我扣不上机箱的显卡散热器。仔细一看，发现了问题所在：我的显卡的供电口位置很尴尬，恰好和散热器冲突。

![显卡散热器问题](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-15.jpg)

所以，我只好先把固定散热器（？）的那个黑色的东西拆下来了，然后才有了足够的空间。拆下来以后看起来问题不大，机箱的显卡散热器还能固定住的样子。

那么把整个散热器都拆掉呢？我试了，结果机器在 POST 就会报错，抱怨风扇出现了问题。

理论上来说，我可以装个假负载，来让主板认为风扇在正常工作；但是这台机器的**风扇接口也是非标准的**，就有点尴尬。

## 使用体验

安装完毕以后，顺利开机，没有任何问题。

得益于 24G 的内存、8 核 16 线程的处理器和 Hyper-V，整体的体验是滑溜溜的，开 3 个 Windows 虚拟机都压力不大。

![hwinfo 信息](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-info.png)

![CPU](https://assets.tcdww.cn/website/blog/post/8f57e29b-2a8a-58b0-b56a-a3f91f8acdbb/hpws-cpu.png)

2021 年 4 月更新：因为发现 500G 的存储空间有点捉襟见肘，再加上 Chia 挖矿潮即将兴起，所以提前把固态硬盘换成了**建兴 T10** 240GB + **铠侠 RC10** 1TB 的组合。很爽。

## 总结

感觉这台机器买的很值，相比我 8 年前的旧电脑，是一次非常巨大的飞跃。开心！

顺便一提，我在购买这台机器时，有考虑上一块更好的显卡，但是现在显卡实在是贵的太离谱了，就先把之前买的 GTX 1650 Super 装上了。（摊手

<style>
@media screen and (min-width: 768px) {
  .hpws-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas:
      ". .";
  }
  .hpws-grid-container .img {
    max-width: 100%;
  }
}
</style>
