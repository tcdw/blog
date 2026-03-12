---
title: '我对 Vue Router「动态路由」的一点暴论'
description: '每当我接触到一些既有的使用 Vue 开发的业务系统时，总是能看到一种被称为「动态路由」的实现方式。'
pubDate: '2025-03-12T17:45:33.000Z'
updatedDate: '2025-04-13T12:38:54.000Z'
---

*本文是对我之前在 X (Twitter) 平台发表的 [推文](https://x.com/tcdwww/status/1645083541817131008) 的整合。*

每当我接触到一些既有的使用 Vue 开发的业务系统时，总是能看到一种被称为「动态路由」的实现方式。

如果你只知道 React Router 或 Next.js 的「动态路由」，嗯，首先我们说的不是一个东西。Vue Router 这边的「动态路由」指的是：**服务端**存储一份完整的 Vue Router 所需数据结构，前端在初次加载页面时**必须先从服务端获取这个结构**，然后遍历结构并执行 `router.addRoute()` 才能继续工作。根据用户角色不同，返回的路由列表也会有所差异。

对于这种实现方式，我一直难以理解将完整路由数据结构放在服务端维护的必要性，尤其是对于那些操作 JSON 不太方便的后端编程语言来说（说的就是你，Java）。当我向早期参与这些项目开发的人询问原因时，他们往往只能给出这两点理由：

- 需要根据用户角色展示其可访问的页面
- 可以根据领导要求临时开关某些功能

然而，我觉得第一点理由似乎站不住脚。前端完全可以通过简单地获取用户角色权限字符串来实现相同功能（甚至他们使用的框架，比如若依，[就已经内置了这种功能](https://doc.ruoyi.vip/ruoyi-vue/document/qdsc.html#auth%E5%AF%B9%E8%B1%A1)）。同时，这种方式也无法真正阻止「高级用户」了解系统中所有页面的存在，因为这些业务页面通常需要视情况使用 `await import()`、Vite 的 `import.meta.glob`、Webpack (Vue CLI) 的 `require.context` 或其它打包器的类似 API 进行批量导入，查看源代码进行简单查找就能发现所有页面和它们的文件名。

至于第二点关于能够随时关闭某个功能（页面）的需求，也找不到必须由后端传输整个路由表数据结构的合理理由。在我们从零开发的一套业务系统中，采用的方案是：后端维护一个简化的树形结构，仅记录每个路由的技术名称、所需权限和启用状态，而前端则在第一次加载页面时获取该结构，将其转换为 Map，之后由路由守卫来检查 Map 中的项目，判断页面是否可以访问。

以我浅薄的经历来看，「动态路由」真的是一种毫无优点、但是缺点却一大堆的方案。这种做法往往会导致各种混乱的代码出现，成为开发维护的噩梦（前司一些前端调试「动态路由」就要浪费两天时间）。当然，这些问题或许还有一些技术方面外的考量吧，这里我还是不要过多评价了。

<iframe width="560" height="315" src="https://www.youtube.com/embed/upULQAwjb1Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>