---
title: CSS自适应
date: 2019-04-27 22:38:41
tags: 计算机网络
categories: 
- 计算机网络
---
# CSS自适应方案

### PC端

设计稿横向分辨率⼀般为2560px
#### 百分比+固定值+媒体查询
##### 百分比：

图⽚，⽐例分割明显的区域块
背景图⽚及懒加载图⽚需要定⾼(如下所说用padding实现自适应)

##### 固定值：

内容区域定宽，如specs⻚⾯

##### 媒体查询：

根据情况进⾏布局的微调
注意!!:
尽量控制变化的范围，只有在不得已的情况下才进⾏布局的微调，不要对⻚⾯中太多的地⽅做响
应式，因为可以变化的地⽅越多，不仅成倍增加设计和前端的⼯作量，⽽且对⻚⾯的⻛格也更加
难以把握，容易出⼒不讨好
优先适配最常⻅的分辨率，⽐如1366,1440,1920,2560 

**设计单位使用em,因为我们对每个页面是按照section进行划分,通过js脚本控制屏幕尺寸的大小**:

```js
window.onresize = ($('section') => {
    $('section').css({
        font-size: window.screenWidth/2560 * 100px
    })
})
```

这样只要页面发生缩小或者扩大,由于em是基于section(父节点)的字体大小进行变化的,所以不会有太多问题

#### M端

设计稿横向分辨率⼀般为1080px (针对苹果的3倍屏幕)

设计稿横向分辨率/设备逻辑像素 = 实际根元素font-size/设备逻辑像素对应的根元素

本项⽬以逻辑像素360px的设备为基础，设置其根元素font-size为16px；

720px设计稿： 720/360 = 32/16

1080px设计稿： 1080/360 = 48/16

⽬前多数设计稿横向分辨率为1080px

若设计稿中⼀元素为200px 宽

实际写法： width：（200/48） rem 

##### 几处注意点

- ⽂字区域不定⾼，⽂档流撑开，设置边距 

- 背景图⽚上的⽂字，计算出⽂字区域占背景图的高度占⽐ (然后在区域块中实现垂直居中)

- 尽量不要⽤float进⾏布局，使⽤inline-block或者flex实现多个div并⾏ 

--使⽤flex使四个在同⼀⾏的div始终保持相同的⾼度 

--使⽤display:inline-block实现多个div在同⼀⾏ 

### 使用padding代替高度实现背景图片高度按比例自适应

#### 问题

将高度设置成百分比时，其高度是基于父元素来定的，设置成50%，就是将该元素高度设置成 父元素的高度值 x 50%。但是将高度设置成百分比时，往往是不生效的！高度依然为0，这是为啥?

#### 原因

道理很简单，那就是父元素的高度也为0。所以这就需要讲到浏览器对宽度及高度是如何计算的。浏览器在计算有效宽度时会考虑浏览器窗口的宽度，如果没有设置绝对宽度，就会自动将页面内容横向平铺填满整个窗口。然而浏览器并不计算内容的高度，除非内容超过了视窗高度，形成滚动条。或者给页面设置一个绝对高度，不然的话，浏览器就会将内容按文档流往下堆砌，也就是高度值为缺省值 auto。所以如果基于缺省值 auto 来设置百分比高度的话，必定是无效高度。显然只需要给父元素指定一个绝对高度，就没什么问题了。可是在实际应用当中，高度通常都不是固定的，不会把高度写死,所以需要用**padding代替高度**

内边距，顾名思义就是元素边框与元素内容之间的空白区域。所以内边距越来越大时，元素的高度也会不断增大。

设想一下，如果一个元素的内容为空，内边距的高度，是不是就是该元素的高度呢？

答案是必须的！

那么我们是不是可以，将高度替换为内边距，并且以百分比设置它的值呢？

答案也是必须的！

这里可能有些朋友会有疑问了，如果设置成百分比的话，一样是基于父元素成百分比的呀？对，没错，是基于父元素，但是 `内边距 padding 是基于父元素的宽度的百分比的内边距`注意重点是 `基于宽度` ！

#### 使用场景

在页面中添加图片时，如果希望图片的宽高自适应的话，通常只需要将图片的宽度设置成百分比即可 (img 标签自身就是按比例缩放图片)，就是当你不能使用 img 标签的时候(使用 div 标签，以背景图片的形式加入图片)，又该怎么办呢？接下来咱们就用 padding 去实现这个需求。

本文案例中使用了一张 640x400 的图片，宽高比就是 1.6

假设将图片的宽度设置为 50%，那么图片的高度就是 50% / 1.6 = 31.25%

所以图片的高度按比例缩放就是 `基于父元素宽度的 31.25%`

我们也可以用SCSS中的宏:

```css
@mixin pth($height: 1440, $width: 2560) {
    height: 0;
    padding-bottom: percentage($height/$width);
}
```

### CSS文字渐变的几种方式

#### 1.background-cli、 text-fill-color

```css
.gradient-text-one{  
    background-image:-webkit-linear-gradient(bottom,red,#fd8403,yellow); 
    -webkit-background-clip:text; 
    -webkit-text-fill-color:transparent; 
}
background: -webkit-linear-gradient(...) 为文本元素提供渐变背景。
webkit-text-fill-color: transparent 使用透明颜色填充文本。
webkit-background-clip: text 用文本剪辑背景，用渐变背景作为颜色填充文本。
```

#### 2.mask-image

```css
.gradient-text-two{
   color:red;
}
.gradient-text-two[data-content]::after{
    content:attr(data-content);
    display: block;
    position:absolute;
    color:yellow;
    left:0;
    top:0;
    z-index:2;
    -webkit-mask-image:-webkit-gradient(linear, 0 0, 0 bottom, from(yellow), to(rgba(0, 0, 255, 0)));
}
```

