// promise  可以解决的问题  1.函数嵌套的问题  .then.then  2.可以同步多个异步请求的结果


const fs = require('fs');
const promisify = fn=>(...args)=>new Promise((resolve,reject)=>{
    fn(...args,function(err,data){
        if(err) reject(err)
        resolve(data);
    })
})
let read = promisify(fs.readFile);
// 将node的api   快速的转换成  promise的形式

read('name.txt','utf8').then((data)=>{
    console.log(data);  
})







