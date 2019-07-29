---
title: 手写符合Promise/A+的Promise
date: 2019-07-14 20:58:31
---

## 手写一个Promise

### Promise产生的原因

借助大佬的博客[Promise](https://github.com/mqyqingfeng/Blog/issues/98)，嵌套逻辑导致代码难以复用，因为需要借助外层变量，修改逻辑时需要对外层变量也进行修改。

### 1.基本的Promise

 [Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)对Promise有规定：

- Promise存在三个状态（state）pending、fulfilled、rejected
- pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
- 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
- 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
- `new Promise((resolve, reject)=>{resolve(value)})` resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
- `new Promise((resolve, reject)=>{reject(reason)})` reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
- 若是executor函数报错 直接执行reject();

 [Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)规定:Promise有一个叫做then的方法，里面有两个参数：onFulfilled,onRejected,成功有成功的值，失败有失败的原因

- 当状态state为fulfilled，则执行onFulfilled，传入this.value。当状态state为rejected，则执行onRejected，传入this.reason
- onFulfilled,onRejected如果他们是函数，则必须分别在fulfilled，rejected后被调用，value或reason依次作为他们的第一个参数

```js
let p = new promise((resolve, reject)=>{resolve('0')})
p.then(function(res) {
    console.log(res)
})
```

所以我们采用状态机保证其状态写出如下代码：

```js
class promise {
	constructor(excutor) {
		this.state = 'pending';
		this.result = undefined;
		this.reason = undefined;

		let resolve = result => {
			if(this.state === 'pending') {
				this.result = result;
				this.state = 'fulfilled'
			}
		}

		let reject = result => {
			if(this.state === 'pending') {
				this.reason = result;
				this.state = 'rejected'
			}
		}

		try {
			excutor(resolve, reject)
		} catch {
			reject()
		}

	}

	then(onFulfilled,onRejected) {
		if(this.state === 'fulfilled') {
			onFulfilled(this.result)
		}
		if(this.state === 'rejected') {
			onRejected(this.reason)
		}
	}

}
```

### 2.异步执行

但是要是在构造函数中传入异步代码则会出现问题，如下所示：

```js
// 异步操作
let p = new promise(function (resolve, reject) {
    //做一些异步操作
    setTimeout(function () {
        console.log('执行完成');
        resolve('随便什么数据');
    }, 2000);
});
p.then(function (res) {
    console.log(res)
})
p.then(function (res) {
    console.log(res)
})
// 利用上面的代码则会返回'执行完成'，其余没有
// 实际应该有'执行完成'和'随便什么数据'两条输出
```

所以我们创建两个栈，在执行then方法时，把要执行的函数存放到栈中，当异步代码开始执行时把栈中的执行函数进行遍历即可。

```js
class promise {
	constructor(excutor) {
		this.state = 'pending';
		this.result = undefined;
		this.reason = undefined;
		this.resolveStack = [];
		this.rejectStack = [];

		let resolve = result => {
			if(this.state === 'pending') {
				this.result = result;
				this.resolveStack.forEach(fn => fn());
				this.state = 'fulfilled';
			}
		}

		let reject = result => {
			if(this.state === 'pending') {
				this.reason = result;
				this.rejectStack.forEach(fn => fn());
				this.state = 'rejected';
			}
		}

		try {
			excutor(resolve, reject)
		} catch(err) {
			reject(err)
		}

	}

	then(onFulfilled,onRejected) {
		if(this.state === 'fulfilled') {
			onFulfilled(this.result)
		}
		if(this.state === 'rejected') {
			onRejected(this.reason)
		}
		if(this.state === 'pending') {
			this.resolveStack.push(() => {
				onFulfilled(this.result);
			})
			this.rejectStack.forEach(() => {
				onRejected(this.reason);
			})
		}
	}

}
```

### 3.链式调用

**我们常常用到new Promise().then().then(),这就是链式调用，用来解决回调地狱**

1、为了达成链式，我们默认在第一个then里返回一个promise。[Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)规定了一种方法，就是在then里面返回一个新的promise,称为promise2：`promise2 = new Promise((resolve, reject)=>{})`

- 将这个promise2返回的值传递到下一个then中
- 如果返回一个普通的值，则将普通的值传递给下一个then中

2、当我们在第一个then中`return`了一个参数（参数未知，需判断）。这个return出来的新的promise就是onFulfilled()或onRejected()的值

[Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)则规定onFulfilled()或onRejected()的值，即第一个then返回的值，叫做x，判断x的函数叫做resolvePromise

- 首先，要看x是不是promise。
- 如果是promise，则取它的结果，作为新的promise2成功的结果
- 如果是普通值，直接作为promise2成功的结果
- 所以要比较x和promise2
- resolvePromise的参数有promise2（默认返回的promise）、x（我们自己`return`的对象）、resolve、reject
- resolve和reject是promise2的

```js
class promise {
	constructor(excutor) {
		this.state = 'pending';
		this.result = undefined;
		this.reason = undefined;
		this.resolveStack = [];
		this.rejectStack = [];

		let resolve = result => {
			if(this.state === 'pending') {
				this.result = result;
				this.resolveStack.forEach(fn => fn());
				this.state = 'fulfilled';
			}
		}

		let reject = result => {
			if(this.state === 'pending') {
				this.reason = result;
				this.rejectStack.forEach(fn => fn());
				this.state = 'rejected';
			}
		}

		try {
			excutor(resolve, reject)
		} catch(err) {
			reject(err)
		}

	}

	then(onFulfilled,onRejected) {

		let promise2 = new promise((resolve,reject) => {
			if(this.state === 'fulfilled') {
				let x = onFulfilled(this.result);
				resolvePromise(promise2, x, resolve, reject);
			}
			if(this.state === 'rejected') {
				let x = onRejected(this.reason);
				resolvePromise(promise2, x, resolve, reject);
			}
			if(this.state === 'pending') {
				this.resolveStack.push(() => {
					let x = onFulfilled(this.result);
					resolvePromise(promise2, x, resolve, reject);
				})
				this.rejectStack.forEach(() => {
					let x = onRejected(this.reason);
					resolvePromise(promise2, x, resolve, reject);
				})
			}
		})

		return promise2
	}

}
```

#### 重点：resolvePromise

1、判断x

- x 不能是null
- x 是普通值 直接resolve(x)
- x 是对象或者函数（包括promise），`let then = x.then` 2、当x是对象或者函数（默认promise）
- 声明了then
- 如果取then报错，则走reject()
- 如果then是个函数，则用call执行then，第一个参数是this，后面是成功的回调和失败的回调
- 如果成功的回调还是pormise，就递归继续解析 3、成功和失败只能调用一个 所以设定一个called来防止多次调用

```js
function resolvePromise(promise2, x, resolve, reject) {
	if(x === promise2) {
		return reject(new TypeError('禁止循环引用'));
	}
	let called;
	if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
		try {
			let then = x.then;
			if(typeof then === 'function') {
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, err => {
                    if(called)return;
                    called = true;
                    reject(err);
                })
			} else {
				resolve(x)
			}
		} catch(err) {
			if(called)return;
            called = true;
            reject(err); 
		}
	} else {
		resolve(x);
	}
}
```

### 4.完善Promise

[Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)规定onFulfilled,onRejected都是可选参数，如果他们不是函数，必须被忽略

- onFulfilled返回一个普通的值，成功时直接等于 `value => value`
- onRejected返回一个普通的值，失败时如果直接等于 value => value，则会跑到下一个then中的onFulfilled中，所以直接扔出一个错误`reason => throw err` 
- [Promise/A+](https://link.juejin.im?target=https%3A%2F%2Fpromisesaplus.com)规定onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
- 如果onFulfilled或onRejected报错，则直接返回reject()

> 即使 promise 对象立刻进入 resolved 状态，即同步调用 resolve 函数，then 函数中指定的方法依然是异步进行的。
>
> 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。

```js
class promise {
	constructor(excutor) {
		this.state = 'pending';
		this.result = undefined;
		this.reason = undefined;
		this.resolveStack = [];
		this.rejectStack = [];

		let resolve = result => {
			if(this.state === 'pending') {
				this.result = result;
				this.resolveStack.forEach(fn => fn());
				this.state = 'fulfilled';
			}
		}

		let reject = result => {
			if(this.state === 'pending') {
				this.reason = result;
				this.rejectStack.forEach(fn => fn());
				this.state = 'rejected';
			}
		}

		try {
			excutor(resolve, reject)
		} catch(err) {
			reject(err)
		}

	}

	then(onFulfilled,onRejected) {
		// onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
		// onRejected如果不是函数，就忽略onRejected，直接扔出错误
		onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

		let promise2 = new promise((resolve,reject) => {
			if(this.state === 'fulfilled') {
  				// 保证是异步，若执行有错误则进行报错
				setTimeout(() => {
					try {
						let x = onFulfilled(this.result);
						resolvePromise(promise2, x, resolve, reject);
					} catch(err) {
						reject(err)
					}
				}, 0);
			}
			if(this.state === 'rejected') {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason);
						resolvePromise(promise2, x, resolve, reject);
					} catch(err) {
						reject(err);
					}
				}, 0);
			}
			if(this.state === 'pending') {
				this.resolveStack.push(() => {
					setTimeout(() => {
						try {
							let x = onFulfilled(this.result);
							resolvePromise(promise2, x, resolve, reject);
						} catch(err) {
							reject(err);
						}
					}, 0);
				})
				this.rejectStack.forEach(() => {
					setTimeout(() => {
						try {
							let x = onRejected(this.reason);
							resolvePromise(promise2, x, resolve, reject);
						} catch(err) {
							reject(err);
						}
					}, 0);
				})
			}
		})

		return promise2
	}

}
```

### 5.其余方法实现

catch和resolve、reject、race、all方法

```js
//resolve方法
promise.resolve = function(val){
  return new Promise((resolve,reject)=>{
    resolve(val)
  });
}
//reject方法
promise.reject = function(val){
  return new Promise((resolve,reject)=>{
    reject(val)
  });
}
//race方法 谁先成功则返回谁
promise.race = function(promises){
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(resolve,reject)
    };
  })
}
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回，失败则直接返回第一个失败的值)
promise.all = function(promises) {
	let arr = [];
	function processData(index, data) {
		arr[index] = data;
		if(index === promises.length - 1) {
			resolve(arr);
		}
	}
	return new promise((resolve,reject) => {
		for (let index = 0; index < promises.length; index++) {
			promises[index].then(data => {
				processData(index,data);
			},reject);
		}
	})
}
```

### 总结

手动实现了一个Promise，实现其链式调用，状态变更不可变，以及其余方法的实现。最后还总结下Promise的使用问题：

1. 调用`resolve`或`reject`并不会终结 Promise 的参数函数的执行。

```javascript
new Promise((resolve, reject) => {
  resolve(1); // 加上return保证后面内容不再执行
  console.log(2);
}).then(r => {
  console.log(r);
});
```

2. 不要在`then`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。可以捕获前面`then`方法执行中的错误
3. 需要依靠多个Promise的返回值，必须使用`Promise.all()`

### 参考文献

1. [手写Promise教程](https://juejin.im/post/5b2f02cd5188252b937548ab)
2. [Promise/A+规范](<https://promisesaplus.com/>)

