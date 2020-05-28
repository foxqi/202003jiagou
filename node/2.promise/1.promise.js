let Promise= require('./promiseme')

let p=new Promise((resolve,reject)=>{
    resolve(1)
})

p.then().then().then((data)=>{
    console.log(data,'成功****');
    
},err=>{
    console.log(err,'fail');
    
})




