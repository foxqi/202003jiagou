(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 工具库

  /**
   * 
   * @param {*} data  当前数据是不是对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  //  我要重写数组的哪些方法  ：7个  push shift  unshift  pop  reverse sort splice 会导致数组本身发生变化
  // slice（）这个方法并不会改变数组，就不用去通知了也不需要劫持，我们只监听数组变了的方法
  // 这就是原型链查找问题，会向上查找，先查找我重写的，重写的没有会继续向上查找
  var oldArrayMethods = Array.prototype; //设置这个变量是为了如果用户调用了我们没有重写的方法（比如slice），会直接调用Array基类的方法
  // value.__propo__ = arrayMethods(数组通过原型链指向了arrayMethods)
  //arrayMethods.__propo__ = oldArrayMethods(arrayMethods通过原型链指向了oldArrayMethods)

  var arrayMethods = Object.create(oldArrayMethods); // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 也就是这端代码 等于 arrayMethods.__propo__ = oldArrayMethods

  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('用户调用了push方法'); // AOP 切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); //调用原生的数组方法,这里的this指的是value,因为是value调用的
      // 如果添加的元素可能还是一个对象

      var inserted; //当前用户插入的元素

      var ob = this.__ob__; //这里的this是指value，因为value在外面定义了value.__ob__=this;，这指向Observer的实例，而这个实例又有observerArray方法，所以可以调用observerArray方法

      switch (method) {
        case 'push':
        case 'usnshift':
          inserted = args;
          break;

        case 'splice':
          //3个  新增的属性  splice 有删除 新增 的功能 arr.splice(0,1，{name:1})
          inserted = args.slice(2);
      }

      if (inserted) ob.observerArray(inserted); //将新增属性继续观测

      if (inserted) return result;
    };
  });

  /**
   *   步骤一：先创建一个Observer类进行数据监听，如果传入进来的data是个  对象  的话，遍历对象，用Object.defineProperty中的get和set方法进行数据变化的监听，如果对象里面嵌套对象，那么就用递归的方式进行深度监听
   *   步骤二：如果传入进来的data是个  数组   的话，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能，所以为了不给数组的索引进行get，set监听，遍历数组获得每个对象，在给里面的每个对象进行监听
   *    步骤三：当data是个数组的话，如果用户对这个数组进行了方法调用改变数组（比如用了push，unshift等方法）我们也要对方法进行重写，进行监听
   *       
   * 
   * 
   * 
   * 
   * 
   */

  /* 步骤一 start*/
  //创建一个Observer的类

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      //这里的constructor是es6的新写法，一个类必须有 constructor 方法，一般 constructor 方法返回实例对象 this ，但是也可以指定  constructor 方法返回一个全新的对象，让返回的实例对象不是该类的实例。
      //这是constructor的概念https://www.jianshu.com/p/fc79756b1dc0
      //value.__ob__=this;//我给每一个监控过的对象都增加一个__ob__属性，这的this指的是Observer的实例
      // 上面的方法不能直接在vulue上加属性，因为下面的observe会进行数据监听，它会以为value增加新的数据，而上面的方法只是为了以后数据调用代码而进行赋值的，所以只能用下面的方法
      def(value, '__ob__', this);
      /* 步骤二 start*/
      // 如果是传进来的是数组，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能

      if (Array.isArray(value)) {
        //如果是数组的话并不会对索引进行观测，因为会导致性能问题
        // 前端开发中很少很少  去操作索引  push  shift  unshift

        /* 步骤三 start*/
        value.__proto__ = arrayMethods;
        /* 步骤三 end*/
        // 如果数组里放的是对象我在监控

        this.observerArray(value);
      } else {
        //vue如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
        this.walk(value); // 先考虑一步的数据
      }
    }
    /* 步骤二 end*/

    /* 步骤二 start*/
    //这个方法是为了不给数组的索引进行get，set监听，直接遍历数组获得每个对象，在给对象进行监听


    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        //value是[{}],用observe监控了数组的每一项
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
      /* 步骤二 end*/

      /* 步骤一 start*/

    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); //[name,age,address]
        //    for(let i=0;i<keys.length;i++){
        //         let key =keys[i];
        //         let value =data[key];
        //         defineReactive(data,key,value);//定义响应式数据
        //     }
        // 可以简化为下面的代码

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]); //定义响应式数据
        });
      }
      /* 步骤一 end*/

    }]);

    return Observer;
  }();
  /* 步骤一 start*/


  function defineReactive(data, key, value) {
    observe(value); //这里的调用，是为了递归，获取到对象中的对象的属性:递归实现深度检测，但是如果层级太多使用递归会很浪费性能

    Object.defineProperty(data, key, {
      get: function get() {
        //获取值的时候作一些操作
        return value;
      },
      set: function set(newValue) {
        //当数据发生变化，也可以设置一些操作
        console.log('更新数据');
        if (newValue === value) return;
        observe(newValue); //继续劫持用户设置的值，因为有可能用户设置的值是一个对象；这里深度劫持就会在这个对象里有set和get方法，就能再次进行更改监听

        value = newValue;
      }
    });
  }
  /* 步骤一 end*/

  /* 步骤一 start*/
  // 这里是输出Observer观察到的数据


  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data); // 用来观测数据
  }
  /* 步骤一 end*/

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
