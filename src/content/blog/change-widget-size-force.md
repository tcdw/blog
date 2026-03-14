---
title: "强行修改 Android 桌面小部件大小的方法，需 root"
description: "TBD: 修复图片  首先，把要修改的小部件移到合适的位置，这里以时钟为例。    然后把 sqlite editor 打开，按 home 键回到桌面，把编辑器留在后台备用。    然后进入设置 应用程序 全部 目标启动器，点击 强行停止。    找到启动器应用，打开数据库，找到刚才准备的桌面小部件。"
pubDate: "2013-04-07T05:37:00.000Z"
updatedDate: "2024-04-28T08:05:17.000Z"
---

首先，把要修改的小部件移到合适的位置，这里以时钟为例。

![步骤 1](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg.jpg)

然后把 sqlite editor 打开，按 home 键回到桌面，把编辑器留在后台备用。

![步骤 2](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg--1-.jpg)

然后进入设置 - 应用程序 - 全部 - _目标启动器_，点击 强行停止。

![步骤 3](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg--2-.jpg)

找到启动器应用，打开数据库，找到刚才准备的桌面小部件。

![步骤 4](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg--3-.jpg)

点击圆珠笔图标，修改 `spanX` 和 `spanY`，然后保存。

其他的启动器修改方法差不多。

![步骤 5](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg--4-.jpg)

修改成功。

![步骤 6](https://assets.tcdww.cn/website/blog/post/d9f4dcfd-3d1c-5b8a-bd25-83546b2c8912/timg--5-.jpg)
