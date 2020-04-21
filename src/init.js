import {initState} from './state'
// 在原型上添加一个init方法
export function initMixin(Vue){
    Vue.prototype._init =function(options){
    //    数据的劫持
    const vm =this;//vue中使用this.$options 指代
    vm.$options = options;

    // 初始化状态
    initState(vm);//分割代码
    }
}

