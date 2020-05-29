// promise的链式调用
let Promise= require('./promiseme')

let p=new Promise((resolve,reject)=>{
    reject(1)
})

p.then().then().then((data)=>{
    console.log(data,'成功****');
    
},err=>{
    console.log(err,'fail');
    
})




