## 动手实现一个简单的MVVM

如今出现了许多前端框架，其中最核心的在于其**响应式原理**，前端框架最核心的就是解决了[UI和状态同步的问题](https://segmentfault.com/a/1190000014947677)，对此手动实现一个简单的MVVM。

首先写一个简单的Vue组件，有一些Vue的基础指令：

```html
<div id="app">
  <input type="text" v-model="school.name">
  <div>{{ school.name }}</div>
  <div>{{ school.age }}</div>
  <!-- 如果数据不变化,视图不刷新 -->
  <div>{{ getNewName }}</div>
  <button v-on:click="change">点击</button>
  <div v-html="message"></div>
</div>
<script src="./MVVM.js"></script>
<script type="text/javascript">
  let vm = new Vue({
    el: '#app',
    data: {
      school: {
        name: 'HUST',
        age: '65'
      },
      message: `<h1>text</h1>`
    },
    computed: {
      getNewName() {
        return this.school.name + ' school'
      }
    },
    methods: {
      change() {
        this.school.name = 'baotao';
      }
    }
  })
</script>
```

### 响应式系统原理

我们需要做的是创建`Vue`的实例时，利用`Observe`监听数据，然后`Compile`的时候给每个指令添加对应的`Watcher`，利用`Dep`实现订阅发布：

```js
class Vue {
  constructor(options) {
    this.$data = options.data;
    this.$el = options.el;
    let computed = options.computed;
    let methods = options.methods;

    for (let key in methods) {
      Object.defineProperty(this, key, {
        get() {
          return methods[key];
        }
      });
    }

    for (let key in computed) {
      Object.defineProperty(this.$data, key, {
        get: () => {
		  // 返回函数执行后的值
          return computed[key].call(this);
        }
      });
    }

    // 数据劫持
    new Observer(this.$data);
	// 用this代理this.$data
    this.proxyvm(this.$data);
	// 编译对应指令
    new Compiler(this.$el, this);
  }
  proxyvm(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        }
      });
    }
  }
}
```

![img](https://user-gold-cdn.xitu.io/2018/6/6/163d41869ea10f6d?imageslim)

### Observe

```js
class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    if (typeof data !== "object") {
      return new Error("the data need a object!");
    } else {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }
  defineReactive(data, key, value) {
    // 递归遍历每一个属性
    this.observe(value);
    let dep = new Dep();
    Object.defineProperty(data, key, {
      get() {
        // 依赖收集
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          // 监听新的值的变化
          this.observe(newVal)
          // 把新的值赋给vm的data
          value = newVal
          // 派发更新
          dep.notify();
        }
      }
    });
  }
}
```

`Observe`实现了对data所有属性的劫持，最重要的还是如何把`Watcher`和`Observe`关联起来，将每个属性对应的`Watcher`添加到`Dep`

### Watcher

```js
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.oldValue = this.get();
  }
  get() {
    Dep.target = this;
    let value = CompileUtil.getVal(this.vm, this.expr);
    Dep.target = null;
    return value;
  }
  update() {
	// 通过实例和表达式获取值
    let newValue = CompileUtil.getVal(this.vm, this.expr);
    if (newValue !== this.oldValue) {
	// 将数据反应到视图上
      this.cb(newValue);
    }
  }
}
```
做法就是new一个`Watcher`的实例时，需要使用get方法获取之前的Value，若新的value和之前不一样则会触发update方法:

- 由于我们劫持了所有属性，所以会触发` Object.defineProperty`的get方法，

- 我们通过Dep类上加一个target属性,新建`Watcher`时，把`Watcher`实例赋值到target属性上(`Dep.target = this;`)
- `CompileUtil.getVal(this.vm, this.expr);`则通过传入的实例和表达式获取值，触发get方法
- `Dep.target && dep.addSub(Dep.target);`，而get方法中则会判断`Dep.target`是否存在，存在则推入`Dep`订阅中心，实现**依赖收集**

### Dep

```js
class Dep {
  constructor() {
    this.sub = [];
  }
  addSub(watcher) {
    this.sub.push(watcher);
  }
  notify() {
    this.sub.forEach(watcher => watcher.update());
  }
}
```

最后[源代码](./asset/MVVM.js),至此`observer、Dep、Watch`三者就形成了一个整体，分工明确。直接对被劫持过的对象添加新的属性是监测不到的，修改数组的元素值也是如此。这里就顺便提一下`Vue`源码中是如何解决这个问题的：

> 对于对象：`Vue`中提供了`Vue.set`和`vm.$set`这两个方法供我们添加新的属性，其原理就是先判断该属性是否为响应式的，如果不是，则通过`defineReactive`方法将其转为响应式。

> 对于数组：直接使用下标修改值还是无效的，`Vue`只`hack`了数组中的八个方法：`'push','pop','shift','unshift','splice','sort','reverse'`，使得我们用起来依旧是响应式的。其原理是：在我们调用数组的这八个方法时，`Vue`会改造这些方法，它内部同样也会执行这些方法原有的逻辑，只是增加了一些逻辑：取到所增加的值，然后将其变成响应式，然后再手动出发`dep.notify()`

## Proxy实现的响应系统

`Proxy`是在目标前架设一层`"拦截"`，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写，我们可以这样认为，`Proxy`是`Object.defineProperty`的全方位加强版。

依旧是三大件：`Observer、Dep、Watch`，我们在之前的基础再完善这三大件。

###  Dep

```js
let uid = 0 // 新增：定义一个id
class Dep {
  constructor () {
    this.id = uid++ // 新增：给dep添加id，避免Watch重复订阅
    this.subs = []
  }
  depend() {  // 新增：源码中在触发get时是先触发depend方法再进行依赖收集的，这样能将dep传给Watch
    Dep.target.addDep(this);
  }
  addSub () {
    this.subs.push(Dep.target)
  }
  notify () {
    for (let i = 1; i < this.subs.length; i++) {
      this.subs[i].cb()
    }
  }
}
```

### Watcher

```js
class Watch {
  constructor (exp, cb) {
    this.depIds = {} // 新增：储存订阅者的id，避免重复订阅
    this.exp = exp
    this.cb = cb
    data[exp]
    Dep.target = this
    // 新增：判断是否订阅过该dep，没有则存储该id并调用dep.addSub收集当前watcher
    addDep (dep) {  
      if (!this.depIds.hasOwnProperty(dep.id)) {
        dep.addSub(this)
        this.depIds[dep.id] = dep
      }
    }
    // 新增：将订阅者放入待更新队列等待批量更新
    update () {
      pushQueue(this)
    }
    // 新增：触发真正的更新操作
    run () {
      this.cb()
    }
  }
}
```

### Observer

与`Object.defineProperty`监听属性不同，`Proxy`可以监听(实际是代理)整个对象，因此就不需要遍历对象的属性依次监听了，但是如果对象的属性依然是个对象，那么`Proxy`也无法监听，所以依旧使用递归套路即可。

```js
function Observer (data) {
  let dep = new Dep()
  return new Proxy(data, {
    get () {
      // 如果订阅者存在，进去depend方法
      if (Dep.target) {
        dep.depend()
      }
      // Reflect.get
      return Reflect.get(data, key)
    },
    set (data, key, newVal) {
      // 如果值未变，则直接返回，不触发后续操作
      if (Reflect.get(data, key) === newVal) {
        return
      } else {
        // 设置新值的同时对新值判断是否要递归监听
        Reflect.set(target, key, observer(newVal))
        // 当值被触发更改的时候，触发Dep的通知方法
        dep.notify(key)
      }
    }
  })
}

// 递归监听
function observer (data) {
  // 如果不是对象则直接返回
  if (Object.prototype.toString.call(data) === '[object, Object]') {
    return data
  }
  // 为对象时则递归判断属性值
  Object.keys(data).forEach(key => {
    data[key] = observer(data[key])
  })
  return Observer(data)
}

// 监听obj
Observer(data)
```

至此就基本完成了三大件了，同时其不需要`hack`也能对数组进行监听。

### 批量异步更新

> `Vue`在更新`DOM`时是异步执行的。只要侦听到数据变化，`Vue`将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个`watcher`被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和`DOM`操作是非常重要的。然后，在下一个的事件循环`“tick”`中，`Vue`刷新队列并执行实际 (已去重的) 工作。`Vue`在内部对异步队列尝试使用原生的`Promise.then、MutationObserver`和`setImmediate`，如果执行环境不支持，则会采用`setTimeout(fn, 0)`代替。

根据以上这段官方文档，这个队列主要是`异步`和`去重`，首先我们来整理一下思路：

1. 需要有一个队列来存储一个事件循环中的数据变更，且要对它去重。
2. 将当前事件循环中的数据变更添加到队列。
3. 异步的去执行这个队列中的所有数据变更。

```js
// 使用Set数据结构创建一个队列，这样可自动去重
let queue = new Set()

// 在属性出发set方法时会触发watcher.update，继而执行以下方法
function pushQueue (watcher) {
  // 将数据变更添加到队列
  queue.add(watcher)
  // 下一个tick执行该数据变更,所以nextTick接受的应该是一个能执行queue队列的函数
  nextTick('一个能遍历执行queue的函数')
}

// 用Promise模拟nextTick
function nextTick('一个能遍历执行queue的函数') {
  Promise.resolve().then('一个能遍历执行queue的函数')
}
```

以上已经有个大体的思路了，那接下来完成`'一个能遍历执行queue的函数'`：

```js
// queue是一个数组，所以直接遍历执行即可
function flushQueue () {
  queue.forEach(watcher => {
    // 触发watcher中的run方法进行真正的更新操作
    watcher.run()
  })
  // 执行后清空队列
  queue = new Set()
}
```

还有一个问题，那就是同一个事件循环中应该只要触发一次`nextTick`即可，而不是每次添加队列时都触发：

```js
// 设置一个是否触发了nextTick的标识
let waiting = false
function pushQueue (watcher) {
  queue.add(watcher)
  if (!waiting) {
    // 保证nextTick只触发一次
    waiting = true
    nextTick('一个能遍历执行queue的函数')
  }
}
```

完整代码如下：

```js
// 定义队列
let queue = new Set()

// 供传入nextTick中的执行队列的函数
function flushQueue () {
  queue.forEach(watcher => {
    watcher.run()
  })
  queue = new Set()
}

// nextTick
function nextTick(flushQueue) {
  Promise.resolve().then(flushQueue)
}

// 添加到队列并调用nextTick
let waiting = false
function pushQueue (watcher) {
  queue.add(watcher)
  if (!waiting) {
    waiting = true
    nextTick(flushQueue)
  }
}
```

### 总结

Proxy的优势有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是`Object.defineProperty`不具备的。

Proxy返回的是一个新对象,我们可以只操作新的对象达到目的,而`Object.defineProperty`只能遍历对象属性直接修改。

首先需要监听 Data, 我们用 Proxy 来监听了 Data 对象,因此在 Data 对象被修改的时候通过Observer 就可以得知。

我们得知Data发生变化后如何通知 View 呢？要知道，一个Data 的改变可能触发多个 UI 的更新，比如一个用户的用户名改变了，它的个人信息组件、通知组件等等组件中的用户名都需要改变，对于这种情况我们很容易想到利用**发布订阅**模式来解决,我们需要一个订阅器(Dep)来储存订阅者(Watcher),当监听到 Data 改变时,我们只需要通知相关的订阅者进行更新即可。

那么订阅者来自哪里呢？其实每一个组件实例对应着一个订阅者（正因为一个组件实例对应一个订阅者，才能利用 Dep 通知到相应组件，不然乱套了，通知订阅者就相当于间接通知了组件）。

当订阅者得知了具体变化后它会进行相应的更新,将更新体现在 UI(View)上,至此UI 与 Data 的同步完成了。

## 参考文章

1. [面试官系列(5): 你为什么使用前端框架](https://juejin.im/post/5b16c0415188257d42153bac#heading-7)

2. [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)

3. [现代 js 框架存在的根本原因](https://segmentfault.com/a/1190000014947677)