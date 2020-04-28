// 工具库
/**
 * 
 * @param {*} data  当前数据是不是对象
 */

export function isObject(data) {
    return typeof data === 'object' && data !== null
}
/**
 * 给对象增加属性
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value: value
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
// 生命周期的钩子
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
];
let strats = {}
function mergeHook(parentVal, childVal) {
    console.log(childVal)
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
/**
 * 实现俩个对象的合并
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {//如果已经合并过了就不需要再次合并了
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }

    }
    // 默认的合并策略  但是有些属性 需要有特殊的合并方式  生命周期的合并
    function mergeField(key) {
        if (strats[key]) {
            return options[key] = strats[key](parent[key], child[key])
        }
        if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        } else if (child[key] == null) {
            options[key] = parent[key];
        } else {
            options[key] = child[key];
        }
    }
    return options
}

