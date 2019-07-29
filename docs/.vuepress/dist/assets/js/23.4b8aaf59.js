(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{216:function(t,e,n){"use strict";n.r(e);var a=n(0),o=Object(a.a)({},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h2",{attrs:{id:"js原型链与原型"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#js原型链与原型","aria-hidden":"true"}},[t._v("#")]),t._v(" JS原型链与原型")]),t._v(" "),n("p",[t._v("深入探究下 "),n("code",[t._v("Function.__proto__ === Function.prototype")]),t._v(" 引起的问题并了解 Object.prototype、Function.prototype、function Object 、function Function 之间的关系。")]),t._v(" "),n("h2",{attrs:{id:"object-prototype"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#object-prototype","aria-hidden":"true"}},[t._v("#")]),t._v(" Object.prototype")]),t._v(" "),n("p",[t._v("我们先来看看 ECMAScript 上的定义。")]),t._v(" "),n("p",[t._v("Object.prototype 表示 Object 的原型对象，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 属性是 null，访问器属性 "),n("code",[t._v("__proto__")]),t._v(" 暴露了一个对象的内部 "),n("code",[t._v("[[Prototype]]")]),t._v(" 。 Object.prototype 并不是通过 "),n("code",[t._v("Object")]),t._v(" 函数创建的，为什么呢？看如下代码")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("function Foo() {\n  this.value = 'foo';\n}\nlet f = new Foo();\nf.__proto__ === Foo.prototype;\n// true\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br")])]),n("p",[t._v("实例对象的 "),n("code",[t._v("__proto__")]),t._v(" 指向构造函数的 "),n("code",[t._v("prototype")]),t._v("，即 "),n("code",[t._v("f.__proto__")]),t._v(" 指向 Foo.prototype，但是 "),n("code",[t._v("Object.prototype.__proto__")]),t._v(" 是 null，所以 Object.prototype 并不是通过 Object 函数创建的，那它如何生成的？其实 Object.prototype 是浏览器底层根据 ECMAScript 规范创造的一个对象。")]),t._v(" "),n("p",[t._v("Object.prototype 就是原型链的顶端（不考虑 null 的情况下），所有对象继承了它的 toString 等方法和属性。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/6c61ed261d77e24048415a4d95cffaffa6999d3e/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6771383366626a3330616d3038676467682e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/6c61ed261d77e24048415a4d95cffaffa6999d3e/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6771383366626a3330616d3038676467682e6a7067",alt:"img"}}),n("OutboundLink")],1)]),t._v(" "),n("h2",{attrs:{id:"function-prototype"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#function-prototype","aria-hidden":"true"}},[t._v("#")]),t._v(" Function.prototype")]),t._v(" "),n("p",[t._v("我们先来看看 ECMAScript 上的定义。")]),t._v(" "),n("p",[t._v("Function.prototype 对象是一个函数（对象），其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 内部属性值指向内建对象 Object.prototype。Function.prototype 对象自身没有 "),n("code",[t._v("valueOf")]),t._v(" 属性，其从 Object.prototype 对象继承了"),n("code",[t._v("valueOf")]),t._v(" 属性。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/17b00af87ff1cae6603cd18e3feb7acf76f5b8b7/68747470733a2f2f7773312e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6869396a6b7a6a33306179306a31676e342e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/17b00af87ff1cae6603cd18e3feb7acf76f5b8b7/68747470733a2f2f7773312e73696e61696d672e636e2f6c617267652f303036744e6337396779316731786d6869396a6b7a6a33306179306a31676e342e6a7067",alt:"img"}}),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("Function.prototype 的 "),n("code",[t._v("[[Class]]")]),t._v(" 属性是 "),n("code",[t._v("Function")]),t._v("，所以这是一个函数，但又不大一样。为什么这么说呢？因为我们知道只有函数才有 prototype 属性，但并不是所有函数都有这个属性，因为 Function.prototype 这个函数就没有。")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("Function.prototype\n// ƒ () { [native code] }\n\nFunction.prototype.prototype\n// undefined\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br")])]),n("p",[t._v("当然你会发现下面这个函数也没有 prototype 属性。")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("let fun = Function.prototype.bind()\n// ƒ () { [native code] }\n\nfun.prototype\n// undefined\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br")])]),n("p",[t._v("为什么没有呢，我的理解是 "),n("code",[t._v("Function.prototype")]),t._v(" 是引擎创建出来的函数，引擎认为不需要给这个函数对象添加 "),n("code",[t._v("prototype")]),t._v(" 属性，不然 "),n("code",[t._v("Function.prototype.prototype…")]),t._v(" 将无休无止并且没有存在的意义。")]),t._v(" "),n("h2",{attrs:{id:"function-object"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#function-object","aria-hidden":"true"}},[t._v("#")]),t._v(" function Object")]),t._v(" "),n("p",[t._v("我们先来看看 ECMAScript 上的定义。")]),t._v(" "),n("p",[t._v("Object 作为构造函数时，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 内部属性值指向 Function.prototype，即")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("Object.__proto__ === Function.prototype\n// true\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br")])]),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/3a340e35538937703b327a844abae1a094e863e9/68747470733a2f2f7773332e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796e676965656c376a33307634306b677465312e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/3a340e35538937703b327a844abae1a094e863e9/68747470733a2f2f7773332e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796e676965656c376a33307634306b677465312e6a7067",alt:"img"}}),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("使用 "),n("code",[t._v("new Object()")]),t._v(" 创建新对象时，这个新对象的 "),n("code",[t._v("[[Prototype]]")]),t._v(" 内部属性指向构造函数的 prototype 属性，对应上图就是 Object.prototype。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/97c8fdbc61458fcfcab1f093c99b44596e930569/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796f31376c736d6e6a333073383065753431382e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/97c8fdbc61458fcfcab1f093c99b44596e930569/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316731796f31376c736d6e6a333073383065753431382e6a7067",alt:"img"}}),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("当然也可以通过对象字面量等方式创建对象。")]),t._v(" "),n("ul",[n("li",[t._v("使用对象字面量创建的对象，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 值是 "),n("code",[t._v("Object.prototype")]),t._v("。")]),t._v(" "),n("li",[t._v("使用数组字面量创建的对象，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 值是 "),n("code",[t._v("Array.prototype")]),t._v("。")]),t._v(" "),n("li",[t._v("使用 "),n("code",[t._v("function f(){}")]),t._v(" 函数创建的对象，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 值是 "),n("code",[t._v("Function.prototype")]),t._v("。")]),t._v(" "),n("li",[t._v("使用 "),n("code",[t._v("new fun()")]),t._v(" 创建的对象，其中 fun 是由 JavaScript 提供的内建构造器函数之一(Object, Function, Array, Boolean, Date, Number, String 等等），其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 值是 fun.prototype。")]),t._v(" "),n("li",[t._v("使用其他 JavaScript 构造器函数创建的对象，其 "),n("code",[t._v("[[Prototype]]")]),t._v(" 值就是该构造器函数的 prototype 属性。")])]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v('let o = {a: 1};\n// 原型链:\to ---\x3e Object.prototype ---\x3e null\n\nlet a = ["yo", "whadup", "?"];\n// 原型链:\ta ---\x3e Array.prototype ---\x3e Object.prototype ---\x3e null\n\nfunction f(){\n  return 2;\n}\n// 原型链:\tf ---\x3e Function.prototype ---\x3e Object.prototype ---\x3e null\n\nlet fun = new Function();\n// 原型链:\tfun ---\x3e Function.prototype ---\x3e Object.prototype ---\x3e null\n\nfunction Foo() {}\nlet foo = new Foo();\n// 原型链:\tfoo ---\x3e Foo.prototype ---\x3e Object.prototype ---\x3e null\n\nfunction Foo() {\n  return {};\n}\nlet foo = new Foo();\n// 原型链:\tfoo ---\x3e Object.prototype ---\x3e null\n')])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br"),n("span",{staticClass:"line-number"},[t._v("22")]),n("br"),n("span",{staticClass:"line-number"},[t._v("23")]),n("br")])]),n("h2",{attrs:{id:"function-function"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#function-function","aria-hidden":"true"}},[t._v("#")]),t._v(" function Function")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("Function.__proto__ === Function.prototype\n// true\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br")])]),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/9e41079772c1366b9770d5e982d192b1410198d7/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e633739677931673179723730396778396a33306f303038383431302e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/9e41079772c1366b9770d5e982d192b1410198d7/68747470733a2f2f7773342e73696e61696d672e636e2f6c617267652f303036744e633739677931673179723730396778396a33306f303038383431302e6a7067",alt:"img"}}),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("到这里就有意思了，我们看下鸡生蛋蛋生鸡问题。")]),t._v(" "),n("h2",{attrs:{id:"function-object-问题"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#function-object-问题","aria-hidden":"true"}},[t._v("#")]),t._v(" Function & Object 问题")]),t._v(" "),n("p",[t._v("我们看下面这段代码")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("Object instanceof Function \t\t// true\nFunction instanceof Object \t\t// true\n\nObject instanceof Object \t\t\t// true\nFunction instanceof Function \t// true\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br")])]),n("p",[n("code",[t._v("Object")]),t._v(" 构造函数继承了 "),n("code",[t._v("Function.prototype")]),t._v("，同时 "),n("code",[t._v("Function")]),t._v(" 构造函数继承了"),n("code",[t._v("Object.prototype")]),t._v("。这里就产生了问题。因为 "),n("code",[t._v("Function.prototype")]),t._v(" 和 "),n("code",[t._v("Function.__proto__")]),t._v(" 都指向 "),n("code",[t._v("Function.prototype")]),t._v("。")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("// Object instanceof Function \t即\nObject.__proto__ === Function.prototype \t\t\t\t\t// true\n\n// Function instanceof Object \t即\nFunction.__proto__.__proto__ === Object.prototype\t// true\n\n// Object instanceof Object \t\t即 \t\t\t\nObject.__proto__.__proto__ === Object.prototype \t// true\n\n// Function instanceof Function 即\t\nFunction.__proto__ === Function.prototype\t\t\t\t\t// true\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br")])]),n("p",[t._v("对于 "),n("code",[t._v("Function.__proto__ === Function.prototype")]),t._v(" 这一现象有 2 种解释，争论点在于 Function 对象是不是由 Function 构造函数创建的一个实例？")]),t._v(" "),n("p",[t._v("Function 是 "),n("code",[t._v("built-in")]),t._v(" 的对象，也就是并不存在“Function对象由Function构造函数创建”这样显然会造成鸡生蛋蛋生鸡的问题。实际上，当你直接写一个函数时（如 "),n("code",[t._v("function f() {}")]),t._v(" 或 "),n("code",[t._v("x => x")]),t._v("），也不存在调用 Function 构造器，只有在显式调用 Function 构造器时（如 "),n("code",[t._v("new Function('x', 'return x')")]),t._v(" ）才有。")]),t._v(" "),n("p",[t._v("即先有 "),n("code",[t._v("Function.prototype")]),t._v(" 然后有的 "),n("code",[t._v("function Function()")]),t._v(" ，所以就不存在鸡生蛋蛋生鸡问题了，把 "),n("code",[t._v("Function.__proto__")]),t._v(" 指向 "),n("code",[t._v("Function.prototype")]),t._v(" 是为了保证原型链的完整，让 "),n("code",[t._v("Function")]),t._v(" 可以获取定义在 "),n("code",[t._v("Object.prototype")]),t._v(" 上的方法。")]),t._v(" "),n("p",[t._v("最后给一个完整的图，看懂这张图原型就没问题了。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://camo.githubusercontent.com/68f81e824468c6a2a897082c4de05706f4d8941d/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316732336e3436757a6a616a33306836306c703076372e6a7067",target:"_blank",rel:"noopener noreferrer"}},[n("img",{attrs:{src:"https://camo.githubusercontent.com/68f81e824468c6a2a897082c4de05706f4d8941d/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396779316732336e3436757a6a616a33306836306c703076372e6a7067",alt:"jsobj"}}),n("OutboundLink")],1)])])},[],!1,null,null,null);e.default=o.exports}}]);