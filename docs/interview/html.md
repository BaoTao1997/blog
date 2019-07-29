---
title: Html
date: 2019-04-07 16:54:29
---

### 1.脚本延迟执行

HTML 4.01为`<script>`标签定义了defer属性。这个属性的用途是表明脚本在执行时不会能响页面的构造。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。因此，在`<script>`元素中设置defer属性，**相当于告诉浏览器立即下载，但延迟执行**。

HTML5为`<script>`元素定义了async属性。这个属性与defer属性类似，都用于改变脚本的行为，并告诉浏览器立即下载文件。但与defer不同的是，标记为async的脚本并不保证按照指定它们的先后顺序执行。

**延迟脚本放在页面底部仍然是最佳选择**。
