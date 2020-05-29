// 返回的不是普通值，并且里面调用的不是普通值

let Promise= require('./promise')

let p=new Promise((resolve,reject)=>{
    resolve(1)
})
let promise2=p.then((data)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Promise((resolve,reject)=>{
                setTimeout(() => {
                    resolve(2000)
                }, 1000);
            }))
        },1000);
    })
})
promise2.then((data)=>{
    console.log(data,'成功****');
    
},err=>{
    console.log(err,'fail');
    
})




