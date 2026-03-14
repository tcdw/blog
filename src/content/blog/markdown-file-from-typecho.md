---
title: "从你的 Typecho 博客优雅的导出 Markdown 文件"
description: "如果你厌倦了 Typecho 的话……  嗯，我写了个 JavaScript 命令行工具，可以从你的 Typecho 博客导出 Markdown 文件。   准备    新版 node.js 与 npm  MySQL / MariaDB 数据库，里面有 Typecho 的数据库"
pubDate: "2017-03-06T16:00:00.000Z"
---

如果你厌倦了 Typecho 的话……

嗯，我写了个 JavaScript 命令行工具，可以从你的 Typecho 博客导出 Markdown 文件。

## 准备

- 新版 node.js 与 npm
- MySQL / MariaDB 数据库，里面有 Typecho 的数据库

## 步骤

### 安装工具

```bash
npm install -g typecho-to-md
```

### 吸出 Markdown 文件

比如你的 Typecho 数据库在本地，数据库名是 `my_blog`，有权限访问这个数据库的用户名是 `alice`，密码是 `123456`，数据库表前缀是 `alice_`，准备把 Markdown 文件输出到 `output` 文件夹。

于是，你需要这样执行命令：

```
typecho2md -u alice \
           -k 123456 \
           -d my_blog \
           -p alice_ \
           output
```

如果什么都没输出，说明转换过程顺利的完成了。

进入 `output` 文件夹，你的文章已经整齐的按照文章类型放在对应的文件夹了，而且是 Markdown 格式耶！

## 更多

本工具还支持一些其它的参数设置，以及自定义 Markdown 模板（ejs 语法），这样迁移到 Hexo 之类的博客程序的话会更方便。

更多的详情可以戳 [这里](https://www.npmjs.com/package/typecho-to-md)。
