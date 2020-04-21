// 把data中的数据 都使用Object.defineProperty重新定义  这是一个es5的方法
// Object.defineProperty不能兼容ie8及以下，vue2无法兼容ie8版本
export function observe(data){
 console.log(data);
 
}