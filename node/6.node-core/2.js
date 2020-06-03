// node和前端的区别 前端里面有dom bom 服务端中没有widnow

// 服务端中有global属性  全局对象
// console.log(Object.keys(global));

// process 进程（重要）
// Buffer 类型来处理二进制文件
// clearInterval、clearTimeout
// setInterval、setTimeout
// clearImmediate、setImmediate 宏任务


// 浏览器以前的方法 还是可以使用的只是默认没有被枚举出来
// console.dir(global,{showHidden:true})



// 1.process 默认取值时会像global中查找 (node中有一个模块化系统，是以文件为单位的，每个文件都是一个模块，模块中的this被更改了   {});

// (1)console.log(process.platform); // 可以用这个属性来判断当前执行的系统环境  win32 darwin

// (2)console.log(process.argv); // 1.node.exe  2.node当前执行的文件 （解析用户自己传递的参数）
// 执行node文件 node 文件名 a b c d  (webpack --mode --config --port --progress)

// let args = process.argv.slice(2);
// [ '--port', '3000', '--color', 'red', '--config', 'a.js' ]

// let obj = {}
// args.forEach((item,index) => {
//     if(item.startsWith('--')){
//         obj[item.slice(2)] = args[index+1]
//     }
// });
// console.log(obj);
// (commander TJ) (yargs webpack)  npm  github


// 在npm上的模块都需要先安装在使用 (模块内部也提供了几个属性，也可以在模块中直接访问 - 参数)
const program = require('commander');
// program.version('1.0.0')
//     .command('create').action(()=>{
//         console.log('创建项目')
//     })
//     .name('node')
//     .usage('my-server')
//     .option('-p,--port <v>', 'set your port')
//     .option('-c,--config <v>', 'set your config file')
//     .parse(process.argv); // -- 开头的是key  不带--是值


// 当用户在哪执行node命令时 就去哪找配置文件  webpack
// console.log(process.cwd()); // 当前用户的工作目录 current working directory  (这个目录可以更改，用户自己切换即可 )
// console.log(__dirname); // 当前文件的所在的目录 这个目录是不能手动修改的

// console.log(process.env.b); // 环境变量  可以根据环境变量实现不同的功能
// window set key=value  mac export key=value  这样设置的环境变量是临时的变量

// let domain = process.env.NODE_ENV === 'production'? 'localhost':'zfpx.com';

// (1)node中自己实现的微任务  nextTick / queueMicrotask
// console.log(process.nextTick);

// (2)node中setImmediate 宏任务

// 常见面试题 node中的事件环和浏览器中的区别
// 微任务有哪些 宏任务有哪些

// 浏览器的事件环和node事件环 执行效果现在是一致的了

setImmediate(() => {
    console.log('setImmediate')
    setTimeout(() => { // 进入事件环时 setTimeout 有可能没有完成
        console.log('timeout')
    }, 1000);
});


// const fs = require('fs');
// // poll 完成后 setImmediate -> setTimeout
// fs.readFile('./name.txt',()=>{
//     setTimeout(() => { // 进入事件环时 setTimeout 有可能没有完成
//         console.log('timeout')
//     }, 0);
//     setImmediate(() => {
//         console.log('setImmediate')
//     });
// })

// process.nextTick 并不属于事件环的一部分  在本轮代码执行后执行 

setTimeout(() => {
    console.log(1);
    Promise.resolve().then(()=>{
        console.log('then')
    })
    process.nextTick(()=>{
        console.log('nextTick')
    })
}, 0);
setTimeout(() => {
    console.log(2);
}, 0);


// vue的源码 nextTick 方法 描述了浏览器中常见的 宏任务和微任务

// 宏任务 script / ui / setTiemout / setInterval /requestFrameAnimation / setImmediate / MessageChannel  异步的  click  ajax

// 语言的本身提供的 promise.then mutationObserver nextTick
