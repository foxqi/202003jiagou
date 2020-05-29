// promise 的特点以及概念
// https://promisesaplus.com/ 这个网址有   promiseA+ 规范，都是通过这个规范来实现的
// promise  es6 内部已经实现了。ie不支持promise，需要polyfill  es6-promise

// promise 为什么会产生  解决异步问题
//1.解决多个异步请求并发  （希望同步最终的结果） Promise.all
// 2.链式异步请求的问题，上一个人的输出是下一个人的输入  Promise的链式调用可以解决这个问题
// 3.缺陷：还是基于回调的


// 1.promise 有三个状态：成功态（resolve）  失败态（reject） 等待态（pending又不成功又不失败）
// promise就是一个类
// 2.用户自己决定失败的原因和成功的原因 ，成功和失败也是用户定义的
// 3.promise默认执行器时立即执行
// 4. promise的实例都拥有一个then方法，一个参数是成功的回调，另一个是失败的回调
// 5.如果执行函数时发生了异常也会执行失败逻辑
// 6.如果promise一旦成功就不能失败，反过来也是一样的


// 1.promise调用then方法时可能当前的promise并没有成功  pending
// 2.发布订阅模式，如果当前状态是pending时，我们需要将成功的回调和失败的回调存放起来，稍后调用resolve和reject的时候重新执行
let Promise=require('./promise')
let promise = new Promise((resolve,reject)=>{
    // throw new Error('失败了')
    // resolve('成功了')
    // reject('失败')

    setTimeout(()=>{
        reject('不成功')
    },1000)
});
promise.then((data)=>{
    console.log('success1',data);
},(err)=>{
    console.log('faild1',err);
    
})
promise.then((data)=>{
    console.log('success2',data);
},(err)=>{
    console.log('faild2',err);
    
})

// promise连续调用如何执行代码





