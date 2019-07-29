---
title: Vue的增删改查
date: 2019-02-26 08:32:21
tags: Vue
categories: 
- Vue
---

正如题目所说,如何实现Vue的增删改查,然后整理下Vue基础知识,具体效果参照[具体实现效果看链接](https://www.xiabingbao.com/demo/vue-curd/index.html)

我们把这些用户信息保存到`list`的数组中，然后增删改查就在这个数组上进行:

```javascript
list: [
                {
                    username: 'aaaaa',
                    email: '123@qq.com',
                    sex: '男',
                    province: '北京市',
                    hobby: ['篮球', '读书', '编程']
                },
                {
                    username: 'bbbbb',
                    email: 'bbbbbbb@163.com',
                    sex: '女',
                    province: '河北省',
                    hobby: ['弹琴', '读书', '插画']
                },
                {
                    username: 'aaabb',
                    email: 'abababab@qq.com',
                    sex: '女',
                    province: '重庆市',
                    hobby: ['篮球']
                },
                {
                    username: 'cccccc',
                    email: '123@qq.com',
                    sex: '男',
                    province: '北京市',
                    hobby: ['篮球', '读书', '编程']
                },
                {
                    username: 'dddddd',
                    email: 'bbbbbbb@163.com',
                    sex: '女',
                    province: '河北省',
                    hobby: ['弹琴', '读书', '插画']
                },
                {
                    username: 'eeeee',
                    email: 'abababab@qq.com',
                    sex: '女',
                    province: '重庆市',
                    hobby: ['篮球']
                }
],
```

### 1.展示数据

我们的数据都放在数组`list`中，但是这里并不直接对list对循环输出，而是先把`list`中的数据给一个数组`slist`，对`slist`进行循环输出。因为我们在后面的**查询**功能中需要对数据进行过滤，数组list一直保存着原始数据（包括新增、修改后或已删除后），而数组slist只负责展示。

```javascript
// 获取需要渲染到页面中的数据
setSlist(arr) {
    this.slist = JSON.parse(JSON.stringify(arr));
},
```

并用`v-for`把数组内容渲染出来:

```html
<tr v-cloak v-for="(item, index) of slist">
                    <td>{{index+1}}</td>
                    <td>{{item.username}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.sex}}</td>
                    <td>{{item.province}}</td>
                    <td>{{item.hobby.join(' | ')}}</td>
                    <td><a href="javascript:;" @click="showOverlay(index)">修改</a> | <a href="javascript:;" @click="del(index)">删除</a></td>
                </tr>
```

### 2.新增和删除数据

相对比较简单,就是对`list`数组进行`push()`和`splice(index,1)`操作,然后就能够实现.

```javascript
del(index) {
	this.list.splice(index,1);
	this.setSlist(this.list);
},
add() {
	this.selectedlist = {
        username: '',
        email: '',
        sex: '男',
        province: '北京市',
        hobby: []
    };
    // 控制弹层的出现,然后再push()即可
    this.isActive = true;
},
```

### 3.修改功能

修改某个元素时，可以把这个位置上的数据取出来放到弹层里（或者其他某个位置），在弹层里的信息可以取消或者修改后进行保存。

假设我们弹层里的数据是`selectedlist`，那么每次修改时，把`index`位置的数据给了`selectedlist`，然后在弹层中修改`selectedlist`。我们也能看到修改数据的类型： 文本框（用户名，邮箱），单选按钮（性别），select选择框（所在省份），多选框（爱好），这里我们主要练习的是[表单处理](https://cn.vuejs.org/v2/guide/forms.html)。弹层是否显示用变量`isActive`来控制：

```javascript
// 点击弹层的保存按钮
modify(arr) {
	// this.list[this.selected] = arr;

	/*
	  this.list 数据数组
	  this.selected 刚才修改的位置
	  this.selectedlist 需要保存的数据
	*/
    // 说明是进行修改
	if (this.selected > -1) {
        Vue.set(this.list, this.selected, arr);
        this.selected = -1;
    } else {
        // this.selected还是-1,说明是新增,则进行push()
        this.list.push(arr);
    }
	this.setSlist(this.list);
	this.changeOverlay(); 
},
```

注意问题:若直接用`this.selectedlist = this.list[index];`为浅度拷贝（把数据的地址赋值给对应变量，而没有把具体的数据复制给变量，变量会随数据值的变化而变化），`selectedlist`与`list[index]`使用相同的数据地址，互相引起数据值的变化,应采用深度拷贝:

```javascript
this.selectedlist = JSON.parse( JSON.stringify(this.list[index]) ); // 先转换为字符串，然后再转换
```

### 4.查询功能

在页面表格中展示的是`slist`中的数据，就是为了方便执行查询操作：

每次根据某些条件将过滤后的数据赋值给slist数组，展示出查询后的数据。这里我们的查询实现了两个小功能：

1. 用户在输入某个字符后，自动在输入框下方用列表展示出用户可能要查询的词语（如用户名等）
2. 同步更新表格中的数据

这里我们通过用户名和邮箱进行查询，因此在过滤数据时，需要检测用户名和邮箱是否含有查询的单词。我们先给输入框绑定一个input事件，同时用datalist展示用户可能要查询的词语：

```html
<input type="text" placeholder="search" @input="search" list="cars" class="search">
<datalist id="cars">
    <option v-for="item in searchlist" :value="item"></option>
</datalist>
```

`search()`方法的实现,`searchlist`为在输入框下方展示的可能要搜索的词语，`ss`数组则保存过滤后的数据，当循环完毕后，设置调用`setSlist`方法修改`slist`数组:

```javascript
// 搜索
search(e) {
	let value = e.target.value, self = this;
	if(value) {
        // 通过`ss`变量实现同步更新表格中的数据
		let ss = [];

		this.list.forEach(function(item) {
			// 检测用户名
            if (item.username.indexOf(value) > -1) {
                // 只要searchlist没有该数据则进行push()
                if (self.searchlist.indexOf(item.username) == -1) {
                    self.searchlist.push(item.username);
                }
                ss.push(item);
            } else if (item.email.indexOf(value) > -1) {
                // 检测邮箱
                if (self.searchlist.indexOf(item.email) == -1) {
                    self.searchlist.push(item.email);
                }
                ss.push(item);
            }
		});
		this.setSlist(ss); // 将过滤后的数据给了slist
	} else {
		// 没有搜索内容，则展示全部数据
		this.setSlist(this.list);
        // 可以选择不输入时将searchlist清空,然而搜索记录没有必要删除
        // self.searchlist = [];
	}
},
```

### 5. 将弹层独立为组件

把弹层独立为组件的形式，把需要修改的数据通过`props`传递给该组件（新增数据时，可以给组件传递一个空数据），当用户点击保存时，再通过`$emit`给了父组件（子组件不能直接父级的数据，需要用data或者computed生成一个局部变量，然后再使用$emit方法把这个局部数据再传递上去）：

```javascript
Vue.component('model', {
    props: ['list', 'isactive'],
    template: `<div class="overlay" v-show="isactive">
                    <div class="con">
                    <h2 class="title">新增 | 修改</h2>
                    <div class="content">
                    <table>
                    <tr>
                    <td>用户名</td>
                    <td><input type="text" v-model="modifylist.username"></td>
                    </tr>
                    <tr>
                    <td>邮箱</td>
                    <td><input type="text" v-model="modifylist.email"></td>
                    </tr>
                    <tr>
                    <td>性别</td>
                    <td>
                    <label><input type="radio" name="sex" value="男" v-model="modifylist.sex">男</label>
                    <label><input type="radio" name="sex" value="女" v-model="modifylist.sex">女</label>
                    <label><input type="radio" name="sex" value="未知" v-model="modifylist.sex">未知</label>
                    </td>
                    </tr>
                    <tr>
                    <td>省份</td>
                    <td>
                    <select name="" id="" v-model="modifylist.province">
                    <option value="北京市">北京市</option>
                    <option value="河北省">河北省</option>
                    <option value="河南省">河南省</option>
                    <option value="重庆市">重庆市</option>
                    <option value="广东省">广东省</option>
                    <option value="辽宁省">辽宁省</option>
                    </select>
                    </td>
                    </tr>
                    <tr>
                    <td>爱好</td>
                    <td>
                    <label><input type="checkbox" v-model="modifylist.hobby" value="篮球">篮球</label>
                    <label><input type="checkbox" v-model="modifylist.hobby" value="读书">读书</label>
                    <label><input type="checkbox" v-model="modifylist.hobby" value="插画">插画</label>
                    <label><input type="checkbox" v-model="modifylist.hobby" value="编程">编程</label>
                    <label><input type="checkbox" v-model="modifylist.hobby" value="弹琴">弹琴</label>
                    </td>
                    </tr>
                    </table>
                    <p>
                    <input type="button" @click="changeActive" value="取消">
                    <input type="button" @click="modify" value="保存">
                    </p>
                    </div>
                    </div>
                </div>`,
    computed: {
        modifylist() {
            return this.list;
        }
    },
    methods: {
        changeActive() {
            this.$emit('change');
        },
        modify() {
            this.$emit('modify', this.modifylist);
        }
    }
});
```

在父组件中中截取`change`和`modify`事件，再用`changeOverlay`和`modify`来实现:

```html
<!-- list为子组件props的值,selectedlist为父组件data的值 -->
<model :list='selectedlist' :isactive="isActive" v-cloak @change="changeOverlay" @modify="modify"></model>
```

### 6.总结

1. form表单方面的操作
2. 组件间的数据与事件传递
```javascript
总结:props父传子,$emit自定义事件子传父:都是(vue命令)子组件内容 = 父组件内容
1.父组件向子组件传值
父组件中的 v-bind:'子组件props中的属性名称(若子组件props中的名称为myName,由于HTML特性不区分大小写,所以这里采用my-name)'='父组件中的属性名称'
注意如果是静态字符串则可以不用v-bind,否则必须使用
2.子组件向父组件传值(自定义事件,回调函数)
----自定义事件-----
子组件通过事件'$emit('modify', this.modifylist);'传递消息给父组件,再用v-on:'子组件事件名称'='父组件事件名称'
简化写法即为`v-model`(主要用于表单的双向绑定),实际上是
`<input type="text" v-model="name">`
相当于：`<input type="text" :value="name" @input="name = $event.target.value">`
----回调函数----
通过'v-bind:callback="callback"',用props将回调函数传给子组件,然后在子组件中用v-on:click="callback"绑定该方法
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

### 7.完整代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>vue进行CURD操作</title>
    <style type="text/css">
    /*v-cloak 属性防止页面加载时出现 vuejs 的变量名*/
        [v-cloak] {
            display: none
        }
        table {
            border: 1px solid #ccc;
            padding: 0;
            /*为表格设置合并边框模型*/
            border-collapse: collapse;
            /*固定表格布局*/
            table-layout: fixed;
            margin-top: 10px;
            width: 100%;
        }
        table td,
        table th {
            height: 30px;
            border: 1px solid #ccc;
            background: #fff;
            font-size: 15px;
            padding: 3px 3px 3px 8px;
        }
        table th:first-child {
            width: 30px;
        }
        .container,
        .st {
            width: 1000px;
            margin: 10px auto 0;
            font-size: 13px;
            font-family: 'Microsoft YaHei'
        }
        .container .search {
            font-size: 15px;
            padding: 4px;
        }
        .container .add {
            padding: 5px 15px;
        }
        .overlay {
        	/*相对于浏览器窗口进行定位*/
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 6;
            background: rgba(0, 0, 0, 0.7);
        }
        .overlay td:first-child {
            width: 66px;
        }
        .overlay .con {
            position: absolute;
            width: 420px;
            min-height: 300px;
            background: #fff;
            left: 50%;
            top: 50%;
            -webkit-transform: translate3d(-50%, -50%, 0);
            transform: translate3d(-50%, -50%, 0);
            /*若不使用transform,则需要使用如下方式对齐*/
            /*margin-top: -170px;
    		margin-left: -210px;*/
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="st">
        <h1>vue实现对数据的增删改查(CURD)</h1>
        <p>具体细节见:<a href="http://www.xiabingbao.com/vue/2017/07/10/vue-curd.html">vue实现对数据的增删改查(CURD)</a></p>
    </div>
    <div class="container" id="app">
        <div>
            <input type="text" placeholder="search" @input="search" list="cars" class="search">
            <!-- <datalist>标签,input 元素的 list 属性来绑定 datalist,合法的输入值列表 -->
            <datalist id="cars">
                <option v-for="item in searchlist" :value="item"></option>
            </datalist>
            <input type="button" class="add" @click="add" value="新增">
        </div>
        <div>
            <table>
                <tr>
                    <th>id</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>性别</th>
                    <th>省份</th>
                    <th>爱好</th>
                    <th>操作</th>
                </tr>
                <tr v-cloak v-for="(item, index) of slist">
                    <td>{{index+1}}</td>
                    <td>{{item.username}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.sex}}</td>
                    <td>{{item.province}}</td>
                    <td>{{item.hobby.join(' | ')}}</td>
                    <td><a href="javascript:;" @click="showOverlay(index)">修改</a> | <a href="javascript:;" @click="del(index)">删除</a></td>
                </tr>
            </table>
        </div>
        <!-- list为子组件props的值,selectedlist为父组件data的值 -->
        <model :list='selectedlist' :isactive="isActive" v-cloak @change="changeOverlay" @modify="modify"></model>
    </div>
</body>
<script type="text/javascript" src="https://unpkg.com/vue@2.3.4/dist/vue.js"></script>
<script type="text/javascript">
     Vue.component('model', {
        props: ['list', 'isactive'],
        template: `<div class="overlay" v-show="isactive">
                        <div class="con">
                        <h2 class="title">新增 | 修改</h2>
                        <div class="content">
                        <table>
                        <tr>
                        <td>用户名</td>
                        <td><input type="text" v-model="modifylist.username"></td>
                        </tr>
                        <tr>
                        <td>邮箱</td>
                        <td><input type="text" v-model="modifylist.email"></td>
                        </tr>
                        <tr>
                        <td>性别</td>
                        <td>
                        <label><input type="radio" name="sex" value="男" v-model="modifylist.sex">男</label>
                        <label><input type="radio" name="sex" value="女" v-model="modifylist.sex">女</label>
                        <label><input type="radio" name="sex" value="未知" v-model="modifylist.sex">未知</label>
                        </td>
                        </tr>
                        <tr>
                        <td>省份</td>
                        <td>
                        <select name="" id="" v-model="modifylist.province">
                        <option value="北京市">北京市</option>
                        <option value="河北省">河北省</option>
                        <option value="河南省">河南省</option>
                        <option value="重庆市">重庆市</option>
                        <option value="广东省">广东省</option>
                        <option value="辽宁省">辽宁省</option>
                        </select>
                        </td>
                        </tr>
                        <tr>
                        <td>爱好</td>
                        <td>
                        <label><input type="checkbox" v-model="modifylist.hobby" value="篮球">篮球</label>
                        <label><input type="checkbox" v-model="modifylist.hobby" value="读书">读书</label>
                        <label><input type="checkbox" v-model="modifylist.hobby" value="插画">插画</label>
                        <label><input type="checkbox" v-model="modifylist.hobby" value="编程">编程</label>
                        <label><input type="checkbox" v-model="modifylist.hobby" value="弹琴">弹琴</label>
                        </td>
                        </tr>
                        </table>
                        <p>
                        <input type="button" @click="changeActive" value="取消">
                        <input type="button" @click="modify" value="保存">
                        </p>
                        </div>
                        </div>
                    </div>`,
        computed: {
            modifylist() {
                return this.list;
            }
        },
        methods: {
            changeActive() {
                this.$emit('change');
            },
            modify() {
                this.$emit('modify', this.modifylist);
            }
        }
    });
    var app = new Vue({
        el: '#app',
        data: {
        	// 先把list中的数据给一个数组slist，对slist进行循环输出。
        	// 因为我们在后面的查询功能中需要对数据进行过滤，数组list一直保存着原始数据（包括新增、修改后或已删除后），而数组slist只负责展示。
        	slist: [],
        	//数据放在数组list中
            list: [
                {
                    username: 'aaaaa',
                    email: '123@qq.com',
                    sex: '男',
                    province: '北京市',
                    hobby: ['篮球', '读书', '编程']
                },
                {
                    username: 'bbbbb',
                    email: 'bbbbbbb@163.com',
                    sex: '女',
                    province: '河北省',
                    hobby: ['弹琴', '读书', '插画']
                },
                {
                    username: 'aaabb',
                    email: 'abababab@qq.com',
                    sex: '女',
                    province: '重庆市',
                    hobby: ['篮球']
                },
                {
                    username: 'cccccc',
                    email: '123@qq.com',
                    sex: '男',
                    province: '北京市',
                    hobby: ['篮球', '读书', '编程']
                },
                {
                    username: 'dddddd',
                    email: 'bbbbbbb@163.com',
                    sex: '女',
                    province: '河北省',
                    hobby: ['弹琴', '读书', '插画']
                },
                {
                    username: 'eeeee',
                    email: 'abababab@qq.com',
                    sex: '女',
                    province: '重庆市',
                    hobby: ['篮球']
                }
            ],
            // 修改弹层的数据
            selectedlist: {},
            selected: -1,
            // 控制弹层是否显示
            isActive: false,
            // 搜索列表
            searchlist: [],
        },
        created() {
            this.setSlist(this.list);
        },
        methods: {
            setSlist(arr) {
            	this.slist = JSON.parse(JSON.stringify(arr));
            },
            showOverlay(index) {
            	this.selectedlist = this.list[index];
            	this.selected = index;
            	this.changeOverlay();
            },
            // 控制是否显示弹出层
            changeOverlay() {
            	this.isActive = !this.isActive;
            },
            // 点击弹层的保存按钮
            modify(arr) {
            	// this.list[this.selected] = arr;

            	/*
            	  this.list 数据数组
            	  this.selected 刚才修改的位置
            	  this.selectedlist 需要保存的数据
            	*/
            	if (this.selected > -1) {
                    Vue.set(this.list, this.selected, arr);
                    this.selected = -1;
                } else {
                    this.list.push(arr);
                }
            	this.setSlist(this.list);
            	this.changeOverlay(); 
            },
            del(index) {
            	this.list.splice(index,1);
            	this.setSlist(this.list);
            },
            add() {
            	this.selectedlist = {
                    username: '',
                    email: '',
                    sex: '男',
                    province: '北京市',
                    hobby: []
                };
                this.isActive = true;
            },
            // 搜索
            search(e) {
            	let value = e.target.value, self = this;
            	if(value) {
            		let ss = [];

            		this.list.forEach(function(item) {
            			// 检测用户名
                        if (item.username.indexOf(value) > -1) {
                            if (self.searchlist.indexOf(item.username) == -1) {
                                self.searchlist.push(item.username);
                            }
                            ss.push(item);
                        } else if (item.email.indexOf(value) > -1) {
                            // 检测邮箱
                            if (self.searchlist.indexOf(item.email) == -1) {
                                self.searchlist.push(item.email);
                            }
                            ss.push(item);
                        }
            		});
            		this.setSlist(ss); // 将过滤后的数据给了slist
            	} else {
            		// 没有搜索内容，则展示全部数据
            		this.setSlist(this.list);
                    // self.searchlist = [];
            	}
            },
        },
        watch: {
        }
    })
</script>
</html>
```

