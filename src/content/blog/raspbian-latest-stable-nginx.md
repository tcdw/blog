---
title: '在树莓派（Raspbian）上安装最新稳定版 nginx'
description: '如果需要在 Raspbian 上安装最新稳定版 nginx，其实官方是 提供了 Debian 的 apt 源 的，但是并没有提供 armhf 的二进制文件。  于是，我们只好自己通过 Debian 的方式编译安装了。   此方法优点   安装好的 nginx，配置文件路径、维护方法等与官方 Debian 版 nginx 一致。'
pubDate: '2019-11-05T03:35:40.000Z'
---

如果需要在 Raspbian 上安装**最新稳定版 nginx**，其实官方是 [提供了 Debian 的 apt 源](http://nginx.org/en/linux_packages.html#Debian) 的，但是并没有提供 `armhf` 的二进制文件。

于是，我们只好自己通过 Debian 的方式编译安装了。

## 此方法优点

* 安装好的 nginx，配置文件路径、维护方法等与官方 Debian 版 nginx **一致**。
* 如果需要卸载 nginx，只需执行 `sudo apt purge nginx`。

## 步骤

### 1. 安装添加官方 apt 源前所需的包

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release
```

### 2. 添加官方 apt 源

```bash
# 添加官方 apt 源。与官方说明不同的是，由于我们需要源代码，这里添加的是 deb-src 而不是 deb
echo "deb-src http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list

# 添加 PGP 公钥
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
sudo apt-key fingerprint ABF5BD827BD9BF62

# 下载最新的软件包列表
sudo apt update
```

### 3. 安装 nginx 所需的依赖

```bash
sudo apt build-dep nginx
```

### 4. 下载 nginx 的源代码

```bash
# 建议单独建立文件夹来存放此次 nginx 编译所需文件，因为你的工作目录会多出若干文件
mkdir nginx_build
cd nginx_build

# 下载源代码
apt source nginx
```

### 5. 编译安装

此时我们检查目录下有什么文件：

```text
drwxr-xr-x 10 tcdw tcdw    4096 Nov  5 03:20  nginx-1.16.1
-rw-r--r--  1 tcdw tcdw  114248 Aug 13 17:17  nginx_1.16.1-1~buster.debian.tar.xz
-rw-r--r--  1 tcdw tcdw    1510 Aug 13 17:17  nginx_1.16.1-1~buster.dsc
-rw-r--r--  1 tcdw tcdw 1032630 Aug 13 17:17  nginx_1.16.1.orig.tar.gz
```

由此可见，此次我们需要先进入 `nginx-1.16.1` 文件夹。**实际文件夹名称可能会由于版本更新而与本文不一致**，但应该只有那一个文件夹，且所有相关文件 / 文件夹均以 `nginx-` 开头。

```bash
cd nginx-1.16.1
```

开始编译安装：

```bash
dpkg-buildpackage -uc -b
```

完成后，返回上一层目录，发现我们的目录中出现了 `nginx_1.16.1-1~buster_armhf.deb` 文件。我们现在可以开始安装了：

```bash
sudo dpkg -i nginx_1.16.1-1~buster_armhf.deb
```

大功告成！

![nginx -V 的输出](https://assets.tcdww.cn/website/blog/post/bf29fba0-fcb9-5658-af98-c99c9075a99e/Snipaste_2019-11-05_11-01-58.png)

## 升级新版本

重复第 4 - 5 步即可。