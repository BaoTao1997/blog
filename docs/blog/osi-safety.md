---
title: Web安全
date: 2019-04-27 22:38:41
tags: 计算机网络
categories: 
- 计算机网络
---

# Web安全

本文将会针对前端一些常见的网络攻击方式，以及Cookies做一些讲解。

## XSS

### 例子

输入网址，通过在url参数中添加js脚本实现xss攻击，这会被用来**获取页面上的数据**，**获取Cookie**，**劫持前端逻辑**，**发送请求**（通过`<img src=''>`src指向自己的PHP脚本执行逻辑）

### 类型

反射型XSS：url参数注入（html属性和内容）

存储型XSS：会把数据提交到数据库中（评论列表，富文本）

### HTML内容

```html
<div>
    #{content}
</div>
<div>
    <script></script>
</div>
```

我们需要对`<`和`>`进行转义，保证其不会执行

### HTML属性

```html
<img src="#{image}">
<img src="1" onerror="alert(1)"> // 提前添加“或者‘使得src属性闭合，执行别的逻辑
```

我们需要转义单引号和双引号，我们这个和上面的转义并不冲突，所以可以放在一起，记住转义为HTML实体都有`&`，所以我们需要先对`&`进行转义，再进行其他转义,代码如下：

```js
var escapeHtml = function(str) {
    if(!str) return '';
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quto;');
    str = str.replace(/'/g, '&#39;');
    return str;
}
```

>注意：浏览器本身有自带的防御措施，ctx.set('X-XSS-Protection', 0); 设为0会关闭，默认值为1则打开，可以防止url参数出现HTML属性和内容，不过防范还是很有限，只能阻止HTML内容。

### Javascript 代码

```js
<script>
    var data = "#{data}";
	var data = "hello";alert(1)"";
</script>
```

产生原因也是因为双引号，对此也可以采用转义的方式，但是这会导致代码出现不需要的`\\`。如下：

```js
var escapeForJs = function(str) {
    if(!str) return '';
    str = str.replace(/"/g, '\\"')
}
```

所以我们可以采用`JSON.stringfy()`来进行转义。

### 富文本

特点：**需要保留HTML，但HTML有XSS风险**

#### 黑名单

黑名单是禁止某些HTML内容，问题在于HTMl标签体系繁多，很容易出现漏洞：

```js
var xssFliter = function(html) {
    if(!html) return '';
    html = html.replace(/<\s*\?script\s*>/g, ''); // 防止<script>标签
    html = html.replace(/javascript:[^'"]*/g, '');  //防止a标签的herf属性的javascript：
    html = html.replace(/onerror\s*=\s*['"]?[^'"]*['"]?/g, ''); // 防止onerror事件
    return html
}
```

#### 白名单

所以大部分时候是采用，白名单的方式，可以使用[cheerio](https://github.com/cheeriojs/cheerio)或者[js-xss](https://github.com/leizongmin/js-xss)，配置那些HTML内容可以执行，是需要自己可控，还是想快速简单，可以按照场景进行选择。下面是[cheerio](https://github.com/cheeriojs/cheerio)的使用方式：

```js
var whiteList = {
    'img': ['src'],
    'font': ['color','size'],
    'a': ['herf']
}
$('*'),froEach(function(index,item) {
    if(!whiteList[item.name]) {
        $(item).remove();
        return
    }
    for(var attr in item.attribs) {
        if(whiteList[item.name].indexOf(attr) === -1) { //不是白名单中的属性则去除
            $(item).attr(attr, null)
        }
    }
})
```

#### CSP

要启用CSP，您需要配置Web服务器以返回[`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)HTTP标头（有时您会看到`X-Content-Security-Policy`标题的提及，但这是旧版本，您不再需要指定它）。

或者，该[``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)元素可用于配置策略，例如：`<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">`

具体内容可以参考[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## CSRF

CSRF攻击原理：

1. 用户登录A网站
2. A网站确认身份
3. B网站页面向A网站发起请求（带A网站的身份）

### 禁止第三方网站带Cookies

CSRF攻击需要携带用户的Cookies来通过验证，采用`SameSite`属性即可实现阻止Cookies被第三方网站使用，在`node.js`中可以采用如下形式：

```js
ctx.cookies.set('userId', user.id, {
   sameSite: 'strict'
})
```

不过这个[属性的支持程度不高](https://www.caniuse.com/#search=SameSite)，所以只能作为辅助办法。

### 不访问A网站的前端

由于CSRF攻击不会访问A网站的前端，我们可以在前端加入验证信息，目前有两种方式：

#### 验证码

我们可以使用npm上的[ccap](https://www.npmjs.com/package/ccap)，具体使用方式如下：

```js
var captcha = {};
var cache = {};
captcha.captcha = async function(ctx, next) {
    var ccap = require('ccap');
    var capt = ccap();
    var data = capt.get();
    
    captcha.setCache(ctx.cookies.get('userId'), data[0]); // data[0]为验证码数字
    ctx.body = data[1];//data[1]为验证码图片
}
captcha.setCache = function(uid, data) { //访问页面时设置验证码
    cache[uid] = data;
}
captcha.validCache = function(uid, data) { 
    //CSRF攻击是验证码是空的，正常页面用户会输入验证码通过表单提交与后台存储的进行比对验证
    return cache[uid] === data;
}
module.exports = captcha;
```

在添加评论的模块中引入，在前端添加一个输入验证码的input框`<input name="captcha" placeholder="验证码" /><img src="/captcha">`注意要判断**验证码为空**的情况：

```js
if(!data.captcha) {
    throw new Error('验证码错误');
}
var captcha = require('captcha'); //引入上面的captcha文件
var captchaResult = captcha.validCache(ctx.cookies.get('useId'), data.captcha);
if(!captchaResult) {
    throw new Error('验证码错误');
}
```

#### token

后端生成一个随机的token，需要放到两个地方：1. 放到页面的表单中(*使用一个隐藏的input框*） 2. 放到浏览器的Cookies中(*或者后端的session中*)。

用户添加评论时，会把表单中Token与Cookies的Token进行比对(*如果是存在session中，则与session进行比对*)，由于CSRF无法获取到原网站页面上的Token，同时无法改变Cookies的Token(通过设置**HttpOnly**属性)，所以无法通过。

如果你是Ajax请求的话，可以使用`<meta name="csrf_token" content="csrfToken">`，通过Ajax请求时通过JS获取meta中的值。

如果用户打开多个页面的话，其他的页面的token失效，因为每次都会生成一个随机的token，只有最后一个页面能够成功。

#### referer

通过`referer`请求头来判断请求的域名是否是合法的，如果不是则抛出错误

## Cookies

特点

- 前端数据存储，后端通过HTTP头设置，请求时通过HTTP头传给后端，前端可读写，遵守同源策略

特性

- 域名(domain)，有效期(expires)，路径(path)，http-only(不能通过js获取)，secure(只能在https中使用)，sameSite(禁止第三方的Cookies)

```js
document.cookie = 'a=111;' // 只是添加Cookies
var now = new Date();
document.cookie = `a=111; expires=${now.toGMTString()}` // 只能通过设置expires删除Cookie
```

作用

- 存储个性化设置，未登录时唯一标识，已登录用户凭证，其他相关业务数据

### 已登录用户凭证

直接使用用户名作为登录凭证，存在很大的问题不讨论

将用户名，和通过签名算法加密的用户名作为登录凭证(*不可逆算法*)，后端也对用户名采用同样的算法加密进行比对判断是否为同一用户

SessionId：把sessionid写入到Cookies中，将用户信息存入到服务端(*一般会采用外部存储Redis*)

Token：采用JWT实现,当用户登录时，后端生成一个Token返回前端，前端可以把Token存储到Cookies或者`LocalStorage`中，当用户访问认证的接口时可以在**URL 参数**或 **HTTP Header** 中加入 Token，后端解析Token实现用户的登录鉴权。

而 JWT 的最大优势是服务端不再需要存储 Session，使得服务端认证鉴权业务可以方便扩展，避免存储 Session 所需要引入的 Redis 等组件，降低了系统架构复杂度。

但这也是 JWT 最大的劣势，由于有效期存储在 Token 中，JWT Token 一旦签发，就会在有效期内一直可用，无法在服务端废止，当用户进行登出操作，只能依赖客户端删除掉本地存储的 JWT Token，如果需要禁用用户，单纯使用 JWT 就无法做到了。

#### Token禁用用户

Access Token也就是访问资源接口时所需要的 Token，还有另外一种 Token，Refresh Token，通常情况下，Refresh Token 的有效期会比较长(*7天左右*)，而 Access Token 的有效期比较短(*10分钟左右*)，当 Access Token 由于过期而失效时，使用 Refresh Token 就可以获取到新的 Access Token，如果 Refresh Token 也失效了，用户就只能重新登录了。

**将生成的 Refresh Token 以及过期时间存储在服务端的数据库中**，由于 Refresh Token 不会在客户端请求业务接口时验证，只有在申请新的 Access Token 时才会验证，所以将 Refresh Token 存储在数据库中，不会对业务接口的响应时间造成影响，也不需要像 Session 一样一直保持在内存中以应对大量的请求。

#### 单点登录

CAS：调用登录接口获取key——》前端把key存起来——》带着key调用业务接口——》业务接口拿到key去调用鉴权接口——》鉴权接口返回鉴权结果——》鉴权通过，继续业务逻辑，返回结果；鉴权失败，返回401

## 点击劫持

使用`<iframe>`标签把网站嵌入到页面中，设置透明度为0，在外部覆盖一层图片监听点击事件来发送请求，导致**点击劫持**。

### 通过JS禁止内嵌

```js
if(top.location !== window.location) {
    top.location = window.location; // 实现跳出该劫持网页
}

```

### 通过HTTP头禁止内嵌

因为可以在`<iframe>`中禁止使用JS（利用`sandbox`属性），所以可以使用`X-Frame-Options`设为`DENY`，禁止页面被嵌入`<iframe>`。

## HTTP明文协议

HTTP篡改

- 运营商劫持，局域网代理劫持，公共WIFI获取密码

采用HTTPS并进行部署

- 在[SSL For Free](https://www.sslforfree.com/)申请证书，使用人工DNS查询保证网站的存在
- 下载证书包含CA证书，自己的证书以及私钥
- Node使用HTTPS包开启HTTPS服务，并传入Key和Cert(一个文件，把自己的证书和CA证书--放后面)
- 部署成功后用**AnyProxy**进行代理，会发现HTTPS会用CONNECT建立一个通道，代理是查看不到内容的

## 密码安全

Hash算法

- 一一对应，单向的（无法通过密文得到明文），固定长度，只要有一点修改就会完全不一样
- 有MD5，sha1，sha256这几种加密方式

由于[彩虹表](https://baike.baidu.com/item/%E5%BD%A9%E8%99%B9%E8%A1%A8/689313?fr=aladdin)的存在，实际项目中需要通过把**用户输入的密码加`salt`（随机尽量长的字符串），然后使用多次Hash算法就可以实现**

