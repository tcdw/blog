---
title: '如何在上游分支被反复重写时优雅地 Rebase'
description: '最近在处理代码合并时踩了一个大坑，花了 1 小时 20 分钟才解决完冲突。'
pubDate: '2026-01-02T10:18:35.000Z'
---

最近在处理代码合并时踩了一个大坑，花了 1 小时 20 分钟才解决完冲突。

## 背景

我的开发分支 `feature/my-feature` 是基于同事的分支 `feature/their-feature` 开发的。按计划，同事的分支会先合并进 `master`。
棘手的地方在于，同事在合并前对他的分支进行了大量的重写操作（Squash、Drop、Reorder），导致 commit hash 全部变了。

如果这时候我硬生生地直接 `git rebase` 他的新分支，Git 会试图去合并那些其实已经存在但 hash 不同的提交，导致冲突处理起来简直是灾难。

后来我发现，正确的方法是使用 Linux 项目同款的、听起来很古早的方法：手动打 Patch（补丁）。与其在混乱的提交历史中痛苦 Rebase，不如把我的改动剥离出来，再重新打上去。

## 具体步骤

首先把我的独有改动导出为 patch 文件。假设我基于他之前的版本新增了 18 个 commit：

```bash
git format-patch -18 HEAD
# 建议把生成的 .patch 文件移动到一个临时目录，保持清爽
```

然后，放弃当前混乱的时间线，重置到旧版本，并拉取最新的上游代码：

```bash
git reset --hard <某个足够旧的commit>
git fetch
# 这一步把基准切换到同事重写历史后的新分支
git rebase origin/feature/their-feature
```

接下是最重要的一步，使用 `git am` 应用补丁，**并加上 `-3` 参数**：

```bash
git am -3 /path/to/0001-foo.patch
```

`-3` 参数在这里非常关键。开启这个参数以后，当补丁冲突时，我可以打开 Sublime Merge，看着熟悉的界面从容地解决冲突，而不是对着一堆 `.rej` 文件发呆。

解决完冲突后直接 `git am --continue`，检查功能正常，再把第二个、第三个补丁……用同样的方式打上去。

所有补丁打好以后，直接 `git push --force-with-lease` 就可以了！好耶！