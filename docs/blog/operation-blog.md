---
title: 搭建持续集成的个人博客
date: 2019-07-28 21:18:43
---

## 搭建持续集成的个人博客

说明：由于vuepress、github page、travis-ci的官网都有详细的教程，我这里就略过了一些简单/细节的东西，推荐综合官方教程一起食用。

另外也略过了一些细节，比如新建脚本后别忘了给它加执行权限等。

总的来说步骤是这样的：

1.搭建vuepress，根据markdown文档生成页面

2.搭建github page来访问生成的页面

3.使用travis持续集成，方便以后更新文章。

### **vuepress安装**

```text
# install globally
yarn global add vuepress # OR npm install -g vuepress

# create a markdown file
echo '# Hello VuePress' > README.md

# start writing
vuepress dev

# build
vuepress build
```

vuepress dev 命令后面可以接文件夹的名称，这个文件夹是用来放你的markdown文档的，不写的话默认为当前文件夹。

vuepress dev 命令用来开发调试， vuepress build 根据你的markdown来生成页面， 生成的数据放在文档文件夹下的.vuepress文件下的dist（默认）文件夹下， 也可以通过修改docs/.vuepress/config.js来更改输出的位置。

已经可以生成页面了，接下来就是部署了，vuepress官方推荐了几种方法部署，这里使用的是github page。

### **Github page**

想使用Github page， 先去github 建一个仓库名为<yourusername>.[http://github.io](https://link.zhihu.com/?target=http%3A//github.io)， 然后这个仓库里的页面你可以在<yourusername>.github.io这个域名下访问了。

好了，我们有vuepress可以根据markdown生成页面，又可以通过github pape访问页面，现在只需要把生成的页面代码传到<yourusername>.github.io这个仓库里了。

注：笔者用的是<yourusername>.[http://github.io](https://link.zhihu.com/?target=http%3A//github.io)这种域名，如果想用<USERNAME>.[http://github.io/](https://link.zhihu.com/?target=http%3A//github.io/)<REPO>/这种的话就需要更改docs/.vuepress/config.js的base属性了。

> Set correct `base` in `docs/.vuepress/config.js`.
> If you are deploying to `https://<USERNAME>.github.io/`, you can omit `base` as it defaults to `"/"`.
> If your are deploying to `https://<USERNAME>.github.io/<REPO>/`, (i.e. your repository is at `https://github.com/<USERNAME>/<REPO>`), set `base` to `"/<REPO>/"`.

这之后就直接传到新仓库了，可以把代码写进脚本deploy里，请根据注释自行取消或更改某些代码注释。

```text
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

执行这个脚本后，等一会儿应该就能在<yourusername>.github.io访问了。

不过这样有个问题，每当我们新写好一篇文章就需要先push，然后自己在本地把markdown转成页面，再把页面推到仓库里。

如果我们可以push后就可以自动化做这些事就好了，而持续集成就是做这个的， Continuous integration， 简称CI。提供CI服务的有很多，比如最著名的travis-ci，或者gitlab-ci等，如果你有在一些github仓库看到过.travis.yml就应该知道我在说什么了。

### **travis持续集成**

先用github账号登录travis网站，然后同步你的仓库， 然后勾选我们的项目仓库（是**保存文档的仓库**（保证package.json中含有Vuepress依赖）而不是放生成页面的仓库）

配置依次为：

1. `GH_REF`：仓库地址
2. `GH_TOKEN`：生成的令牌
3. `P_BRANCH`：推送的pages分支 //这里填的时候一定要注意,一般来讲就是 gh-pages 。别手抖写个master。血淋淋的教训~
4. `U_EMAIL`：邮箱
5. `U_NAME`：名称

然后在你的项目文件夹新建文件 .travis.yml， 这个文件内容根据你的项目而定，比如我们的项目可以是这样的。

```text
language: node_js
sudo: required
node_js:
  - 8.11.1
cache:
  directories:
    - node_modules
script:
    - npm run docs:build
after_script:
    - cd docs/.vuepress/dist
    - git init
    - git add -A
    - git commit -m 'deploy'
    - git push -f https://${access_token}@github.com/BaoTao1997/BaoTao1997.github.io.git master
```

.travis.yml的作用就是告诉travis项目的环境是如何的，它会自动帮你先构建好环境。

也就是说当我们push或pr到目标仓库的时候，travis会自动帮你去执行这里的脚本。

我们写好.travis.yml后，用git推上去后应该就会产生第一次构建，可以在travis的后台观察服务器的日志，可以看到它会先去安装node环境以及各种必须的东西，然后会执行该脚本。

然而， 你会发现后台里报错了， 原因是 Permission Denied (publickey)， 其实就是travis没有github的权限。一般来说个人的话只要把自己的公钥放github里就可以git push了，但它不行。这时候我们就需要借助于 github的Personal access token了。

首先在github的setting---developer setting---personal access token一栏点击generate new token， 这下面的选项全选，然后就会生成一个token，复制这个token。

进入travis后台，在环境变量（Environment Variables）里设置键值对，比如

access_token <把复制的token黏贴在这>

这样，travis就可以拥有访问github仓库的权限/token了，最后一步，修改deploy.sh。

把deploy.sh里的

```text
git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
```

改成

```text
git push -f https://${access_token}@github.com/<USERNAME>/<USERNAME>.github.io.git master
```

就好了。

现在在试着push，观察[travis服务器日志](https://www.travis-ci.org)是否成功。

### 参考文献

1. [持续集成服务 Travis CI 教程](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)

2. [搭建持续集成、基于vuepress的Github Page](https://zhuanlan.zhihu.com/p/36390666)