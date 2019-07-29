---
title: JS原型链与原型
date: 2019-03-25 20:58:31
tags: JS
categories: 
- JS
---

## JS原型链与原型

深入探究下 `Function.__proto__ === Function.prototype` 引起的问题并了解 Object.prototype、Function.prototype、function Object 、function Function 之间的关系。

## Object.prototype

我们先来看看 ECMAScript 上的定义。

Object.prototype 表示 Object 的原型对象，其 `[[Prototype]]` 属性是 null，访问器属性 `__proto__` 暴露了一个对象的内部 `[[Prototype]]` 。 Object.prototype 并不是通过 `Object` 函数创建的，为什么呢？看如下代码

```
function Foo() {
  this.value = 'foo';
}
let f = new Foo();
f.__proto__ === Foo.prototype;
// true
```

实例对象的 `__proto__` 指向构造函数的 `prototype`，即 `f.__proto__` 指向 Foo.prototype，但是 `Object.prototype.__proto__` 是 null，所以 Object.prototype 并不是通过 Object 函数创建的，那它如何生成的？其实 Object.prototype 是浏览器底层根据 ECMAScript 规范创造的一个对象。

Object.prototype 就是原型链的顶端（不考虑 null 的情况下），所有对象继承了它的 toString 等方法和属性。

[![img](https://camo.githubusercontent.com/6c61ed261d77e24048415a4d95cffaffa6999d3e/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6771383366626a3330616d3038676467682e6a7067)](https://camo.githubusercontent.com/6c61ed261d77e24048415a4d95cffaffa6999d3e/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6771383366626a3330616d3038676467682e6a7067)

## Function.prototype

我们先来看看 ECMAScript 上的定义。

Function.prototype 对象是一个函数（对象），其 `[[Prototype]]` 内部属性值指向内建对象 Object.prototype。Function.prototype 对象自身没有 `valueOf` 属性，其从 Object.prototype 对象继承了`valueOf` 属性。

[![img](https://camo.githubusercontent.com/17b00af87ff1cae6603cd18e3feb7acf76f5b8b7/68747470733a2f2f7773312e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6869396a6b7a6a33306179306a31676e342e6a7067)](https://camo.githubusercontent.com/17b00af87ff1cae6603cd18e3feb7acf76f5b8b7/68747470733a2f2f7773312e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6869396a6b7a6a33306179306a31676e342e6a7067)

Function.prototype 的 `[[Class]]` 属性是 `Function`，所以这是一个函数，但又不大一样。为什么这么说呢？因为我们知道只有函数才有 prototype 属性，但并不是所有函数都有这个属性，因为 Function.prototype 这个函数就没有。

```
Function.prototype
// ƒ () { [native code] }

Function.prototype.prototype
// undefined
```

当然你会发现下面这个函数也没有 prototype 属性。

```
let fun = Function.prototype.bind()
// ƒ () { [native code] }

fun.prototype
// undefined
```

为什么没有呢，我的理解是 `Function.prototype` 是引擎创建出来的函数，引擎认为不需要给这个函数对象添加 `prototype` 属性，不然 `Function.prototype.prototype…` 将无休无止并且没有存在的意义。

## function Object

我们先来看看 ECMAScript 上的定义。

Object 作为构造函数时，其 `[[Prototype]]` 内部属性值指向 Function.prototype，即

```
Object.__proto__ === Function.prototype
// true
```

[![img](https://camo.githubusercontent.com/3a340e35538937703b327a844abae1a094e863e9/68747470733a2f2f7773332e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796e676965656c376a33307634306b677465312e6a7067)](https://camo.githubusercontent.com/3a340e35538937703b327a844abae1a094e863e9/68747470733a2f2f7773332e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796e676965656c376a33307634306b677465312e6a7067)

使用 `new Object()` 创建新对象时，这个新对象的 `[[Prototype]]` 内部属性指向构造函数的 prototype 属性，对应上图就是 Object.prototype。

[![img](https://camo.githubusercontent.com/97c8fdbc61458fcfcab1f093c99b44596e930569/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796f31376c736d6e6a333073383065753431382e6a7067)](https://camo.githubusercontent.com/97c8fdbc61458fcfcab1f093c99b44596e930569/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796f31376c736d6e6a333073383065753431382e6a7067)

当然也可以通过对象字面量等方式创建对象。

- 使用对象字面量创建的对象，其 `[[Prototype]]` 值是 `Object.prototype`。
- 使用数组字面量创建的对象，其 `[[Prototype]]` 值是 `Array.prototype`。
- 使用 `function f(){}` 函数创建的对象，其 `[[Prototype]]` 值是 `Function.prototype`。
- 使用 `new fun()` 创建的对象，其中 fun 是由 JavaScript 提供的内建构造器函数之一(Object, Function, Array, Boolean, Date, Number, String 等等），其 `[[Prototype]]` 值是 fun.prototype。
- 使用其他 JavaScript 构造器函数创建的对象，其 `[[Prototype]]` 值就是该构造器函数的 prototype 属性。

```
let o = {a: 1};
// 原型链:	o ---> Object.prototype ---> null

let a = ["yo", "whadup", "?"];
// 原型链:	a ---> Array.prototype ---> Object.prototype ---> null

function f(){
  return 2;
}
// 原型链:	f ---> Function.prototype ---> Object.prototype ---> null

let fun = new Function();
// 原型链:	fun ---> Function.prototype ---> Object.prototype ---> null

function Foo() {}
let foo = new Foo();
// 原型链:	foo ---> Foo.prototype ---> Object.prototype ---> null

function Foo() {
  return {};
}
let foo = new Foo();
// 原型链:	foo ---> Object.prototype ---> null
```

## function Function

```
Function.__proto__ === Function.prototype
// true
```

[![img](https://camo.githubusercontent.com/9e41079772c1366b9770d5e982d192b1410198d7/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e633739677931673179723730396778396a33306f303038383431302e6a7067)](https://camo.githubusercontent.com/9e41079772c1366b9770d5e982d192b1410198d7/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e633739677931673179723730396778396a33306f303038383431302e6a7067)

到这里就有意思了，我们看下鸡生蛋蛋生鸡问题。

## Function & Object 问题

我们看下面这段代码

```
Object instanceof Function 		// true
Function instanceof Object 		// true

Object instanceof Object 			// true
Function instanceof Function 	// true
```

`Object` 构造函数继承了 `Function.prototype`，同时 `Function` 构造函数继承了`Object.prototype`。这里就产生了问题。因为 `Function.prototype` 和 `Function.__proto__` 都指向 `Function.prototype`。

```
// Object instanceof Function 	即
Object.__proto__ === Function.prototype 					// true

// Function instanceof Object 	即
Function.__proto__.__proto__ === Object.prototype	// true

// Object instanceof Object 		即 			
Object.__proto__.__proto__ === Object.prototype 	// true

// Function instanceof Function 即	
Function.__proto__ === Function.prototype					// true
```

对于 `Function.__proto__ === Function.prototype` 这一现象有 2 种解释，争论点在于 Function 对象是不是由 Function 构造函数创建的一个实例？

Function 是 `built-in` 的对象，也就是并不存在“Function对象由Function构造函数创建”这样显然会造成鸡生蛋蛋生鸡的问题。实际上，当你直接写一个函数时（如 `function f() {}` 或 `x => x`），也不存在调用 Function 构造器，只有在显式调用 Function 构造器时（如 `new Function('x', 'return x')` ）才有。

即先有 `Function.prototype` 然后有的 `function Function()` ，所以就不存在鸡生蛋蛋生鸡问题了，把 `Function.__proto__` 指向 `Function.prototype` 是为了保证原型链的完整，让 `Function` 可以获取定义在 `Object.prototype` 上的方法。

最后给一个完整的图，看懂这张图原型就没问题了。

[![jsobj](https://camo.githubusercontent.com/68f81e824468c6a2a897082c4de05706f4d8941d/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316732336e3436757a6a616a33306836306c703076372e6a7067)](https://camo.githubusercontent.com/68f81e824468c6a2a897082c4de05706f4d8941d/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316732336e3436757a6a616a33306836306c703076372e6a7067)