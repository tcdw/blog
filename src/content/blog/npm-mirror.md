---
title: "npm、镜像源与 package-lock.json"
description: "在国内开发涉及 Node.js 的应用都知道，裸连官方的 https://registry.npmjs.org 非常慢，等待时间令人捉急。  解决这种问题，我们自然想到的就是找镜像源（就像 Linux 发行版的包管理器那样）。  国内目前已经有一些 npm 镜像源，大多数情况下，它们其实还是可以用的。但是，package-lock.json 中会记录下各个包的原始 URL："
pubDate: "2021-11-14T10:17:52.000Z"
---

在国内开发涉及 Node.js 的应用都知道，裸连官方的 https://registry.npmjs.org 非常慢，等待时间令人捉急。

解决这种问题，我们自然想到的就是找镜像源（就像 Linux 发行版的包管理器那样）。

国内目前已经有一些 npm 镜像源，大多数情况下，它们其实还是可以用的。但是，`package-lock.json` 中会记录下各个包的原始 URL：

```json
{
  "node_modules/@babel/compat-data": {
    "version": "7.16.0",
    "resolved": "https://repo.huaweicloud.com/repository/npm/@babel/compat-data/-/compat-data-7.16.0.tgz",
    "integrity": "sha512-DGjt2QZse5SGd9nfOSqO4WLJ8NN/oHkijbXbPrxuoJO3oIPJL3TciZs9FX+cOHNiY9E9l0opL8g7BmLe3T+9ew==",
    "dev": true,
    "license": "MIT",
    "engines": {
      "node": ">=6.9.0"
    }
  },
  "node_modules/@babel/core": {
    "version": "7.16.0",
    "resolved": "https://repo.huaweicloud.com/repository/npm/@babel/core/-/core-7.16.0.tgz",
    "integrity": "sha512-mYZEvshBRHGsIAiyH5PzCFTCfbWfoYbO/jcSdXQSUQu1/pW0xDZAUP7KEc32heqWTAfAHhV9j1vH8Sav7l+JNQ==",
    "dev": true,
    "license": "MIT"
  }
}
```

其实如果项目仅仅在国内开发和编译，问题不会很大。但是如果你开发的是开源项目（特别是面向海外的）或者在国外服务器跑 CI，你的项目就有可能会遇到安装依赖时连接不稳定的问题（因为国内这些镜像源**通常不会针对国外优化**）。

对此，我的建议是：

- 尽量避免使用镜像源。
  - ~~进行肉翻。~~
  - 对于连接缓慢的问题，可以给 npm 设置代理，或者利用国外 VPS 为 npm 自建 SNI Proxy，然后在本地修改 hosts 文件/进行 DNS 劫持。
- 如果一定要使用镜像源，则需要：
  - 考虑清楚你的项目是否将完全在国内开发，并让团队中所有人使用相同的镜像源。
  - 尽量选择能够通过 sed 简单替换 `package-lock.json` 中所记载地址的镜像源（例如华为源、中科大源）。
