(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

   // 把data中的数据 都使用Object.defineProperty重新定义  这是一个es5的方法
   // Object.defineProperty不能兼容ie8及以下，vue2无法兼容ie8版本
   function observe(data) {
     console.log(data);
   }

   function initState(vm) {
     var opts = vm.$options; //监测的顺序 vue的数据来源  属性  方法  数据  计算属性  watch

     if (opts.props) ;

     if (opts.methods) ;

     if (opts.data) {
       initData(vm);
     }

     if (opts.computed) ;

     if (opts.watch) ;
   }

   function initData(vm) {
     //   数据初始化工作
     var data = vm.$options.data; //用户传递的data

     data = vm._data = typeof data === 'function' ? data.call(vm) : data; // console.log(data);
     // 对象劫持  用户改变了数据  我希望可以得到通知  后可以  刷新页面
     // MVVM模式 数据变化可以驱动视图变化
     //  Object.defineroperty() 给属性增加get方法和set方法

     observe(data); //响应式原理
   }

   function initMixin(Vue) {
     Vue.prototype._init = function (options) {
       //    数据的劫持
       var vm = this; //vue中使用this.$options 指代

       vm.$options = options; // 初始化状态

       initState(vm); //分割代码
     };
   }

   // 自写vue的核心代码,只是vue的一个声明

   function Vue(options) {
     //进行vue的初始化操作
     this._init(options);
   } // 通过引入文件的方式 给vue原型上添加方法


   initMixin(Vue); //给vue原型上添加一个_init方法

   return Vue;

})));
//# sourceMappingURL=vue.js.map
