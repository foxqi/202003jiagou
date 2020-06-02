const fs = require('fs').promises;
const isPromise = value => typeof value.then === 'function';
Promise.race = function (promises) {//全部成功才成功
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            let result = promises[i];
            if (isPromise(result)) {
                result.then(resolve, reject)
            } else {
                resolve(result)
            }
        }

    })
}

// race 赛跑  谁跑的快用谁的（多个接口 请求，我希望采用快的那个） 
// Promise.race([fs.readFile('name.txt','utf8'),fs.readFile('age.txt','utf8')]).then((data) => {
//     console.log(data);
// }).catch(err => console.log(err))

// 中断promise  一个promise正在走向成功  3000 之后成功，如果超过2s就认为失败了
// 这是强制中断
// let promise=new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('ok 成功了')
//     },10000)
// })

// const wrap = promise=>{
//     let abort;
//     let myP=new Promise((resolve,reject)=>{
//         abort= reject;
//     })
//     let p = Promise.race([promise,myP]);
//     p.abort=abort;
//     return p;

// }

// let p = wrap(promise);
// p.then(data=>{
//     console.log(data);
// },(err)=>{
//     console.log(err);
    
// })

// setTimeout(() => {
//     p.abort('promise 超时');//中断请求
// }, 2000);



// 这里是链断掉
Promise.resolve(100).then().then(()=>{
    return new Promise((resolve,reject)=>{

    })
}).then(data=>{
    console.log(data);
},err=>{
    console.log(err);
})












