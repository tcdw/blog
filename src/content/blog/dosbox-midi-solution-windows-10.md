---
title: "在 DOSBox 使用 MIDI (MT-32、GM) 音源"
description: "20171031 更新：我发现 TiMidity+Windows Synthesizer 这玩意貌似有点不靠谱，有时候无法正确启动，所以如果遇到这问题，可以考虑 VirtualMIDISynth。  其实我真觉得这种博文不应该多出现，但 Google 了一下，似乎没有靠谱一点的中文教程，所以我写一下我的配置方法，造福萌新。"
pubDate: "2017-06-25T02:52:01.000Z"
updatedDate: "2024-06-07T14:41:24.000Z"
---

> 20171031 更新：我发现 TiMidity++ Windows Synthesizer 这玩意貌似有点不靠谱，有时候无法正确启动，所以如果遇到这问题，可以考虑 [VirtualMIDISynth](http://coolsoft.altervista.org/en/virtualmidisynth)。

其实我真觉得这种博文不应该多出现，但 Google 了一下，似乎没有靠谱一点的中文教程，所以我写一下我的配置方法，造福萌新。

于 Windows 10 x64 测试通过。

## 准备材料

- [DOSBox](http://www.dosbox.com/)
- [VirtualMIDISynth](http://coolsoft.altervista.org/en/virtualmidisynth) 或 [TiMidity++ Windows Synthesizer](https://zh.osdn.net/projects/twsynth/releases/)
- [GeneralUser GS](http://www.schristiancollins.com/generaluser.php)  
  Windows 自带的那套 MIDI 波表太！难！听！了！所以需要换个好点的合成器和波表。GeneralUser GS 波表体积只有大约 30 MB，而且比较悦耳，一般使用足矣。
- [Munt](https://sourceforge.net/projects/munt/)  
  MT-32 模拟器
- MT-32 模拟器所需的 [两个 ROM 文件](https://file.tcdw.net/blog/misc/MT-32%20ROMs.7z)

## General MIDI

### VirtualMIDISynth 方案

安装 VirtualMIDISynth，在桌面托盘右键，进入设置页面，添加你喜爱的波表文件。

![波表文件配置](https://file.tcdw.net/blog/post/4e36a618-fdd2-5662-9ab7-8d0e8bb0920a/vmidisynth.png)

（图片是我从官网拿的，因为目前我只有一台 MacBook 可用

### TiMidity++ 方案

安装 TiMidity++，然后编辑 `C:\timidity\Musix\timidity.cfg`（如果你指定了其它安装路径，就是 TiMidity 根目录下的 `Musix\timidity.cfg`），把剩下的内容都注释掉，然后指定 GeneralUser GS 的位置：

```
# 文件所在目录，具体视 sf2 文件放置位置决定
dir "C:\"

# 指定 sf2 格式的波表文件，半角引号里面就是文件名
soundfont "GeneralUser GS v1.471.sf2"
```

然后启动 timw32g，你可以打开一个 MIDI 文件，测试效果。

## Munt

安装 Munt，然后打开程序，选择 Options -> ROM Configuration，载入刚才下载的两个 MT-32 ROM。

![MT-32 ROM 加载](https://file.tcdw.net/blog/post/4e36a618-fdd2-5662-9ab7-8d0e8bb0920a/o_1bj9anj0p171biav1khlcd32h5a.png)

## DOSBox

敲命令 `mixer /listmidi`，会看到这样的输出：

![可用 MIDI 设备](https://file.tcdw.net/blog/post/4e36a618-fdd2-5662-9ab7-8d0e8bb0920a/o_1bj97b6kjt1aoipii61bhu18s4a.png)

正如你所见，我们现在有 M$ 的音源、MT-32 模拟器、TiMidity++ 可选，左侧是它们对应的 ID。

要使用对应的 Driver，在开始菜单找到 `DOSBox Config`，打开，搜索这几行：

```
[midi]
#     mpu401: Type of MPU-401 to emulate.
#             Possible values: intelligent, uart, none.
# mididevice: Device that will receive the MIDI data from MPU-401.
#             Possible values: default, win32, alsa, oss, coreaudio, coremidi, none.
# midiconfig: Special configuration options for the device driver. This is usually the id of the device you want to use.
#               See the README/Manual for more details.

mpu401=intelligent
mididevice=default
midiconfig=2
```

看到那个 `midiconfig=2` 了吗？在这个例子里，如果需要使用不同音源，把等号后面的数字改成对应的 ID（如果想要使用 MT-32 音源，就改成 1），保存配置文件，即可使用。

## 游戏配置

不同游戏有不同的设置方法，但是很多都允许你设置音源。按照游戏提示操作即可。

![配置](https://file.tcdw.net/blog/post/4e36a618-fdd2-5662-9ab7-8d0e8bb0920a/o_1bjfdm03l1bn8rkgeg42l71i9va.png)

然后你的 DOS 游戏就有了格外动听的音乐。

## 局限性

- 不是所有的游戏都支持 MIDI 音源。
- 一些游戏的 FM 音源[也许比 MIDI 音源动听](https://youtu.be/JiZOxUhQj10?t=548)。
