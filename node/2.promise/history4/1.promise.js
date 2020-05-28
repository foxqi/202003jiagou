let Promise= require('./promise')

let p=new Promise((resolve,reject)=>{
    resolve(1)
})
let promise2=p.then((data)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            reject('错误')
        },1000);
    })
})
promise2.then((data)=>{
    console.log(data,'成功****');
    
},err=>{
    console.log(err,'fail');
    
})




