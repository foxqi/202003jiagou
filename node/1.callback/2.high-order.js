
// 函数柯里化  函数反柯里化



// 判断变量的类型
// 常用的判断类型的方法有四种
// 1.typeof  不能判断对象类型 
// 2.constructor  可以找到这个变量是通过谁构造出来的
// 3.instanceof  判断谁是谁的实例 __proto__
// 4.Object.prototype.toString.call()  缺陷就是不能细分是谁谁的实例


// function isType(value,type){
//     return Object.prototype.toString.call(value)===`[object ${type}]`;
// }
// console.log(isType([],'Array'));


// 能不能将方法进行细分  isType => isString  isArray
// 把上面的范围变成一个小的范围
// function isType(type){
//     return function(value){
//         return Object.prototype.toString.call(value)===`[object ${type}]`;
//     }
// }
// let isArray = isType('Array');
// console.log(isArray('hello'));
// console.log(isArray([]));



function isType(type,value){
    return Object.prototype.toString.call(value)===`[object ${type}]`;
}
const currying=(fn,arr = []) =>{
    let len = fn.length;//拿到函数的参数个数
    return function(...args){//高阶函数      
        arr=[...arr,...args];
        if(arr.length<len){
            return currying(fn,arr);//递归不停的产生函数
        }else{
            return fn(...arr);
        }
    }
}
let isArray = currying(isType)('Array');
let isString = currying(isType)('String');

console.log(isArray([]));
console.log(isString('123'));

// function sum(a,b,c,d,e,f){
//     return a+b+c+d+e+f
// }
// let r = sum(1,2)(3,4)(5)(6)
