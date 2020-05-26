//  多个异步请求  如何同时获取最终结果

let fs = require('fs');//file system
let school = {}
// 简单原理
// let index = 0;
// const cb = () => {
//     if (++index === 2) {
//         console.log(school);
//     }
// }
// 真正写法
function after(times,callback){
    return function(){//闭包函数  函数的定义的作用域和函数执行的作用  不在同一个作用域下
        if(--times ===0){
            callback()
        }
    }
}

let cb=after(2,function(){
    console.log(school)
})

fs.readFile('./name.txt','utf8',function (err, data) {
    school.name = data;
    cb();
})
fs.readFile('./age.txt','utf8', function (err, data) {
    school.age = data;
    cb();
})



