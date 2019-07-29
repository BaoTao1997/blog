---
title: Vue
date: 2019-04-07 16:54:29
---

### 1.Vue组件通信

```js
对于多组件之间的状态共享,我们需要通过state规定统一的数据仓库,
只能通过Action和Mutation实现数据的更改,然后实现多组件的数据同时改变

总结:props父传子,$emit自定义事件子传父:都是(vue命令)子组件内容 = 父组件内容
1.父组件向子组件传值
父组件中的 v-bind:'子组件props中的属性名称(若子组件props中的名称为myName,
由于HTML特性不区分大小写,所以这里采用my-name)'='父组件中的属性名称'
注意如果是静态字符串则可以不用v-bind,否则必须使用
2.子组件向父组件传值(自定义事件,回调函数)
----自定义事件-----
子组件通过事件'$emit('modify', this.modifylist);'传递消息给父组件,
再用v-on:'子组件事件名称'='父组件事件名称'
简化写法即为`v-model`(主要用于表单的双向绑定),实际上是
`<input type="text" v-model="name">`
相当于：`<input type="text" :value="name" @input="name = $event.target.value">`
----回调函数----
通过'v-bind:callback="callback"',用props将回调函数传给子组件,
然后在子组件中用v-on:click="callback"绑定该方法
3.兄弟组件传值(可以用一个父组件做中继,也可以用事件总线,介绍一下事件总线)
新建一个bus.js(事件总线EventBus)
import Vue from 'Vue'
const eventbus =new Vue()
export default eventbus;
并在兄弟组件中引入,然后:
组件1用eventBus.$emit('1to2', 'emmit')
组件2则用eventBus.$on('1to2', (message) => {this.fromBrother = message}) 保证事件名称相同
4.更深层次的注入provide/inject
在组件中使用provide:
provide: function () {
  return {
    getMap: this.getMap
  }
}
其所有的子组件及后代可以通过inject来进行获取getMap方法:
inject: ['getMap']
```

