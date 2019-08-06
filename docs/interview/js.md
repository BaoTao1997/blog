---
title: js
date: 2019-04-07 16:54:29
---

## JS常见面试题总结

### 1.包装类对象

```javascript
var s = '123'
s.age = 27
console.log(s.age) => undefined
```

var a="abc"; 这个时候我们用a.会点出很多方法出来，这些方法根本就不是值类型的，其实这些都是包装类的，当我们点一个方法出来执行的时候，是在运行的时候立马把这个a放在一个包装类的对象里面，调用的是包装类对象的方法。当我们为这个a变量添加一个属性的时候，是加到包装类中的，当我们再次访问这个属性的时候就点不出来，因为当你点的时候又会创建一个新的包装类，这个包装类根本不存在这个属性。

### 2.js转义编码

```javascript
escape():除了 ASCII 字母、数字和特定的符号外，对传进来的字符串全部进行转义编码

document.write(escape("Visit W3School!") + "<br />")
document.write(escape("?!=()#%&"))

Visit%20W3School%21
%3F%21%3D%28%29%23%25%26

encodeURI():对整个URL进行编码，而URL的特定标识符不会被转码。

document.write(encodeURI("http://www.w3school.com.cn")+ "<br />")
document.write(encodeURI("http://www.w3school.com.cn/My first/")+ "<br />")
document.write(encodeURI(",/?:@&=+$#"))

http://www.w3school.com.cn
http://www.w3school.com.cn/My%20first/
,/?:@&=+$#

encodeURIComponent():用于对URL的组成部分进行个别编码，而不用于对整个URL进行编码。
因此，",/?:@&=+$#"，这些在encodeURI()中不被编码的符号，
在encodeURIComponent()中统统会被编码

document.write(encodeURIComponent("http://www.w3school.com.cn"))
document.write(encodeURIComponent("http://www.w3school.com.cn/p 1/"))
document.write(encodeURIComponent(",/?:@&=+$#"))

http%3A%2F%2Fwww.w3school.com.cn
http%3A%2F%2Fwww.w3school.com.cn%2Fp%201%2F
%2C%2F%3F%3A%40%26%3D%2B%24%23

应用:
1.传递带&符号的网址需要使用encodeURIComponent，这样组合的url才不会被#等特殊字符截断。
<script language="javascript">
    document.write('<a href="http://passport.baidu.com/?logout&aid=7&u='+
                   encodeURIComponent("http://cang.baidu.com/bruce42")+'">
                   退出</a&gt;');</script>
2.进行url跳转时可以整体使用encodeURI
Location.href=encodeURI("http://cang.baidu.com/do/s?word=百度&ct=21");
3.escape用于搜索历史纪录
```

### 3. 手写apply,call,bind和new

call:

```js
Function.prototype.mycall = function(context) {
    if(context===null) context = window;
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');
    delete context.fn;
    return result;
}
```

apply:

```js
Function.prototype.myapply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

bind:

```js
Function.prototype.mybind = function(context) {
    var args = Array.prototype.slice.call(arguments,1)
    var self = this
    return function() {
        var newargs = Array.prototype.slice.call(arguments)
        self.apply(context, args.concat(newargs))
    }
}
// 更改原型
Function.prototype.mybind = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

new：

```js
function objectFactory() {
    var obj = new Object()
    // 构造函数
	var self = [].shift.call(arguments)
    obj.__proto__ = self.prototype
    var ret = self.apply(obj,arguments)
    return typeof ret === 'object' ? ret : obj
};
```

### 4.手写数组去重，拍平，查找指定元素，乱序

数组去重：for循环，fliter，map，set，{}

```js
function unique2(array) {
    // res用来存储结果
    var res = [];

    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        var current = array[i]
        if (res.indexOf(current) === -1) {
            res.push(current)
        }
    }

    return res;
}
function unique5(array) {
    // 未排序
    // var res = array.filter(function(item, index, array) {
    // 	return array.indexOf(item) === index
    // })
    // return res
    // 排序
    return array.concat().sort().filter(function(item, index, array) {
        return !index || item !== array[index - 1]
    })
}
// 使用Map这类数据结构
function unique9(array) {
    const seen = new Map()
    return array.filter((a) => !seen.has(a) && seen.set(a, 1))
}
// 利用Set保证数组中数据是唯一的
var unique8 = (a) => [...new Set(a)]

// 利用Object键值对来去重
var array6 = [1, 2, 1, 1, '1',{value: 1}, {value: 1}, {value: 2}];

function unique6(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        // obj[item] = true给对象赋值对应的属性,同时返回对应的数
        // return obj.hasOwnProperty(item) ? false : (obj[item] = true)
        // 对于1和'1'是不同的,所以需要更改,利用typeof item在前面加上类型判断
        // return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
        // 对于对象类型,用typeof item + item都是object[object Object]
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
    // return obj
}
```

数组拍平：for循环递归，reduce，拓展运算符

```js
var arr = [1, [2, [3, 4]]];

function flatten1(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten1(arr[i]))
        }
        else {
            result.push(arr[i])
        }
    }
    return result;
}
function flatten2(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten2(next) : next)
    }, [])
}
function flatten3(arr) {

    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }

    return arr;
}
```

查找指定元素：findIndex，createIndexFinder，sortedIndex

```js
Array.prototype.createIndexFinder = function () {
    let len = this.length, arr = this;
    let func = arguments[0], flag = arguments[1];
    if (!flag) flag = 1;
    let index = flag > 0 ? 0 : len - 1;
    for (; index >= 0 && index < len; index += flag) {
        if (func.call(arr, arr[index])) return index;
    }
    return -1;
}
function isBigEnough(element) {
    return element >= 15;
}
// 根据第二个参数进行判断，负值则进行倒序遍历
console.log([12, 5, 8, 130, 44].createIndexFinder(isBigEnough, 2))
Array.prototype.sortedIndex = function () {
    let arr = this, target = arguments[0];
    let low = 0, height = arr.length;
    while (low < height) {
        var mid = Math.floor((low + height) / 2);
        if (target > arr[mid]) low = mid + 1;
        else height = mid;
    }
    return mid
}
// 判断在有序数组中的位置
console.log([10, 20, 30, 40, 50].sortedIndex(25));
```

乱序：插入排序，shuffle

```js
var values = [1, 2, 3, 4, 5];

values.sort(function(){
    return Math.random() - 0.5;
});
v8 在处理 sort 方法时，当目标数组长度小于 10 时，使用插入排序；反之，使用快速排序和插入排序的混合排序。所以这个方法是有问题的
// Fisher–Yates
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
        // ES6:[a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}
```

### 5.手写节流和防抖函数

节流函数：

```js
// 使用时间戳
function throttle(func, wait) {
    var context, args;
    var previous = 0;
    return function() {
        var now = +new Date()
        context = this
        args = arguments
        if (now - previous > wait) {
            func.apply(context, args)
            previous = now
        }
    }
}

// 使用定时器
function throttle(func, wait) {
    var context, args;
    var timeout;
    return function() {
        context = this
        args = arguments
        if (!timeout) {
            timeout = setTimeout(function() {
                timeout = null
                func.apply(context, args)
            }, wait)
        }
    }
}
```

防抖函数：

```js
function debounce(func, wait) {
	var timeout;

	return function () {
		var context = this;
		var args = arguments;

		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(function () {
			func.apply(context, args)
		}, wait);
	}
}
```

>防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行.
>
>节流的原理：如果你持续触发事件，每隔一段时间，只执行一次事件。
>

### 6.手写函数柯里化

柯里化主要就是把多个参数转换为单个参数传入，只有达到指定参数个数之后才能够执行：

比如我们有这样一段数据：

```
var person = [{name: 'kevin'}, {name: 'daisy'}]
```

如果我们要获取所有的 name 值，我们可以这样做：

```
var name = person.map(function (item) {
    return item.name;
})
```

不过如果我们有 curry 函数：

```
var prop = curry(function (key, obj) {
    return obj[key]
});

var name = person.map(prop('name'))
```

我们为了获取 name 属性还要再编写一个 prop 函数，是不是又麻烦了些？但是要注意，prop 函数编写一次后，以后可以多次使用，而且看起来更清晰。

eg: 实现`console.log(add(1)(2)(3)(4)) console.log(add(1,2,3,4))`都打印10

ES5：

```js
function curry(fn, args) {
    length = fn.length;
    args = args || [];
    return function() {
        var arr = args, item;
        for(var i = 0; i < arguments.length; i++) {
            item = arguments[i];
            arr.push(item)
        }
        if(arr.length < length) {
            return curry.call(this,fn,arr)
        } else {
            return fn.apply(this, arr)
        }
    }
}

function Add(a,b,c,d) {
    return a + b + c + d;
}

var add = curry(Add);
```

### 7.对象的深浅拷贝，复制，遍历以及判断对象相等

深浅拷贝：JSON，递归，以及**JQ的extend方法**

```js
JSON.parse(JSON.stringify(arr2)) // 无法拷贝函数		
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            // newObj[key] = obj[key]; // 浅拷贝
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]; 			//递归调用深拷贝
        }
    }
    return newObj;
}
```

extend：标志位控制深浅拷贝，避免循环引用，待复制类型是数组和对象要分开判断

```js
function extend() {
	// 默认浅拷贝
	var deep = false;
	var target, arr;
	var istype = Object.prototype.toString;
	if (typeof arguments[0] === 'boolean') {
		deep = arguments[0];
		target = arguments[1];
		arr = Array.prototype.slice.call(arguments, 2);
	} else {
		target = arguments[0];
		arr = Array.prototype.slice.call(arguments, 1);
	}

	// 如果target不是对象，我们是无法进行复制的，所以设为 {}
	if (istype.call(target) !== '[object Object]' && istype.call(target) !== '[object Function]') {
		terget = {}
	}

	arr.forEach((item, index) => {
		// 要求不能为空 避免 extend(a,,b) 这种情况
		if (item !== null) {
			for (var name in item) {
				// 防止循环引用
				if (target === item[name]) {
					continue;
				}
				if (deep && typeof item[name] === 'object') {
					// 判断复制的属性值为数组还是对象
					target[name] = Array.isArray(item[name]) ? [] : {};
					target[name] = extend(deep, target[name], item[name])
				} else {
					target[name] = item[name]
				}
			}
		}
	})
	return target

}

var obj1 = {
	a: 1,
	b: { b1: 1, b2: 2 },
	k: 2
};

var obj2 = {
	b: { b1: 3, b3: 4 },
	c: 3
};

var obj3 = {
	d: 4,
	k: [2]
}
console.log(extend(true, obj1, obj2, obj3));
a: 1
b: {b1: 3, b3: 4}
c: 3
d: 4
k: [2]
```

遍历：终止循环，对象和数组的判断(9.类型判断的isArrayLike)，this绑定

```js
function each(obj, callback) {
    var length, i = 0;

    if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }

    return obj;
}
```

>jQuery:
>
>```
>$.each($("p"), function(){
>   $(this).hover(function(){ ... });
>})
>```
>
>虽然我们经常会这样写：
>
>```
>$("p").each(function(){
>    $(this).hover(function(){ ... });
>})
>```
>
>但是因为 $("p").each() 方法是定义在 jQuery 函数的 prototype 对象上面的，而 $.each()方法是定义 jQuery 函数上面的，调用的时候不从复杂的 jQuery 对象上调用，速度快得多。所以我们推荐使用第一种写法。

对象相等：

### 8.手写继承和对象创建

继承：原型继承，借用构造函数继承，组合继承，寄生组合继承

```js
// 注意: prototype是函数才会有的属性
//原型继承
function father1() {
    this.flag = true;
}
father1.prototype.flag = false;
father1.prototype.time = ["1","2"];//引用类型产生的问题
function son1() {
    this.age = 21;
}
son1.prototype = new father1();
var obj1 = new son1();
obj1.time.push("3");

console.log(obj1.flag);
console.log(obj1.constructor === father1);

var obj11 = new son1();
console.log(obj11.time);//会受到obj1的影响

//借用构造函数继承--解决引用类型所造成的问题
function father2() {
    this.color = ["blue","green","yellow"];
}
function son2() {
    father2.apply(this);//this是对象(构造函数创建所返回的对象),而son2则是一个函数
}

var obj2 = new son2();
obj2.color.push("black");
console.log(obj2.color);
var obj21 = new son2();
console.log(obj21.color);
//组合继承
function father3(name) {
    this.color = ["blue","green","yellow"];
    this.name = name;
}
father3.prototype.sayName = function() {
    console.log(this.name);
};
function son3(name) {
    father3.call(this,name);//实例属性,可以向父类的构造函数传参 第一次调用父类的构造函数
}
son3.prototype = new father3();//第二次调用父类的构造函数
var obj3 = new son3("baotao");
console.log(obj3.name);
obj3.sayName();
var obj31 = new son3("baochen");
console.log(obj31.name);
obj31.sayName();
//原型式继承
//ES5通过Object.create()方法实现原型式继承
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
//寄生组合继承--由于组合继承会多次调用父类的构造函数
function inheritPrototype(Father4,Son4) {
    var prototype = Object.create(Father4.prototype);//原型式继承,没有调用父类的构造函数
    prototype.constructor = Father4;
    Son4.prototype = prototype;
}
```

对象创建：工厂模式，构造函数，原型字面量，组合方式

```js
//利用函数进行封装--工厂模式
function createPerson1(name,age){
    var o = new Object();
    o.name = name;
    o.age = age;
    return o;
}
console.log(createPerson1("baotao", 21));
console.log(createPerson1("baotao", 22) instanceof Object);//都是Object类型,无法辨别出不同的类型
//采用构造函数解决这个问题
function createPerson2(name,age){
    this.name = name;
    this.age = age;
}
var obj = new createPerson2("baotao",21);//使用new操作符,即是构造函数
console.log(obj);
console.log(obj instanceof createPerson2);//区别于工厂模式,不仅是Object,还是createPerson2类型
//由于有些属性是共用的,对此需要使用原型对象
function createPerson3(age){
    //console.log(this.__proto__===createPerson3.prototype);//true
    createPerson3.prototype.name = "baotao";
    this.age = age;
    createPerson3.prototype.sayName = function() {
        console.log(this.name);
    }
}
var obj1 = new createPerson3(27);
var obj2 = new createPerson3(21);
obj1.sayName();
obj2.sayName();
//Object.getPrototypeOf()获取原型对象
console.log(Object.getPrototypeOf(obj1) === createPerson3.prototype);
//delete操作符删除实例属性
obj1.name = "baochen";
console.log(obj1.name+"---"+obj2.name);
delete obj1.name;
console.log(obj1.name);
//Object.hasOwnProperty()判断属性是否在实例中
console.log(Object.hasOwnProperty(obj1.name));
// for-in返回对象的可枚举属性
// Object.keys()方法,接收一个对象,返回一个包含所有可枚举属性的数组
for(key in obj1){//in操作符后面跟实例对象
    console.log(key);//age name sayName
}
var result1 = Object.keys(obj1);
console.log(result1);//age
console.log(Object.getOwnPropertyNames(createPerson3));//返回所有实例属性
//原型字面量
function Person() { this.name= "baotao"}
var obj4 = new Person();//在重写原型对象前不要创建实例对象,会有问题
Person.prototype = {
    //constructor:Person 加上这句话
    name:"baotao",
    age:21,
    sayName:function () {
        console.log(this.name);
    }
};
//console.log(obj4.age);--undefined
var obj3 = new Person();
console.log(Person.prototype.constructor === Person);//false 改变了constructor的指向    //采用组合方式创建对象
function Person() {this.time=["1","2"]}//在构造函数中定义引用类型
Person.prototype = {
    name:"baotao",
    age:21,
    time:["1","2"],
    sayName:function () {
        console.log(this.name);
    }
};
var obj1 = new Person();
var obj2 = new Person();
obj2.time.push("3");
console.log(obj1.time);//1,2
console.log(obj2.time);//1,2,3
```

### 9.类型判断

类型判断：typeof， instanceof，Object.prototype.toString.call()，判断是window或者纯粹的对象

typeof可以判断Undefined、Boolean、Number、String、Object、Function，但是不能判断Null以及Object中的Date、RegExp、Error 等

instanceof是根据原型链进行判断的，具体实现如下：

```js
function(left,right) {
    if(typeof left !== 'object' && typeof left !== 'function') {
        return false
    }
    let proto = left.__proto__;
    let prototype = right.prototype;
    while(true) {
        if(proto === null) return false;
        if(proto === prototype) return true;
        proto = proto.__proto__
    }
}
```

`Object.prototype.toString` 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，而 class 是要判断的对象的内部属性:

```js
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]
console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]
function a() {
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
```

当然判断数组可以使用`Array.isArray`,本质也是使用了`Object.prototype.toString`,实现如下：

```js
Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
```

判断空对象，window，DOM元素节点，以及`PlainObject`

```js
采用for-in遍历判断空对象：
function isEmptyObject( obj ) {

        var name;

        for ( name in obj ) {
            return false;
        }

        return true;
}

利用window对象自身有个属性window指向自身：
function isWindow( obj ) {
    return obj != null && obj === obj.window;
}

DOM元素节点的nodeType是否为1：
isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};

PlainObject是只能通过 {} 和 new Object 创建的对象，或者没有原型：
proto = Object.getPrototypeOf(obj);
// 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
if (!proto) {
    return true;
}
// 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
 // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
return typeof Ctor === "function" && Object.prototype.hasOwnProperty.toString.call(Ctor) === Object.prototype.hasOwnProperty.toString.call(Object);
// 判断类数组对象
function isArrayLike(obj) {

    // obj 必须有 length属性
    var length = !!obj && "length" in obj && obj.length;
    var typeRes = type(obj);

    // 排除掉函数和 Window 对象
    if (typeRes === "function" || isWindow(obj)) {
        return false;
    }
	// 1.是数组 2.长度为 0 3.lengths 属性是大于 0 的数字类型，并且obj[length - 1]必须存在
    return typeRes === "array" || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}
```

### 10.动手实现JSON.stringfy和JSON.parse方法

JSON.stringfy：包装类转成原始类型，undefined/Function/symbol会被忽略，不可枚举的属性忽略，循环引用的属性也要忽略

```js
function jsonStringfy(obj) {
    let type = typeof obj;
    if (type !== 'object' || type === null) {
        if (/string|undefined|function/.test(type)) {
            obj = '"' + obj + '"'
        }
        return String(obj)
    } else {
        let json = [];
        arr = (obj && obj.constructor === Array);
        for (let k in obj) {
            let v = obj[k];
            let type = typeof v;
            if (/string|undefined|function/.test(type)) {
                v = '"' + v + '"'
            } else if(type === 'object') {
                v = jsonStringfy(v)
            }
            json.push((arr ? "" : '"' + k + '":') + String(v))
        }
        return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}')
    }
}
console.log(jsonStringfy({x: 5}));
console.log(jsonStringfy([1, "false", false]));
console.log(jsonStringfy({b: undefined}))
```

[JSON.parse](https://juejin.im/entry/5a98f1ef518825558001a859)：`eval`实现容易产生XSS，改为`new Function()`也行

```js
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
    rx_one.test(
        json
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}
```

### 11.手写一个闭包以及[闭包的作用](https://zhuanlan.zhihu.com/p/26899840)

>闭包具有保留外层变量引用的特性：
>
>bind实现this绑定和参数传递
>
>setTimeout() 绑定this，或者追加第三个参数传入
>
>回调函数...

```js
function say(number) {
    var arr = []
    for (var i = 0; i < 10; i++) {
        arr[i] = function () {
            console.log(i)
        }
    }
    return arr[number]()
}
// 打印为10
say(3);


function say(number) {
    var arr = []
    for (var i = 0; i < 10; i++) {
        arr[i] = (function (index) {
            return function () {
                console.log(index)
            }
        })(i)
    }
    return arr[number]()
}
// 打印为3
say(3);
```

### 12.谈谈ES6

```js
let/const：不存在变量提升，有暂时性死区，引入块级作用域，const变量需要立刻赋值且不能改变
箭头函数：没有自己的this（通过查找作用域链来确定），不能new，没有arguments和原型
解构赋值，Map/Set类型
Proxy和Reflect：proxy进行对象属性访问的劫持，refelect则是把Object上语言内部的方法放置到这个对象上
模板字符串，数组拓展方法（...，includes，find，findIndex，flat）
class：通过extends实现继承，constructor为构造函数，函数和变量用static修饰相当于添加为该class的属性
Promise:通过then实现链式调用，只有两种状态resolve/reject,解决异步循环嵌套问题
```
async/await:更好的异步处理，每个await返回一个Promise实例，将函数设为async则会继发执行await,将异步请求结果用await输出，而不是在await后面直接添加异步请求方法
```js
多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

let foo = await getFoo();
let bar = await getBar();
上面代码中，getFoo和getBar是两个独立的异步操作（即互不依赖），被写成继发关系。这样比较耗时，因为只有getFoo完成以后，才会执行getBar，完全可以让它们同时触发。

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```
Module模块化：Node(require/module.exports和exports)ES6(import/export):

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

```js
export default 命令
为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。
// export-default.js
export default function () {
  console.log('foo');
}
上面代码是一个模块文件export-default.js，它的默认输出是一个函数。其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。

模块的整体加载
除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。
import * as circle from './circle';

因为require是运行时加载模块，import命令无法取代require的动态加载功能。
import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
```









