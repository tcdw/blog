---
title: '在 Termux 编译和使用 bwm-ng（需要 root）'
description: 'bwm-ng 是一个很方便的命令行工具，可以实时监控操作系统的网速和磁盘读写速度。'
pubDate: '2023-05-05T17:26:55.000Z'
---

[bwm-ng](https://github.com/vgropp/bwm-ng) 是一个很方便的命令行工具，可以实时监控操作系统的网速和磁盘读写速度。

我想在 Termux 使用它，但是目前 Termux 的软件源还没有，所以就只能自己编译安装了。

## 步骤

首先，准备好安装了 Termux，且已经 root 的 Android 手机。

然后，我们需要给 Termux 安装 `root-repo`，再安装 `sudo`：

```bash
pkg install root-repo
pkg install sudo
```

安装 Git 和构建工具集：

```bash
pkg install git build-essential
```

接下来，就可以进行编译安装了，但是跟一般的编译安装有点区别：

```bash
git clone https://github.com/vgropp/bwm-ng
cd bwm-ng
sudo ./autogen.sh
sudo make
```

在这里，`./autogen.sh` 和 `make` 命令的前面都增加了 `sudo`，这是为了让编译脚本能够正确识别到 `/proc/` 下的特殊文件（在 Android 下，该目录只能由 `root` 用户访问）。如果不使用 `sudo`，会看到这样的报错：

```text
checking for /proc/net/dev... no
checking for /proc/diskstats... no
checking for /proc/partitions... no
checking for sys/dkstat.h... no
checking whether cc and linker accepts -framework IOKit -framework CoreFoundation... no
checking for sg_get_network_io_stats,sg_get_disk_io_stats in -lstatgrab... no
configure: error: "NO INPUT FOUND"
```

编译完成后，将 `src` 目录下的 `bwm-ng` 二进制文件移动到合适的位置（一般在 `$PATH` 中指定过的路径），使用 `sudo bwm-ng` 就可以使用了。

```text
  bwm-ng v0.6.3 (probing every 0.500s), press 'h' for help
  input: /proc/net/dev type: rate
  /         iface                   Rx                   Tx                Total
  ==============================================================================
      wifi-aware0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
             ifb0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
             sit0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
             p2p0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
    r_rmnet_data1:           0.00 KB/s            0.00 KB/s            0.00 KB/s
               lo:           0.00 KB/s            0.00 KB/s            0.00 KB/s
      rmnet_data2:           0.00 KB/s            0.00 KB/s            0.00 KB/s
      rmnet_data5:           0.00 KB/s            0.00 KB/s            0.00 KB/s
       rmnet_ipa0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
           dummy0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
      rmnet_data1:           0.00 KB/s            0.00 KB/s            0.00 KB/s
    r_rmnet_data2:           0.00 KB/s            0.00 KB/s            0.00 KB/s
      rmnet_data0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
            wlan1:         229.75 KB/s           10.00 KB/s          239.76 KB/s
      rmnet_data3:           0.00 KB/s            0.00 KB/s            0.00 KB/s
            wlan0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
    r_rmnet_data3:           0.00 KB/s            0.00 KB/s            0.00 KB/s
    r_rmnet_data0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
          ip_vti0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
          ip6tnl0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
            bond0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
             ifb2:           0.00 KB/s            0.00 KB/s            0.00 KB/s
             ifb1:           0.00 KB/s            0.00 KB/s            0.00 KB/s
       rmnet_mhi0:          24.65 KB/s          227.47 KB/s          252.12 KB/s
      rmnet_data4:          18.40 KB/s          231.23 KB/s          249.63 KB/s
         ip6_vti0:           0.00 KB/s            0.00 KB/s            0.00 KB/s
  ------------------------------------------------------------------------------
            total:         272.80 KB/s          468.71 KB/s          741.50 KB/s
```