---
title: Git常规操作与Linux命令
date: 2019-05-05 21:18:43
tags: 基础操作
categories: 
- 基础操作
---

## Git

我看过很多GIt教程,平时还是自己多使用才容易记住,为了更快地理解这些GIt操作,我打算用QA的形式整理这些操作和作用,还有一个国外的网站教你如何快速地熟悉[Git操作](https://learngitbranching.js.org/?tdsourcetag=s_pcqq_aiomsg)

### 基础命令

```shell
git reset 直接通过移动Head指针指向进行回滚(做减法)
git revert 通过提交一个新的commit(与之前某个版本内容相同实现回滚,做加法)
git checkout 切换分支
git add 提交至暂存区
git branch 新建分支(-m 则表示进行分支重命名)
git diff 文件对比(解决冲突)
git commit 提交至本地
git push 推送至远程
git merge bugFix命令 将bugFix分支合并到master分支上
```

### Q:本地分支和远程分支没有关联导致提交失败,怎么处理?

A:我们可以使用`git push origin 分支名`强制推送至远程,Git很人性化的给出了`git push --set-upstream origin 分支名`这个命令提示,我们只要输入该命令之后,每次只需要`git push`即可,不需要强制推送了

### Q:当有紧急任务需要切换分支时,而目前开发的分支只完成了一半,又不想提交无效commit,该怎么做?

A:通过`git statsh`把未提交的修改(包括暂存的和非暂存的)暂存起来,注意是**暂存至本地**,然后切换分支解决对应问题后,我们回到原来的分支,使用`git statsh pop`可以取出刚刚修改内容,`git statsh apply`也是同样的效果,不过该命令不会把修改内容在Git缓存堆栈中清除,可以应用至多个工作目录

### Q:提交了很多commit到远程分支,但每个commit只有少量的改动,所以想将这些commit进行合并怎么操作?

A:假设我们合并前三个commit,首先用`git log`查看最近的提交,然后执行`git rebase -i 第四个commit的版本号 `然后会跳出弹框,将**将除了第一个的pick，其他都改为 s 或 squash(p表示保留该commit,s表示与前一个commit合并)**,修改后保存退出,再次输入`git log`会发现提交已经合并,然后执行` git push -f`将分支强制提交到远程

### Q:执行了强制回滚Git reset --hard导致前面的修改都丢失了,并提交了新的commit,怎么把之前的修改恢复,并保留新的commit?

A:执行`git reflog`可以查看之前所有的git操作,找到前面修改的hash码,然后用`git reset --hard hash码`执行回滚,最新的commit的hash码也能够观察到,用`git cherry-pick hash码`将新的commit内容合并进来,然后解决冲突即可

