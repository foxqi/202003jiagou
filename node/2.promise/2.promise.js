// Promise.resolve();//快速创建一个成功的promise
// Promise.reject();//快速的创建一个失败的promise
// 区别在于resolve会等待里面的promise执行完毕  reject  不会有等待效果(Promise.reject() 已经报错了 就直接走到catch了)

// let Promise = require('./promise')
// Promise.resolve(new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve('ok');
//     }, 1000);
// })).then(data=>{
//     console.log(data);
    
// })



// finally表示不是最终的意思，而是无论如何都会执行的意思
// 如果返回一个promise 会等待这个promise  也执行完毕  （如果是失败的promise  会用他的失败原因传给下一个人）
Promise.prototype.finally=function(callback){
    return this.then((value=>{
        return Promise.resolve(callback()).then(()=>value)
    },(reason)=>{
        return Promise.resolve(callback()).then(()=>{throw reason})
    }))
}

Promise.resolve(456).finally(()=>{
    console.log('finally');
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            reject('ok')
        }, 1000);
    })
}).then(data=>{
    console.log(data,'success');
}).catch(err=>{
    console.log(err,'err');
    
})





