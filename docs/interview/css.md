---
title: CSS
date: 2019-04-07 16:54:29
---

## CSS常见面试题总结

### 1.水平居中

```css
(1)文本/行内/行内块
text-align:center
(2)单个块级
width:100px;
margin: 0 auto;
(3)多个块级
父: text-align:center;
子: display:inline-block;
(4)绝对定位
position:absolute;
left: 50%;
transform: translate(-50%);
(5)flex
display:flex;
justify-content:center;
```

### 2.垂直居中

```css
(1)单行文本
line-height: 20px;
(2)多行文本
display:inline-block;
line-height: 20px;
vertical-align:middle:
(3)图片
父: font-size:0;
子: vertical-align: middle;
(4)单个块级
position: absolute;
top: 0;
bottom: 0;
margin: 0 auto;
(5)多个块级
display:flex;
align-items: center;
(6)绝对定位...
```

### 3.水平垂直居中

```CSS
(1)行内/行内块/图片
父: text-align:center;
子:vartival-align:middle;display:inline-block;
(2)table
父: display: table-cell; vertical-align: middle; (text-align:center;)
子: (margin: 0 auto;)
(3)绝对定位...
(4)绝对居中
#parent{
    position: relative;
}
#son{
    position: absolute;
    margin: auto;
    width: 100px;
    height: 50px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
(5)flex
#parent{
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 4.等高布局

```css
1.flex实现
{
  display: flex;
  align-items: stretch;
}
2.使用border实现
.box { 
    border-left: 150px solid #333;
    background-color: #f0f3f9;
}
/* 清除浮动影响，不能使用overflow:hidden */
.box:after {
    content: "";
    display: block;
    clear: both;
}
/* 布局主结构 */
.box > nav {
    width: 150px;
    margin-left: -150px;
    float: left;
}
.box > section {
    overflow: hidden;
}
3.使用margin负值
.container {
    margin: auto;
    max-width: 600px;
    overflow: hidden;
}
.column-left,
.column-right {
    width: 50%;
    float: left;
    margin-bottom: -9999px;
    padding-bottom: 9999px;
}
.column-left {
    background-color: #34538b;
}
.column-right {
    background-color: #cd0000;
}
4.使用table-cell
```

### 5.三栏布局

#### 双飞翼布局

```css
html：
	<div id="header"></div>
	<!--中间栏需要放在前面-->
	<div id="parent">
		<div id="center">
			<div id="center_inbox">中间自适应</div>
			<hr>
			<!--方便观察原理-->
		</div>
		<div id="left">左列定宽</div>
		<div id="right">右列定宽</div>
	</div>
	<div id="footer"></div>
css: 
#header {
    height: 60px;
    background-color: #ccc;
}

#left {
    float: left;
    width: 200px;
    height: 500px;
    margin-left: -100%;
    background-color: skyblue;
}

#right {
    float: left;
    width: 200px;
    margin-left: -200px;
    height: 500px;
    background-color: skyblue;
}

#center {
    height: 500px;
    float: left;
    width: 100%;
    background-color: pink;
}

#center_inbox {
    height: 480px;
    border: 1px solid #000;
    margin: 0 220px 0 220px;
    /*关键!!!左右边界等于左右盒子的宽度,多出来的为盒子间隔*/
}

#parent {
    width: 100%;
    height: 500px;
}

#parent:after {
    clear: both;
    display: table;
    *zoom: 1;
}

#footer {
    height: 60px;
    background-color: #ccc;
}
```

>双飞翼布局重点：左中右均浮动，中间内容使用margin腾出空间，左边采用margin-left：-100%，而右边采用margin-left：-200px(自身宽度)

#### 圣杯布局

```css
html：
	<div id="header"></div>
	<div id="parent">
		<!--#center需要放在前面-->
		<div id="center">中间自适应
			<hr>
		</div>
		<div id="left">左列定宽</div>
		<div id="right">右列定宽</div>
	</div>
	<div id="footer"></div>
css：
#header {
    height: 60px;
    background-color: #ccc;
}

#left {
    position: relative;
    left: -220px;
    float: left;
    width: 200px;
    height: 500px;
    margin-left: -100%;
    background-color: skyblue;
}

#center {
    float: left;
    height: 500px;
    width: 100%;
    background-color: pink;
}

#right {
    position: relative;
    left: 220px;
    float: left;
    width: 200px;
    margin-left: -200px;
    height: 500px;
    background-color: skyblue;
}

#parent {
    box-sizing: border-box;
    height: 500px;
    padding: 0 220px 0 220px;
}

#parent:after {
    clear: both;
    display: table;
    *zoom: 1;
}

#footer {
    height: 60px;
    background-color: #ccc;
}

```

>圣杯布局是通过整体（包括左中右）设置padding腾出空间，左右两块采用相对定位偏移到左右两侧，margin-left则同上。

#### flex布局，绝对定位加margin，table

这些都可以实现，相对比较简单，暂不赘述

### 6.双栏布局

```css
1.flex布局(可以不定宽)
左 flex-basis: 200px 
右: flex: 1 
父容器: display: flex
2.绝对定位 
左: display:absolute top:0 left:0 width: 200px
右: margin-left: 200px
3.浮动+margin
左: float:left width: 200px
右: margin-left: 200px
父盒子: overflow: hidden
4.BFC+margin(可以不定宽)
左: float:left
右: overflow: hidden
父盒子: overflow: hidden
```

### 7.瀑布流布局

```css
section {
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    // 用于最后一行最后的位置显示空白
    &::after {
        content: "";
        flex-grow: 999;
    }
    .img-wrapper {
        flex: 1; // 等分剩余空间
        margin: 5px;
        .img {
            height: 170px;
            min-width: 100%;
            object-fit: cover;
        }
    }
}
```

### 8.清除浮动的三种方式

```css
1.在末尾添加新的元素<div class="clear"></div>，应用 clear：both；
.clear{clear:both; height: 0; line-height: 0; font-size: 0}
2.父级div定义 overflow: auto/hidden
3.利用::after 方法
.outer {zoom:1;}    /*==for IE6/7 Maxthon2==*/
.outer::after {clear:both;content:'.';display:block;width: 0;height: 0;visibility:hidden;}   /*==for FF/chrome/opera/IE8==*/
```

### 9.三角形实现

```css
.box
{
    width:0px;
    height:0px;
    border-top:50px solid red;
    border-right:50px solid yellow;
    border-bottom:50px solid green;
    border-left:50px solid pink; // 只要把上、右、左 方向边框的颜色设置为透明，只剩下向上的小三角
}
```

### 10.BFC

BFC 生成了一套封闭的布局空间，内部子元素无论怎么布局，都不会影响到外部的元素。BFC 可以用来**清除浮动**，**防止 margin 重叠**，**去除 float 文字环绕**，**第一个子元素 margin-top 和父元素重叠**等。

以下几种元素会生成 BFC：

- html 元素。
- float 不是 none 的元素。
- overflow: auto/hidden/scroll 的元素。
- display: table-cell/inline-block 的元素。
- position 不是 static 和 relative 的元素。

