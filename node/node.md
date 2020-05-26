# node

#### 1.什么是高阶函数(1.callback\1.high-order.js)
- 1。如果一个函数的参数是一个函数（回调函数就是一种高阶函数）
- 2.如果一个函数返回一个函数，当前这个函数也是一个高阶函数

#### 2.判断变量的类型(1.callback\2.high-order.js)
- 常用的判断类型的方法有四种
  - 1.typeof  不能判断对象类型 
  - 2.constructor  可以找到这个变量是通过谁构造出来的
  - 3.instanceof  判断谁是谁的实例 __proto__
  - 4.Object.prototype.toString.call()  缺陷就是不能细分是谁谁的实例

#### 3.柯理化函数(1.callback\2.high-order.js)
- 是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术
- 其实就是高阶函数的一个特殊用法
```javascript
function isType(type,value){
    return Object.prototype.toString.call(value)===`[object ${type}]`;
}
const currying=(fn,arr = []) =>{
    let len = fn.length;//拿到函数的参数个数
    return function(...args){//高阶函数      
        arr=[...arr,...args];
        if(arr.length<len){
            return currying(fn,arr);//递归不停的产生函数
        }else{
            return fn(...arr);
        }
    }
}
let isArray = currying(isType)('Array');
let isString = currying(isType)('String');

console.log(isArray([]));
console.log(isString('123'));

// function sum(a,b,c,d,e,f){
//     return a+b+c+d+e+f
// }
// let r = sum(1,2)(3,4)(5)(6)
```
#### 4.发布订阅
- 发布订阅模式  主要分成两个部分  on  emit
- on 就是把一些函数维护到一个数组中
- emit 就是让数组中的方法依次执行
