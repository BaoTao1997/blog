(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{248:function(s,e,t){"use strict";t.r(e);var a=t(0),n=Object(a.a)({},function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h2",{attrs:{id:"搭建持续集成的个人博客"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#搭建持续集成的个人博客","aria-hidden":"true"}},[s._v("#")]),s._v(" 搭建持续集成的个人博客")]),s._v(" "),t("p",[s._v("说明：由于vuepress、github page、travis-ci的官网都有详细的教程，我这里就略过了一些简单/细节的东西，推荐综合官方教程一起食用。")]),s._v(" "),t("p",[s._v("另外也略过了一些细节，比如新建脚本后别忘了给它加执行权限等。")]),s._v(" "),t("p",[s._v("总的来说步骤是这样的：")]),s._v(" "),t("p",[s._v("1.搭建vuepress，根据markdown文档生成页面")]),s._v(" "),t("p",[s._v("2.搭建github page来访问生成的页面")]),s._v(" "),t("p",[s._v("3.使用travis持续集成，方便以后更新文章。")]),s._v(" "),t("h2",{attrs:{id:"vuepress安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vuepress安装","aria-hidden":"true"}},[s._v("#")]),s._v(" "),t("strong",[s._v("vuepress安装")])]),s._v(" "),t("div",{staticClass:"language-text line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("# install globally\nyarn global add vuepress # OR npm install -g vuepress\n\n# create a markdown file\necho '# Hello VuePress' > README.md\n\n# start writing\nvuepress dev\n\n# build\nvuepress build\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br")])]),t("p",[s._v("vuepress dev 命令后面可以接文件夹的名称，这个文件夹是用来放你的markdown文档的，不写的话默认为当前文件夹。")]),s._v(" "),t("p",[s._v("vuepress dev 命令用来开发调试， vuepress build 根据你的markdown来生成页面， 生成的数据放在文档文件夹下的.vuepress文件下的dist（默认）文件夹下， 也可以通过修改docs/.vuepress/config.js来更改输出的位置。")]),s._v(" "),t("p",[s._v("已经可以生成页面了，接下来就是部署了，vuepress官方推荐了几种方法部署，这里使用的是github page。")]),s._v(" "),t("h2",{attrs:{id:"github-page"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#github-page","aria-hidden":"true"}},[s._v("#")]),s._v(" "),t("strong",[s._v("Github page")])]),s._v(" "),t("p",[s._v("想使用Github page， 先去github 建一个仓库名为"),t("yourusername",[s._v("."),t("a",{attrs:{href:"https://link.zhihu.com/?target=http%3A//github.io",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://github.io"),t("OutboundLink")],1),s._v("， 然后这个仓库里的页面你可以在"),t("yourusername",[s._v(".github.io这个域名下访问了。")])],1)],1),s._v(" "),t("p",[s._v("好了，我们有vuepress可以根据markdown生成页面，又可以通过github pape访问页面，现在只需要把生成的页面代码传到"),t("yourusername",[s._v(".github.io这个仓库里了。")])],1),s._v(" "),t("p",[s._v("注：笔者用的是"),t("yourusername",[s._v("."),t("a",{attrs:{href:"https://link.zhihu.com/?target=http%3A//github.io",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://github.io"),t("OutboundLink")],1),s._v("这种域名，如果想用"),t("USERNAME",[s._v("."),t("a",{attrs:{href:"https://link.zhihu.com/?target=http%3A//github.io/",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://github.io/"),t("OutboundLink")],1),t("REPO",[s._v("/这种的话就需要更改docs/.vuepress/config.js的base属性了。")])],1)],1)],1),s._v(" "),t("blockquote",[t("p",[s._v("Set correct "),t("code",[s._v("base")]),s._v(" in "),t("code",[s._v("docs/.vuepress/config.js")]),s._v(".\nIf you are deploying to "),t("code",[s._v("https://<USERNAME>.github.io/")]),s._v(", you can omit "),t("code",[s._v("base")]),s._v(" as it defaults to "),t("code",[s._v('"/"')]),s._v(".\nIf your are deploying to "),t("code",[s._v("https://<USERNAME>.github.io/<REPO>/")]),s._v(", (i.e. your repository is at "),t("code",[s._v("https://github.com/<USERNAME>/<REPO>")]),s._v("), set "),t("code",[s._v("base")]),s._v(" to "),t("code",[s._v('"/<REPO>/"')]),s._v(".")])]),s._v(" "),t("p",[s._v("这之后就直接传到新仓库了，可以把代码写进脚本deploy里，请根据注释自行取消或更改某些代码注释。")]),s._v(" "),t("div",{staticClass:"language-text line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("#!/usr/bin/env sh\n\n# abort on errors\nset -e\n\n# build\nnpm run docs:build\n\n# navigate into the build output directory\ncd docs/.vuepress/dist\n\n# if you are deploying to a custom domain\n# echo 'www.example.com' > CNAME\n\ngit init\ngit add -A\ngit commit -m 'deploy'\n\n# if you are deploying to https://<USERNAME>.github.io\n# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master\n\n# if you are deploying to https://<USERNAME>.github.io/<REPO>\n# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages\n\ncd -\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br")])]),t("p",[s._v("执行这个脚本后，等一会儿应该就能在"),t("yourusername",[s._v(".github.io访问了。")])],1),s._v(" "),t("p",[s._v("不过这样有个问题，每当我们新写好一篇文章就需要先push，然后自己在本地把markdown转成页面，再把页面推到仓库里。")]),s._v(" "),t("p",[s._v("如果我们可以push后就可以自动化做这些事就好了，而持续集成就是做这个的， Continuous integration， 简称CI。提供CI服务的有很多，比如最著名的travis-ci，或者gitlab-ci等，如果你有在一些github仓库看到过.travis.yml就应该知道我在说什么了。")]),s._v(" "),t("h2",{attrs:{id:"travis持续集成"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#travis持续集成","aria-hidden":"true"}},[s._v("#")]),s._v(" "),t("strong",[s._v("travis持续集成")])]),s._v(" "),t("p",[s._v("先用github账号登录travis网站，然后同步你的仓库， 然后勾选我们的项目仓库（是"),t("strong",[s._v("保存文档的仓库")]),s._v("（保证package.json中含有Vuepress依赖）而不是放生成页面的仓库）")]),s._v(" "),t("p",[s._v("配置依次为：")]),s._v(" "),t("ol",[t("li",[t("code",[s._v("GH_REF")]),s._v("：仓库地址")]),s._v(" "),t("li",[t("code",[s._v("GH_TOKEN")]),s._v("：生成的令牌")]),s._v(" "),t("li",[t("code",[s._v("P_BRANCH")]),s._v("：推送的pages分支 //这里填的时候一定要注意,一般来讲就是 gh-pages 。别手抖写个master。血淋淋的教训~")]),s._v(" "),t("li",[t("code",[s._v("U_EMAIL")]),s._v("：邮箱")]),s._v(" "),t("li",[t("code",[s._v("U_NAME")]),s._v("：名称")])]),s._v(" "),t("p",[s._v("然后在你的项目文件夹新建文件 .travis.yml， 这个文件内容根据你的项目而定，比如我们的项目可以是这样的。")]),s._v(" "),t("div",{staticClass:"language-text line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("language: node_js\nsudo: required\nnode_js:\n  - 8.11.1\ncache:\n  directories:\n    - node_modules\nscript:\n    - npm run docs:build\nafter_script:\n    - cd docs/.vuepress/dist\n    - git init\n    - git add -A\n    - git commit -m 'deploy'\n    - git push -f https://${access_token}@github.com/BaoTao1997/BaoTao1997.github.io.git master\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br")])]),t("p",[s._v(".travis.yml的作用就是告诉travis项目的环境是如何的，它会自动帮你先构建好环境。")]),s._v(" "),t("p",[s._v("也就是说当我们push或pr到目标仓库的时候，travis会自动帮你去执行这里的脚本。")]),s._v(" "),t("p",[s._v("我们写好.travis.yml后，用git推上去后应该就会产生第一次构建，可以在travis的后台观察服务器的日志，可以看到它会先去安装node环境以及各种必须的东西，然后会执行该脚本。")]),s._v(" "),t("p",[s._v("然而， 你会发现后台里报错了， 原因是 Permission Denied (publickey)， 其实就是travis没有github的权限。一般来说个人的话只要把自己的公钥放github里就可以git push了，但它不行。这时候我们就需要借助于 github的Personal access token了。")]),s._v(" "),t("p",[s._v("首先在github的setting---developer setting---personal access token一栏点击generate new token， 这下面的选项全选，然后就会生成一个token，复制这个token。")]),s._v(" "),t("p",[s._v("进入travis后台，在环境变量（Environment Variables）里设置键值对，比如")]),s._v(" "),t("p",[s._v("access_token <把复制的token黏贴在这>")]),s._v(" "),t("p",[s._v("这样，travis就可以拥有访问github仓库的权限/token了，最后一步，修改deploy.sh。")]),s._v(" "),t("p",[s._v("把deploy.sh里的")]),s._v(" "),t("div",{staticClass:"language-text line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("改成")]),s._v(" "),t("div",{staticClass:"language-text line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("git push -f https://${access_token}@github.com/<USERNAME>/<USERNAME>.github.io.git master\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("就好了。")]),s._v(" "),t("p",[s._v("现在在试着push，观察"),t("a",{attrs:{href:"https://www.travis-ci.org",target:"_blank",rel:"noopener noreferrer"}},[s._v("travis服务器日志"),t("OutboundLink")],1),s._v("是否成功。")]),s._v(" "),t("h2",{attrs:{id:"参考文献"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#参考文献","aria-hidden":"true"}},[s._v("#")]),s._v(" 参考文献")]),s._v(" "),t("ol",[t("li",[t("p",[t("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("持续集成服务 Travis CI 教程"),t("OutboundLink")],1)])]),s._v(" "),t("li",[t("p",[t("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/36390666",target:"_blank",rel:"noopener noreferrer"}},[s._v("搭建持续集成、基于vuepress的Github Page"),t("OutboundLink")],1)])])])])},[],!1,null,null,null);e.default=n.exports}}]);