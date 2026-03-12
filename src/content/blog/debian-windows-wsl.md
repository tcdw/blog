---
title: '把 WSL 的发行版换成 Debian 时撞的坑'
description: 'tl;dr：别自以为是  参考教程：Debian on Windows via WSL  1. 下载 Git for Windows 这种庞然大物不是必须的，你直接从 GitHub 上 Download ZIP 就行 2. 安装 Python，一定要记得在第一步勾选 Add Python 3.x to PATH'
pubDate: '2017-11-05T12:15:41.000Z'
---

tl;dr：别自以为是

[参考教程：Debian on Windows via WSL](https://ariya.io/2017/03/debian-on-windows-via-wsl)

1. 下载 Git for Windows 这种庞然大物**不是必须的**，你直接从 GitHub 上 Download ZIP 就行
2. 安装 Python，一定要记得在第一步勾选 `Add Python 3.x to PATH`
3. 一定要乖乖地从 PowerShell 运行，而不是 cmd，否则会出现 WinError 126 错误
4. 刚安装好的 Debian 实在太精简了，所以别忘了先 `apt update` 然后装个文本编辑器，否则你编辑点什么都相当痛苦
5. 这个 Debian 连 `man` 都没有，所以也需要自己装
6. 为了修复 locale 问题，你需要

```bash
echo "en_US.UTF-8 UTF-8" > /etc/locale.gen  
apt install locales
```

现在你终于可以 `apt install` 一通乱装了。

Ubuntu 16.04 能用还是好好用吧，不要学我