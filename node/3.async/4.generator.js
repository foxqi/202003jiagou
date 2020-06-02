//generator 生成器 =》 遍历器(需要有一个next方法)=》 数组 =》  类数组 长的像数组？



// const likeArray = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 };
// likeArray[Symbol.iterator] = function () {
//     let i = 0;
//     return { // 遍历器
//         next:()=>{
//             return {value:this[i],done:i++ === this.length}
//         }
//     }
// }

// “元”编程 自己改写js 原因的功能
// 有* 表示是generator函数

// likeArray[Symbol.iterator] = function * () { // generator 函数可以生产遍历器
//     let i = 0;
//     while(i !== this.length){ // generator 固定语法 yield 必须要配合着*来使用
//         yield this[i++];
//     }
// }
// 原理就是遍历这个对象 将结果放到数组中，这个数据必须得有个遍历器. [...new Set()] for of
// [...likeArray]  / Array.from(likeArray);//这个直接可以遍历出数组
// console.log( [...likeArray])

// 普通函数默认会从头到尾执行没有暂停的功能
// generator函数是es6提供的语法，如果碰到yield 就会“暂停”执行 （redux-sage,koa1中）
// function * read() {
//     yield 1;
//     yield 2;
//     yield 3;
// }
// let it = read(); // it就是迭代器，迭代器上有个next方法
// let flag = false;
// do{
//     let {value,done} = it.next();
//     console.log(value);
//     flag = done;
// }while(!flag);
// console.dir(it.next()); // { value: 1, done: false }
// console.dir(it.next()); // { value: 2, done: false }
// console.dir(it.next()); // { value: 3, done: false }
// console.dir(it.next()); // { value: undefined, done: true }
// console.dir(it.next()); // { value: undefined, done: true }




// function * read(value){
//     let a = yield 1;
//     console.log(a);
//     let b = yield 2;
//     console.log(b);
//     let c = yield 3;
//     console.log(c);
//     return c
// }
// // 蛇形执行，除了第一次之外的next方法 ，都是把next中的参数传递给上一次yield的返回结果
// let it = read(123);
// it.next(); // 第一次的next传递参数没有任何意义
// it.next('2');
// it.next('3');
const fs = require('fs').promises;

function * read(){ // 代码编写更像是同步的 （执行还是异步的）
    let name = yield fs.readFile('name.txt','utf8');
    let age = yield fs.readFile(name,'utf8');   // async - await
    return age
}
// 优化这段代码  tj
const co = it =>{
    return new Promise((resolve,reject)=>{
        // 异步迭代靠的是 回调函数
        function next(data){
            let {value,done} = it.next(data);
            if(!done){
                // 默认成功后会调用next方法 将结果传递到next函数中
                Promise.resolve(value).then(next,reject);
            }else{
                resolve(value);
            }
        }
        next();
    });
}
co(read()).then(data=>{
    console.log(data);
}).catch(err=>{
    console.log(err)
})



// async + await = generator + co
// async await 替换掉了generator 和 co 默认async 函数执行后返回的就是一个promise


// let it = read();
// let {value,done} = it.next();
// value.then(data=>{
//     let {value,done} = it.next(data);
//     value.then(data=>{
//         // it.throw('error')
//         let {value,done} = it.next(data);
//         console.log(value)
//     })
// })


// read().then(data=>{
//     console.log(data)
// })