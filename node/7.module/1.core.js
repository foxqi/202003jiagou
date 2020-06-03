const fs = require('fs');
const path = require('path');

// 所有的方法基本上都是同步方法、异步方法
// 同步：如果刚刚运行程序可以去使用同步的方法
// 异步：开启一个服务监听客户端访问，就需要使用异步了  异步是非阻塞的 

// 操作文件时 尽量使用"绝对路径"来进行操作
// 获取当前的目录 process.cwd() 可变的  __dirname 不可变的

// __dirname 代表的是当前文件所在的文件夹，__dirname并不属于global，每个模块独有的
console.log(path.resolve(__dirname,'./name.txt','./')); // resolve不能遇到/
console.log(path.join(__dirname,'./name.txt','./')); // 拼接
console.log(path.extname('a/b/a.min.js')); // 获取当前路径的扩展名

// 1.同步判断文件是否存在
const exists = fs.existsSync(path.resolve(__dirname,'..','name.txt'));
// 2.同步的读取文件
const r = fs.readFileSync(path.resolve(__dirname,'..','name.txt'),'utf8');


// 虚拟机模块 (沙箱) 干净的环境  测试用例
// 内部一般情况下操作的都是字符串逻辑，如何让一个字符串来运行  `console.log(1)`

// eval默认会取当前的作用域下的变量，不干净的环境 eval()
const a = 100;
let fn = new Function('c','b','d',`let a =1;console.log(a)`); // 可以使用new Function 来创建一个沙箱环境，让字符串执行
console.log(fn());

// 模板引擎的实现原理 with语法 + 字符串拼接 + new Function来实现

const vm = require('vm'); // 虚拟机模块 可以创建沙箱环境
vm.runInThisContext(`console.log(a)`);


