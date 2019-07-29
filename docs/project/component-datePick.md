---
title: 日历
date: 2019-04-07 16:54:29

---

## Vue版本的日历

本文主要还是熟悉Date的API，以及Vue的基础用法。目前实现效果如下：

![效果图](../.vuepress/public/project/component-datePick/1.gif)

### 准备

- 如何实现点击年月日的切换，以及日历的展示
- 应该传入哪些参数？提供哪些参数？

### 日历展示

其实很简单，只需要提供本月的第一天，并判断是周几，然后获取到列表第一天的时间戳，使用**计算属性**来返回当月42天的时间戳数组，用`v-for`两次列表渲染即可获得对应的值：

```js
// 本月第一天
let currentFristDay = utils.getDate(this.time.year, this.time.month, 1);
// 本月第一天是周几
let week = currentFristDay.getDay();
// 获取列表第一天的时间戳
let startDay = currentFristDay - week * 60 * 60 * 1000 * 24;
var arr = [];
// 循环42天
for (let i = 0; i < 42; i++) {
    arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24));
}
return arr;
```

同时绑定对应的类名，添加不同的样式：

```js
:class="[
     {notCurrentMonth: !isCurrentMonth(visibleDays[(i-1)*7+(j-1)])},
     {today: isToday(visibleDays[(i-1)*7+(j-1)])},
     {select: isSelect(visibleDays[(i-1)*7+(j-1)])}]"
```

### 年份与月份切换

只需要获取当前的年份或者月份，利用`setMonth`和`setFullYear`这两个方法就可以做到年月份切换，不需要对年份以及每个月做相应的判断，很简单。

#### 重点：实现点击其余区域则隐藏

使用[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)实现，并利用`vnode.context`获取对应的DOM，比ref会优雅些,注意在选择年份和月份使用`v-show`而不是`v-if`，否则会导致`el.contains(e.target)`为false，弹出框隐藏。

```js
  directives: {
    clickOutside: {
      // 指令的声明周期
      bind(el, bindings, vnode) {
        // 把事件绑定到document上,判断点击的是否是这个元素
        let handler = e => {
          if (el.contains(e.target)) {
            if (!vnode.context.isVisible) {
              vnode.context.focus();
            }
          } else {
            if (vnode.context.isVisible) {
              vnode.context.blur();
            }
          }
        };
        el.handler = handler;
        document.addEventListener("click", handler);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler);
        delete el.handler;
      }
    }
  },
```

### 总结

1. Vue的基本操作
2. 熟悉Date的API

### 优化

- [ ] 暴露更多的接口，具体参照ElementUI
- [ ] 提供更细致的时间