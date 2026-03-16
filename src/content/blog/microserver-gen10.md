---
title: "新的家庭服务器：MicroServer Gen10"
description: "我的上一代家庭服务器是一台技嘉的 GB-BXBT-2807。其实作为家庭服务器来说，它是个还行的选择，但是内部只能安装一块 2.5 寸 9.5mm 以下的 SATA 硬盘，而且只有一个 USB 3.0 和两个 USB 2.0 接口。"
pubDate: "2020-01-10T11:02:42.000Z"
---

我的上一代家庭服务器是一台技嘉的 [GB-BXBT-2807](https://www.gigabyte.com/Mini-PcBarebone/GB-BXBT-2807-rev-10)。其实作为家庭服务器来说，它是个还行的选择，但是内部只能安装**一块** 2.5 寸 9.5mm 以下的 SATA 硬盘，而且只有一个 USB 3.0 和两个 USB 2.0 接口。

我家的上传速率其实还是可以的，而随着我开始尝到**私有云**的甜头，我陆续增加了三块硬盘。然而因为它只有一个 USB 3.0 接口，所以最后我的家庭服务器变成了这个样子。

![胶水 NAS](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/old_nuc.jpg)

看来，我需要一台真正的多盘位 NAS 服务器了。我一度考虑过以下方案：

- 搞个蜗牛星际。但是在 KK 家摸到真机以后，我对它的做工倍感失望。
- 买个[迎广 MS04](https://www.ipc.in-win.com/soho-smb-iw-ms04)，自己从头攒一台 NAS 出来。但是这样的话，总支出大概不会跟买一台 Gen10 差太远，而且保修这个问题会变得比较复杂。

最终，我还是决定购买 HPE ProLiant MicroServer Gen10。

可以说，这款主机对我来说，几乎是完美的：

- 4 盘位（虽然并不是热插拔）
- 低功耗（x3216 的 TDP 只有 15w）
- 主机本身是正常的 x86 PC，可以很方便的安装各种主流 Linux 发行版
- 做工良好，可靠性强
- 有**两个** PCI-E 插槽（分别为 x8 和 x1），未来升级万兆会很方便
- 接口丰富：四个 USB 3.0、两个 USB 2.0、两个千兆以太网口、两个全尺寸 DP 和一个 VGA
- 预装 8GB DDR4 **ECC** 内存
- ……

就这样，我以 2.8k CNY 的价格在美亚拿下了这玩意。其实我一开始考虑从德亚买的，只要 2.5k（当时），但是并不能直邮到中国。为了省事，我就直接在美亚买了。

## 安装

近两周以后，它抵达了我家。到手的第一件事，当然是拆开检查一下了。箱子中并没有太多的东西（主机、美标品字电源线和一堆小册子），不过对于它的目标用户来说大概够了吧。

顺便那条品字电源线用的是**带接地的**美标插头，这使得它并不能在新国标的插线板上使用。所以如果你家没有多余的品字电源线，别忘了单独买一条！

![Gen10 正面](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_2.jpg)

![Gen10 背面](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_3.jpg)

![Gen10 左侧](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_4.jpg)

PSU 是台达的 flex 电源，宽电压，最大输出 200W；输出有 24pin x1、大 4P x1 和小 4P（软驱电源插头）x1。

接下来就要安装硬盘了。这玩意并没有独立的硬盘仓，所以你需要这样安装硬盘：

1. 从硬盘仓顶部拧下来 4 颗螺丝
2. 把这 4 颗螺丝拧到硬盘两侧最左面和最右面的孔位上  
   ![硬盘上的螺丝](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_11.jpg)
3. 把硬盘正面朝右，稍微用力的推进硬盘仓。移除硬盘也是超级容易的（见硬盘仓左下角贴纸）：  
   ![硬盘仓（安装后）](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_12.jpg)

然后就开始安装系统 SSD 了。这玩意并没有 M.2 NVMe 插槽，但是在主板上提供了一个额外的 SATA 接口，所以我买了一块普通的 SATA SSD。

然而，Gen10 的 PSU 并没有多余的电源线，你能利用的只有那个小 4P 插头。所以你需要买这样的转接线：

![](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/Snipaste_2020-01-10_17-35-24.png)

我那个 Gamemax 机箱正好附送了一根这样的转接线，所以我就直接拿来用了。

至于 SSD 的固定……Gen10 上侧的那几个空位是给你固定笔记本光驱用的，所以你的 SSD 大概就只能这样放着。当然你可以再买个笔记本光驱位转硬盘位之类的东西，不过 NAS 这种东西本身也不需要经常挪动，再说 SSD 里面并没有活动的部件，所以我就无所谓了。

![系统 SSD（安装后）](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_14.jpg)

## 系统

我选用的是 Ubuntu 18.04 LTS。因为：

- Ubuntu 是我熟悉的发行版系列
- 我拥有充分的控制能力

安装过程没什么坑，一切都在预料之中。随后，我通过 apt 安装了各种我需要的软件（nginx、Aria2、Transmission 等），写好 `/etc/fstab` 表，就大功告成了。

目前，我的硬盘使用情况如下：

| 硬盘                          | 安装位置 | 用途         |
| :---------------------------- | :------- | :----------- |
| 东芝 240G SSD（TR200）        | 顶部     | 系统盘       |
| 东芝 2T 监控盘（DT01ABA200V） | 硬盘仓 1 | 一般文件存储 |
| 西数 4T 蓝盘（WD40EZRZ）      | 硬盘仓 2 | BT/PT 下载   |

同时，我还有一块 2T 的东芝移动硬盘用于冷备份；我会定期将它连接到 Gen10 上，运行我的脚本来进行 rsync。

嗯，我觉得目前就足够了。等将来有需求的话，再考虑加硬盘吧。

![完工](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/gen10_15.jpg)

### 2024 更新

这台机子还在服役，但是我后来又买了三块 4T 硬盘来组建 RAID-Z1 阵列，同时为了降低运维难度（其实是我懒），所以把系统换成了 TrueNAS Scale。

内存也加到了 16G，因为 ZFS 对内存的需求更多一些。

## 系统运行

我之前的确考虑过 CPU 的问题，毕竟这玩意是焊在主板上的。但我的需求不高（就是存取文件和下载啥的，顺便开个 web 服务器），即使是看动画的话，解码都在客户端完成，所以也就 Gen10 了。

实测我的 CPU 负载一般可以控制在 1.0 以下；如果我真的需要算力，大概我就直接拿主力机器搞事了。

![neofetch](https://file.tcdw.net/blog/post/7e2efde0-398c-58cb-8409-3467324f82c0/Snipaste_2020-01-12_00-09-16.png)

---

<div class="video-container"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/p3itJBdn5FY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
