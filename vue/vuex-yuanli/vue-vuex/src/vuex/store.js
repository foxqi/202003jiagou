import applyMixin from './mixin';
import ModuleCollection from './module/module-collection'
import { forEach } from './util';
let Vue;
class Store {
  constructor(options) {
    //console.log(options);//这里获取到用户传来的参数

    // 格式化用户传入的参数，格式化成树形结构  更直观一些，后续也更好操作一些
    this._modules= new ModuleCollection(options);
  
   // let state = options.state;//用户传递过来的状态
    // 如果直接将state定义在实例上，稍后这个状态发生变化  视图是不会更新的
    // defineReactive  => vue-router 只定义了一个属性
    // vue中定义数据 属性名是有特点的 如果属性名是通过 $xxx命名的  他不会被代理到vue的实例上

    // getters:其实写的是方法，但是取值的时候是属性
    // this.getters = {};
    // const computed = {};
    // forEach(options.getters, (fn, key) => {
    //   computed[key] = () => {//通过计算属性  实现懒加载
    //     return fn(this.state)
    //   }
    //   Object.defineProperty(this.getters, key, {
    //     get: () => this._vm[key]
    //   })
    // })
    // defineProperty去定义这个属性


    // this._vm = new Vue({
    //   data: {//内部的状态
    //     $$state: state
    //   },
    //   computed //计算属性会将自己的属性放到实例上 
    // });

    // 发布订阅模式  将用户定义的mutation 和 action 先保存起来，稍后 当调用commit时  就找订阅的mutation方法，调用dispatch 就找对应的action方法
    // this._mutations = {};
    // forEach(options.mutations, (fn,type) => {
    //   this._mutations[type] = (payload) => fn.call(this, this.state, payload)
    // })
    // this._actions = {};
    // forEach(options.actions, (fn, type) => {
    //   this._actions[type] = (payload) => fn.call(this, this, payload)
    // })
  }
  commit = (type, payload) => {
    this._mutations[type](payload)
  }
  dispatch = (type, payload) => {
    this._actions[type](payload)
  }
  // 类的属性访问器，当用户去这个实例上去state属性时  会执行此方法
  get state() {
    return this._vm._data.$$state
  }
}
// 这个install的用法是Vue.use(Vuex)这个的
const install = (_Vue) => {
  Vue = _Vue;
  //   console.log('install'); //vue-router  调用install目的？  注册了全局组件  组件原型方法  mixin=>router实例绑定给了所有的组件
  applyMixin(Vue)
}

export {
  Store,
  install
}
