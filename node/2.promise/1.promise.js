// 这里编写chatch的原理


const fs=require('fs');
const Promise=require('./promise');

new Promise((resolve,reject)=>{
    reject(1)
}).then((data)=>{
    console.log(data);
}).catch(err=>{
    console.log(err,'---');
    
})




