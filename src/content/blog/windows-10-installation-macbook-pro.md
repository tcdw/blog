---
title: "在 Intel 版 MacBook Pro 以 EFI 的形式安装 Windows 10"
description: "为什么？"
pubDate: "2020-09-25T15:38:30.000Z"
---

## 为什么？

最近我想玩 Minecraft Windows 10 Edition，但是我在学校，我自己的电脑只有一部 MacBook Pro 2017。

## 那为什么不用 Bootcamp 呢？

因为我也不知道为什么，只有无尽的黑屏与 Windows 10 安装向导初始化的画面。我无法开始安装。

而且 Bootcamp 还有其它的缺点，具体可以看 [这里](https://zhuanlan.zhihu.com/p/29652640)。

顺便少数派那个教程有点过时了，我在我的新款 MacBook Pro 安装时撞了些坑，所以决定写个新教程，造福人类。

## 准备材料

- [Windows 10 ISO](https://www.microsoft.com/zh-cn/software-download/windows10ISO)
- [UNetbootin](https://unetbootin.github.io/)
- 8G 以上的 U 盘（建议使用 USB 3.0 的）
- USB Hub（建议使用 USB 3.0 的）
- 支持 Windows 的键鼠套装（在安装完整的 Bootcamp 驱动以前，内置键盘和触摸板用不了的）
- 机智的你

**如果你使用的是带 T2 芯片的新款机型，请先根据 [官方说明](https://support.apple.com/zh-cn/HT208330) 允许通过外部 USB 设备启动。**

## 我的安装环境

- 机型：MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports)
- 操作系统：macOS 10.13.5 (17F77)
- 磁盘：256GB，只有 macOS 分区

## 分出 Windows 分区

假如你打算留下 macOS，请使用这个命令调整 macOS 分区大小：

```bash
diskutil apfs resizeContainer disk1 200GB    # 200GB 指你给 macOS 留的分区大小
```

这些数值可以酌情调整。但是，**请确保有足够的剩余空间。**

## 制作 Windows 10 安装盘

下载好 Windows 10 ISO，插上你的 U 盘，然后先格式化一下：

![格式化 U 盘](https://assets.tcdww.cn/website/blog/post/4ad94ead-a6cb-5253-9c68-0bb3e12336a2/format_usb_drive.png)

我们把 **格式** 设置为 **MS-DOS (FAT)**，**方案** 设置为 **主引导记录**。

然后我们打开 **UNetbootin**，选择 **Diskimage**，打开我们准备好的 Windows 10 ISO。下面的 **Type** 当然选择 **USB Drive**，然后将 **Drive** 设置成你要制作安装盘的 U 盘（如果不确定的话，可以把主机上所有其它 U 盘和读卡器什么的都拔掉，这样就只有一个选项了）。

![UNetbootin](https://assets.tcdww.cn/website/blog/post/4ad94ead-a6cb-5253-9c68-0bb3e12336a2/make_disk.png)

然后点击 `OK`，耐心等待写入完毕就是了。

![写入过程](https://assets.tcdww.cn/website/blog/post/4ad94ead-a6cb-5253-9c68-0bb3e12336a2/make_disk_progress.png)

在写入完毕后，我们打开 **启动转换助理**，选择 **操作** => **下载 Windows 支持软件**，并将保存位置设为我们的安装盘的根目录下。接下来我们会需要的。

下载即将结束时会向你请求权限，这是正常的，直接输入密码确认就行了。

![下载 Windows 支持软件](https://assets.tcdww.cn/website/blog/post/4ad94ead-a6cb-5253-9c68-0bb3e12336a2/windows_support_dl.png)

## 如果你尝试过 Boot Camp 安装

**如果你没有尝试过 Boot Camp 安装，请跳过这一节！**

直接照着 [这篇帖子](https://superuser.com/questions/508026/windows-detects-gpt-disk-as-mbr-in-efi-boot) 里面的方法做就行。

以及你需要先把 SIP 暂时关掉。

## 开始安装

把你的 U 盘、键盘和鼠标插上你的 USB Hub，并连接 MacBook。

重启你的 MacBook 并按住 Option 键，你会看到有好几个磁盘的选项。按方向键选择 **黄色图标的 EFI Boot**，然后回车。

然后先按提示一路走下去，然后到了选择磁盘这一步，你会发现没有磁盘可选。这是正常的，我们还需要加载驱动程序。

我们点击 **加载驱动程序**，再点击 **浏览**，找到 `C:\WindowsSupport\$WinPEDriver$\AppleSSD64`，确定。然后点击下一步。

稍后，我们就可以看到我们的磁盘分区了。我们按照正常的方法创建好分区，然后继续一路向前就是了。

## 安装驱动

当我们进入安装好的 Windows 10 以后，找到你安装 U 盘下的 `WindowsSupport\BootCamp` 文件夹，运行里面的 `setup.exe`，安装驱动程序，然后重新启动就是了。

然后就大功告成了，你的内置键盘、触摸板等一系列硬件都可以使用了。

## （在我设备上的）已知问题

- Windows 睡眠时间过长以后，你需要经过完整的开机过程才能还原。
- 每次返回 macOS，你恐怕都需要按住 Option 键手工选择 macOS 分区。在设置里改 **启动磁盘** 不管用。
- 蓝牙工作异常
