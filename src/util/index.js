// 工具库
/**
 * 
 * @param {*} data  当前数据是不是对象
 */

export function isObject(data){
    return typeof data === 'object' && data !==null
}
/**
 * 给对象增加属性
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function def(data,key,value){
    Object.defineProperty(data,key,{
        enumerable:false,
        configurable:false,
        value:value
    })
}


