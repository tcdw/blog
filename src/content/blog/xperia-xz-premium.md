---
title: "Xperia XZ Premium"
description: "勘误！我 XZ Premium 附带的耳机型号是 MH750，而非之前所写的 NC750。对于这个错误深表歉意。    然后我真的买了副 NC750  我三年前的 Galaxy S5 逐渐向不可用的方向发展，于是需要换新手机了。  索尼的 Xperia XZ Premium 实在是太帅了，大概是所有骁龙 835 旗舰机中唯一一款第一眼就看中的：全玻璃镜面机身、接近原版 AOSP 的官方固件、3.5mm 耳机孔，以及靠谱一点的系统更新，但更重要的是可以体验索尼大法的力量。"
pubDate: "2017-07-03T07:17:01.000Z"
---

> 勘误！我 XZ Premium 附带的耳机型号是 MH750，而非之前所写的 NC750。对于这个错误深表歉意。
>
> 然后我真的买了副 NC750

我三年前的 Galaxy S5 逐渐向不可用的方向发展，于是需要换新手机了。

索尼的 Xperia XZ Premium 实在是太帅了，大概是所有骁龙 835 旗舰机中唯一一款第一眼就看中的：全玻璃镜面机身、接近原版 AOSP 的官方固件、3.5mm 耳机孔，以及靠谱一点的系统更新~~，但更重要的是可以体验索尼大法的力量~~。

于是下单，把国行双卡版 (G8142) 抱回了家。

等机器真的到手时，才发现实物比图片还漂亮，感受跟我三年前拿到 Galaxy S5 时比起来实在是强太多了。不过母上大人说手机拿起来好滑，不过我没有这种感觉，大概是我手汗比较多吧。

---

开机以后，那系统实在是流畅的让人窒息，比 TouchWiz 强多了。更重要的是，这是官方固件。这才是我心目中的 Android 呢！

不过国行固件并没有 GMS，而且内置了百度全家桶（虽然可以很方便地停用）。我不想解 Bootloader 锁和 root，于是决定刷港版固件。

于是我用 Xperifirm 下载了港版固件，照着 Google 搜到的 Flashtool 教程开始刷机，然后卡在了奇怪的地方——

```text
01/031/2017 13:31:23 - INFO  - (MainSWT.java:154) - Device disconnected
01/031/2017 13:31:56 - INFO  - (MainSWT.java:166) - Device connected with USB debugging off
01/031/2017 13:31:56 - INFO  - (MainSWT.java:167) - For 2011 devices line, be sure you are not in MTP mode
```

啊，我明明已经进入 Flashmode 了啊！最后麻烦了好几位朋友，折腾了整整一天才发现，新款的索尼手机需要用 [Newflasher](https://forum.xda-developers.com/crossdevice-dev/sony/progress-newflasher-xperia-command-line-t3619426) 来刷，好在操作也是很容易的：

1. 安装好 Flashmode 驱动
2. 把 newflasher.exe 放在已经解包的固件的目录（就是有一大堆 sin 和 ta 格式文件的那个）
3. 运行 newflasher.exe

终于顺利的刷好了港版固件，然后通过 Google Play 装好了所有的必需应用。这手机正式投入使用。

![刚刚退役的 Galaxy S5 与 XZ Premium](https://file.tcdw.net/blog/post/2850ff3d-cb39-59ec-898c-40c3e968fff2/o_1bk4fg7hkdpqfq2al65193f9a.jpg)

至于它的拍照和音乐播放。。嗯，画质自然没得说。网上的样张已经很多了，这里就不会浪费诸位时间了。

音乐的话，我这种木耳真的听不出音质与我的 Galaxy S5 有什么显著的提升，包括一般的 m4a 和无损音乐~~（众：那你还搞业余编曲啊~~

顺便它附带的 MH750 耳机戴起来好别扭，那耳塞是左耳死活塞不紧，右耳反而塞的很紧，在加上那不一致的左右耳线长，感觉超级不舒服。~~还是用 miniso 的 earpod 外形耳机好了~~

---

这部手机是不打算折腾了，老实跟着官方 ota 走。以前我喜欢整天刷机、root、鼓捣 xposed 框架，但现在看来好没劲啊。

我浑浑噩噩的 Android 手机折腾史算是结束了吧。
