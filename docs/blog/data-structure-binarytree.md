---
title: 二叉树
date: 2019-04-29 21:49:23
tags:
---
## 二叉树遍历

二叉树:即每个节点最多有两个子树的树状结构

二叉查找树,二叉排序树,二叉搜索树:左节点<根节点<右节点的数据结构

基本二叉树的构造函数

```javascript
function Node(val) {
    this.left = this.right = null
    this.val = val
}
```

模拟二叉树数据(node1是根节点)

```javascript
var node4 = {left: null, right: null, val: 4 }; 
var node5 = {left: null, right: null, val: 5 }; 
var node6 = {left: null, right: null, val: 6 }; 
var node7 = {left: null, right: null, val: 7 };
var node3 = {left: node6, right: node7, val: 3 };
var node2 = {left: node4, right: node5, val: 2 };
var node1 = {left: node2, right: node3, val: 1 };
实际结构如下:
//     1
//    /\
//   2  3
//  /\  /\
// 4 5 6  7
```

### 1.前序遍历

#### 递归实现

```javascript
function qianxubianli(node) {
    if(!node) {
    	return
    }
    console.log(node.val)
    node.left&&qianxubianli(node.left)
    node.right&&qianxubianli(node.right)
}
qianxubianli(node1)
```

#### 迭代实现

```javascript
function qianxubianli(node) {
    if(!node) {
        return
    }
    var stack = [node]
    while(stack.length > 0) {
        var item = stack.shift()
        console.log(item.val)
        if(item.right) {
            stack.unshift(item.right)
        }
        if(item.left) {
            stack.unshift(item.left)
        }
    }
}
qianxubianli(node1)
```

### 2.中序遍历

#### 递归实现

```javascript
function zhongxubianli(node) {
    if(!node) {
        return
    }
    node.left && zhongxubianli(node.left)
    console.log(node.val)
    node.right && zhongxubianli(node.right)
}
zhongxubianli(node1)
```

#### 迭代实现

```javascript
function zhongxubianli(node) {
    if(!node) {
        return
    }
    var stack = [node]
    while(stack.length) {
        var item = stack[stack.length-1]
        if(!item.left || (item.left && item.left.isOk)) {
            stack.pop()
            item.isOk = true
            console.log(item.val)
            item.right && stack.push(item.right)
        } else if(item.left && !item.isOk) {
            stack.push(item.left)
        }
    }
}
```

### 3.后序遍历

#### 递归实现

```javascript
function houxubianli(node) {
    if(!node) {
        return
    }
    node.left && houxubianli(node.left)
    node.right && houxubianli(node.right)
    console.log(node.val)
}
houxubianli(node1)
```

#### 迭代实现

```javascript
function houxubianli(node) {
    var stack = [node];
    while (stack.length > 0) {
        var item = stack[stack.length - 1];
        //满足这些就可以直接输出它了。它是叶子节点。或它的子节点都ok了。
        if ((item.left == null && item.right == null) || (item.left && item.left.isOk && item.right && item.right.isOk) || (item.left && item.left.isOk && item.right == null) || (item.left == null && item.right && item.right.isOk)) {
            item.isOk = true;
            console.log(item.val);
            stack.pop();
        } else if (item.left && !item.left.isOk) {
            //如果左边的没ok，就把左边的入栈
            stack.push(item.left);
        } else if (item.right && !item.right.isOk) {
            //如果右边的没ok就把右边的入栈。
            stack.push(item.right);
        }
    }
}
```

### 4.层次遍历

```javascript
 function cengcibianli(node) {
     if(!node) {
         return
     }
     let stack = [node]
     while(stack.length) {
         var newarr = []
         for (let i = 0; i < stack.length; i++) {
             let element = stack[i]
             console.log(element.val)
             if(element.left) {
                 newarr.push(element.left)
             }
             if(element.right) {
                 newarr.push(element.right)
             }
         }
         stack = newarr 
     }
 }
cengcibianli(node1)
```

### 总结

- 二叉树的深度优先遍历的非递归的通用做法是采用栈，广度优先遍历的非递归的通用做法是采用队列。
- 深度优先对每一个可能的分支路径深入到不能再深入为止,先序遍历、中序遍历、后序遍历属于深度优先。
- 广度优先又叫层次遍历，从上往下，从左往右（也可以从右往左）访问结点，访问完一层就进入下一层，直到没有结点可以访问为止。


