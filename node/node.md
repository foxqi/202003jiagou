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
```javascript
// 观察者模式  有观察者  肯定有被观察者  观察者需要放到被观察者中，被观察者的状态发生变化需要通知观察者，我变化了

// 内部也基于发布订阅模式，  收集观察者  状态变化后要通知观察者

class Subject{//被观察者  小宝宝
    constructor(name){
        this.name=name;
        this.state ='开心的';
        this.observers =[];
    }
    attach(o){
        this.observers.push(o);
    }
    setState(newState){
        this.state=newState;
        this.observers.forEach(o=>o.update(this))
    }
}

class Observer{//观察者  我  我媳妇
    constructor(name){
        this.name = name
    }
    update(baby){
        console.log('当前'+this.name+'被通知了','当前宝宝的状态是'+baby.state);    
    }
}

// 我和我媳妇  需要观察小宝宝的心里状态的变化
let baby = new Subject('小宝宝');
let parent = new Observer('爸爸');
let mother = new Observer('妈妈');
baby.attach(parent)
baby.attach(mother)
baby.setState('被欺负了')
```
#### 5.promise
- https://promisesaplus.com/ 这个网址有   promiseA+ 规范，都是通过这个规范来实现的
- promise  es6 内部已经实现了。ie不支持promise，需要polyfill  es6-promise

- promise 为什么会产生  解决异步问题
  - 1.解决多个异步请求并发  （希望同步最终的结果） Promise.all
  - 2.链式异步请求的问题，上一个人的输出是下一个人的输入  Promise的链式调用可以解决这个问题
  - 3.缺陷：还是基于回调的
- promise的特点 ：promise就是一个类
- 1.promise 有三个状态：成功态（resolve）  失败态（reject） 等待态（pending又不成功又不失败）
- 2.用户自己决定失败的原因和成功的原因 ，成功和失败也是用户定义的
- 3.promise默认执行器时立即执行
- 4.promise的实例都拥有一个then方法，一个参数是成功的回调，另一个是失败的回调
- 5.如果执行函数时发生了异常也会执行失败逻辑
- 6.如果promise一旦成功就不能失败，反过来也是一样的


// 1.promise 成功和失败的回调的返回值  可以传递到外层的下一个then
// 2.如果返回的是普通值的话（传递到下一次的成功中，不是错误不是promise就是普通值），出错的情况（一定会走到下一次的失败），可能还要promise的情况（会采用promise的状态，决定走下一次的成功还是失败）
// 3.错误处理  如果离自己最近的then  没有错误处理  会向下找
// 4.每次执行完promise.then方法返回的都是一个“新的promise”（promise一旦成功或失败就不能修改状态）

// Promise.resolve();//快速创建一个成功的promise
// Promise.reject();//快速的创建一个失败的promise
// 区别在于resolve会等待里面的promise执行完毕  reject  不会有等待效果(Promise.reject() 已经报错了 就直接走到catch了)

// finally表示不是最终的意思，而是无论如何都会执行的意思
// 如果返回一个promise 会等待这个promise  也执行完毕  （如果是失败的promise  会用他的失败原因传给下一个人）

//all 全部成功才成功