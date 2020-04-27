import { observe } from './observe/index.js'
import {proxy} from './util/index.js'
export function initState(vm) {
    const opts = vm.$options;
    //监测的顺序 vue的数据来源  属性  方法  数据  计算属性  watch
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}
function initProps() { }
function initMethod() { }
function initData(vm) {
    //   数据初始化工作
    let data = vm.$options.data;//用户传递的data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // console.log(data);
    // 对象劫持  用户改变了数据  我希望可以得到通知  后可以  刷新页面
    // MVVM模式 数据变化可以驱动视图变化

    //  Object.defineroperty() 给属性增加get方法和set方法


    // 为了让用户更好的使用，我希望可以直接vm.xx。vm直接取值
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data);//1.响应式原理

}
function initComputed() { }
function initWatch() { }