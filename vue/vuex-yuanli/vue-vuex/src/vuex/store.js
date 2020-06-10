import applyMixin from './mixin';

let Vue;
class Store {
  constructor(options) {
    console.log(options);//这里获取到用户传来的参数
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  //   console.log('install'); //vue-router  调用install目的？  注册了全局组件  组件原型方法  mixin=>router实例绑定给了所有的组件
  applyMixin(Vue)
}

export {
  Store,
  install
}
