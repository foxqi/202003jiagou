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
/**
 * 取值时实现代理效果
 *  // 为了让用户更好的使用，我希望可以直接vm.xx。vm直接取值
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
export function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}


