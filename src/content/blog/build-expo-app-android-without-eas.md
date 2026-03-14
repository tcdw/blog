---
title: "不用 eas-cli 编译 React Native (Expo) 应用的 Android 版本"
description: "为什么不用 eas"
pubDate: "2024-08-30T06:10:45.000Z"
updatedDate: "2025-04-13T12:39:21.000Z"
---

### 为什么不用 eas-cli

- 它需要你注册 Expo 帐号，并且建立一个新的 Project 在上面
- 它每次运行都要连接 Expo 的云服务
- [它不让你在 Windows 上跑。](https://github.com/expo/eas-cli/issues/1726)气抖冷！！

（当然如果以上方面对你不是问题的话，eas 其实挺适合懒人在自己的电脑/基础设施上跑的，特别是你不在内地的电脑上进行开发时）

### 需求

- 配好 JDK 和 Android SDK，并且指定好它们的 `PATH`、`JAVA_HOME` 和 `ANDROID_HOME`。[详见](https://docs.expo.dev/guides/local-app-development/)
- 项目启用 [Prebuild](https://docs.expo.dev/workflow/prebuild/)

### 配置 Keystore

为了让编译出来的应用使用我们自己的 Keystore，我们需要修改 `android/app/build.gradle` 文件，在 `signingConfigs` 加入自己的 Keystore 信息，并且在 `buildTypes` 的 `release` 中设置 `signingConfig signingConfigs.release` 。

由于我们的项目使用 Expo Managed Workflow，为了确保 Native 部分不会出现不同步的问题，这里通过编写项目级插件的方式实现修改：

```javascript
// plugins/withAndroidSignature.js

const { withAppBuildGradle } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAndroidSignature(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setAndroidSignature(config.modResults.contents);
    } else {
      throw new Error("如果不是 groovy，则无法在 app/build.gradle 中设置 signingConfigs");
    }
    return config;
  });
};

function setAndroidSignature(appBuildGradle) {
  if (!fs.existsSync(path.resolve(__dirname, "../credentials.json"))) {
    console.warn("警告：没有设置正式版本的 Android Keystore 文件，因为 credentials.json 不存在。");
    return appBuildGradle;
  }
  const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../credentials.json"), { encoding: "utf8" }));

  // 使用正则表达式插入签名信息
  let output = appBuildGradle.replace(
    /(signingConfigs\s*\{)/,
    `$1
        release {
            storeFile file(${JSON.stringify(path.resolve(__dirname, "../credentials/android-release.keystore"))})
            storePassword ${JSON.stringify(info.android.keystore.keystorePassword)}
            keyAlias ${JSON.stringify(info.android.keystore.keyAlias)}
            keyPassword ${JSON.stringify(info.android.keystore.keyPassword)}
        }`,
  );

  // 使用正则表达式替换 signingConfig
  output = output.replace(
    /(release\s*\{)[^}]*?signingConfig\s+signingConfigs\.debug/s,
    `$1
            signingConfig signingConfigs.release
`,
  );

  return output;
}
```

为了方便维护，我们将 Keystore 的本体放在项目根目录下 `credentials/android-release.keystore` ，而 Keystore 的信息放在 `credentials.json` 里。

（这里的 `credentials.json` 文件格式与 Expo 文档中的 [Use local credentials](https://docs.expo.dev/app-signing/local-credentials/) 一致）

```json
{
  "android": {
    "keystore": {
      "keystorePath": "credentials/android-release.keystore",
      "keystorePassword": "your keystore password",
      "keyAlias": "your key alias",
      "keyPassword": "your key password"
    }
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "password"
    }
  }
}
```

然后，在 `app.json` 中指定这个项目级插件：

```json
{
  "expo": {
    "plugins": ["./plugins/withAndroidSignature"]
  }
}
```

### 编译

首先，我们需要执行一次 `npx expo prebuild`，让它生成 `android` 文件夹。这个文件夹包含了我们项目的 Native 部分。

打包给 Google Play 商店用的 `.aab` 文件：

```bash
cd android
./gradlew bundleRelease
```

你的编译产物会出现在项目根目录下 `android/app/build/outputs/bundle/release/app-release.aab` 。

而如果是给别人直接安装的 `.apk` 文件：

```bash
cd android
./gradlew assembleRelease
```

你的编译产物会出现在项目根目录下 `android/app/build/outputs/apk/release/app-release.apk` 。

如果在 Windows 下编译，需要把 `./gradlew` 改成 `./gradlew.bat`。

### 还有一些东西……

为了简化上述的操作，我推荐在 `package.json` 中设置好相应的脚本。

```json
{
  "scripts": {
    "prepare": "pnpm run clean && expo prebuild",
    "build:android": "cd android && ./gradlew assembleRelease",
    "clean": "node -e \"const opt = { recursive: true, force: true }; fs.rmSync('./ios', opt); fs.rmSync('./android', opt)\""
  }
}
```

另外，不要忘了把这些东西加到你的 `.gitignore` 里：

```text
/credentials/*.keystore
/credentials.json

/ios
/android
```

---

这篇博文受到了上面那个「eas-cli 不能在 Windows 跑」的 Issue 中 [这篇回复](https://github.com/expo/eas-cli/issues/1726#issuecomment-2125696207) 的启发，我对于其中的操作流程进行了一些改进，让它更适合 Expo Managed Workflow。

<iframe width="560" height="315" src="https://www.youtube.com/embed/DMzFg7g6gb0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
