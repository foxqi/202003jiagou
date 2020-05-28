let fs=require('fs');
let Promise= require('./promise')

let p1=new Promise((resolve,reject)=>{
    resolve(100)
})
let p2=p1.then((data)=>{
    throw new Error()
},err=>{
    return '失败'
})
p2.then((data)=>{
    console.log(data,'****');
    
},err=>{
    
})




