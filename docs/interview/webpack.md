---
title: webpack
date: 2019-04-07 16:54:29
---

### 1.webpack4中的filename保证文件唯一

```javascript
module.exports = {
  // 通过配置hash值保证文件的唯一性
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```

