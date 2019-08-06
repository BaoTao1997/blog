---
title: Vue
date: 2019-04-07 16:54:29
---

### 1.Vue的双向绑定原理

vue的双向绑定是由数据劫持结合发布者－订阅者模式实现的，通过Object.defineProperty()[*对象，对象上的属性，描述符*]来劫持对象属性的setter和getter操作实现数据驱动视图。具体参考[MVVM](http://localhost:8080/blog/framework-mvvm.html#%E5%8A%A8%E6%89%8B%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84mvvm)

### 2.Vue组件通信

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

### 3.Vue的生命周期

##### **1. 在beforeCreate生命周期**

生成$options选项，并给实例添加生命周期相关属性。在实例初始化之后，在 **数据观测(data observer) 和event/watcher 事件配置**之前被调用，也就是说，data，watcher，methods都不存在这个阶段。但是有一个对象存在，那就是$route，因此此阶段就可以根据路由信息进行重定向等操作。

##### **2. created生命周期**

初始化与依赖注入相关的操作，会遍历传入methods的选项，初始化选项数据，从$options获取数据选项(vm.$options.data)，给数据添加‘观察器’对象并创建观察器，定义getter、setter存储器属性。在实例创建之后被调用，该阶段可以访问data，使用watcher、events、methods，也就是说 **数据观测(data observer) 和event/watcher 事件配置** 已完成。

首先会判断对象是否有**el选项**。如果有的话就继续向下编译，如果没有**el选项**，则停止编译，也就意味着停止了生命周期，直到在该vue实例上调用vm.$mount(el)。

然后，我们往下看，**template**参数选项的有无对生命周期的影响。
（1）如果vue实例对象中有template参数选项，则将其**作为模板编译成render函数**。
（2）如果没有template选项，则将外部HTML作为模板编译。
（3）可以看到template中的模板优先级要高于outer HTML的优先级。

在vue对象中还有一个**render函数**，它是以createElement作为参数，然后做渲染操作，而且我们可以直接嵌入JSX.优先级为render函数选项 > template选项 > outer HTML.

**一般在这个周期钩子修改data属性或者进行Ajax请求。**

>针对ajax异步请求，这样的错误原因其实就是因为返回结果没赶上dom节点的渲染。所以可以从两方面做修改：一是返回结果的赋值变量上，另一个就是dom节点的渲染层面。
>
>1. 给予赋值变量初始值，即定义时menu_items：[ {fullname: ''} ]。
>
>这么做的好处就是页面节点的渲染不受限于返回结果，静态文案照样会被渲染，动态数据则会在数据更新时被填充。给用户的感觉就是，页面渲染速度不错。
>
>2. v-if，控制dom节点的挂载，当且仅当menu_items被赋予返回值时，才开始渲染节点。
>
>这么做的好处就是静态和动态文案同步展现在用户面前，不会有文案跳动，数据从无到有的过程。但是，副作用就是页面渲染时间、用户等待时间变长。

##### **3. beforeMount生命周期**

可以看到此时是给vue实例对象添加**$el成员**，并且替换掉挂在的DOM元素。因为在之前console中打印的结果可以看到**beforeMount**之前el上还是undefined。

#### **4. mounted**

在挂载完成之后被调用，执行render函数生成虚拟dom，创建真实dom替换虚拟dom，并挂载到实例。**在此时可以操作DOM节点。**

##### **5. beforeUpdate钩子函数和updated钩子函数间的生命周期**

当vue发现data中的数据发生了改变，会**触发对应组件的重新渲染**，先后调用**beforeUpdate**和**updated**钩子函数。

##### **6.beforeDestroy和destroyed钩子函数间的生命周期**

**beforeDestroy**钩子函数在实例销毁之前调用。在这一步，实例仍然完全可用。
**destroyed**钩子函数在Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

### 4.Vue和React的区别

相同点：

1. 虚拟 DOM
2. 组件化
3. 保持对视图的关注
4. 数据驱动视图
5. 都有支持 native 的方案

不同点：

1. state 状态管理 vs 对象属性 get，set。
2. vue 实现了数据的双向绑定 v-model，而组件之间的 props 传递是单向的，react 数据流动是单向的。

#### 运行时优化

在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树，开发者不得不手动使用 shouldComponentUpdate 去优化性能。

在 Vue 组件的依赖是在渲染过程中自动追踪的，开发者不再需要考虑此类优化。另外 Vue 还做了很多其他方面的优化，例如：标记静态节点，优化静态循环等。

> 总结：Vue 在运行时帮我们做了很多优化了处理，开发者可以直接上手，React 则是由开发者自己去处理优化，让程序有更多的定制化。

#### JSX vs Templates

JSX 中你可以使用完整的编程语言 JavaScript 功能来构建你的视图页面。比如你可以使用临时变量、JS 自带的流程控制、以及直接引用当前 JS 作用域中的值等等。

Templates 对于很多习惯了 HTML 的开发者来说，模板比起 JSX 读写起来更自然。基于 HTML 的模板使得将已有的应用逐步迁移到 Vue 更为容易。你甚至可以使用其他模板预处理器，比如 Pug 来书写 Vue 的模板。

> 总结：Vue 在模板上实现定制化，可以使用类 HTML 模板，以及可以使用 JSX，React 则是推荐 JSX。

### 5.Vue项目性能优化

#### 路由懒加载

将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身),使用动态 import语法来定义代码分块点 (split point):

```js
const Foo = () => import('./Foo.vue')
```

#### 代码优化

- v-if 和 v-show选择调用
- 细分vuejs组件，组件按需加载
- 减少watch的数据
- 利用`vue-lazy`实现图片懒加载
- SSR
- webpack配置：js打包多个文件，压缩图片（`npm run build --report`查看打包体积问题）

#### 用户体验

- loading图
- 骨架屏
- 点击延迟

### 6.Vuex解决了什么问题

```
1.多个组件共享状态时，单向数据流的简洁性很容易被破坏：
2.多个视图依赖于同一状态。
3.来自不同视图的行为需要变更同一状态。
Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）
通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到state
主要有这五个模块：
getter mutation action state module
```

### Tips：Vue使用技巧

