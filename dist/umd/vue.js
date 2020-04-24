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
  /**
   * 给对象增加属性
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 这里为什么要重写数组的方法呢，是因为用户是在前台把数组更新了，但是我们怎么获取更新的数组呢，只能在监听到用户传的方法也就是前面的value.__protp__=arrayMethods获取到所有的方法，然后这边在根据方法和传入的值在进行数组更新，然后在返回新的数组
  //  我要重写数组的哪些方法  ：7个  push shift  unshift  pop  reverse sort splice 会导致数组本身发生变化
  // slice（）这个方法并不会改变数组，就不用去通知了也不需要劫持，我们只监听数组变了的方法
  // 这就是原型链查找问题，会向上查找，先查找我重写的，重写的没有会继续向上查找
  var oldArrayMethods = Array.prototype; //设置这个变量是为了如果用户调用了我们没有重写的方法（比如slice），会直接调用Array基类的方法
  // value.__propo__ = arrayMethods(数组通过原型链指向了arrayMethods)
  //arrayMethods.__propo__ = oldArrayMethods(arrayMethods通过原型链指向了oldArrayMethods)

  var arrayMethods = Object.create(oldArrayMethods); // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 也就是这端代码 等于 arrayMethods.__propo__ = oldArrayMethods

  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    // 在arrayMethods这个属性上增加上面那些方法，调这些方法的时候会传入很多参数
    arrayMethods[method] = function () {
      //...agrs是{name: "zf", age: 3}
      console.log('用户调用了方法'); // AOP 切片编程  

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); //调用原生的数组方法,这里的this指的是value,因为是value调用的,这个result返回的是value的length
      // 判断：如果添加的元素可能还是一个对象

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

      if (inserted) ob.observerArray(inserted); //将新增对象属性继续观测

      return result; //这是是为了上面arrayMethods[method]=result,这个result就是为了改变this指向，让外面调用原生的方法
    };
  });

  /**
   *   步骤一：先创建一个Observer类进行数据监听，如果传入进来的data是个  对象  的话，遍历对象，用Object.defineProperty中的get和set方法进行数据变化的监听，如果对象里面嵌套对象，那么就用递归的方式进行深度监听
   *   步骤二：如果传入进来的data是个  数组   的话，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能，所以为了不给数组的索引进行get，set监听，遍历数组获得每个对象，在给里面的每个对象进行监听
   *    步骤三：当data是个数组的话，如果用户对这个数组进行了方法调用改变数组（比如用了push，unshift等方法）我们也要对方法进行重写，进行监听，并重新赋值。
   * （这一步的大概逻辑是：会导致数组本身发生变化的方法写成一个数组，然后遍历在调用原生方法，将原生方法进行输出，具体看array.js）
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

      /* 步骤三.2 start*/
      //value.__ob__=this;//我给每一个监控过的对象都增加一个__ob__属性，这的this指的是Observer的实例,为了给后面的方法调用observerArray，进行数据监听
      // 上面的方法不能直接在vulue上加属性，因为下面的observe会进行数据监听，它会以为value增加新的数据，而上面的方法只是为了以后数据调用代码而进行赋值的，所以只能用下面的方法
      def(value, '__ob__', this);
      /* 步骤三 end*/

      /* 步骤二 start*/
      // 如果是传进来的是数组，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能

      if (Array.isArray(value)) {
        //如果是数组的话并不会对索引进行观测，因为会导致性能问题
        // 前端开发中很少很少  去操作索引  push  shift  unshift

        /* 步骤三.1 start*/
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

    observe(data); //1.响应式原理
  }

  //将html变成函数的话，会用到ast语法树

  /*ast语法树  和 虚拟到dom有什么区别
  ast语法树 是 用对象来编译html语法的（下面的原理）
  虚拟dom 是  用对象来描述dom节点的（也就是那个html下面有div标签，div下面有p，span标签等的dom节点）



  render函数返回的是虚拟dom，现在做的是把template变成render函数
  */
  // vue源码
  // ?:匹配不补货
  var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'; //命名空间：表示能匹配到abc-aaa这样的一个字符串

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //命名空间标签：<aaa:asdee>
  // 匹配开始标签开始部分

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则，捕获的内容是标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function start(tagName, attrs) {
    console.log('开始标签：', tagName, '属性是：', attrs);
  }

  function parseHTML(html) {
    // 不停的解析html
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        //   如果当前索引为0  肯定是一个标签  开始标签  结束标签
        var startTagMatch = parseSartTag(); //通过这个方法获取到匹配的结果 tagName，attrs

        start(startTagMatch.tagName, startTagMatch.attrs);
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        ChannelSplitterNode(text);
        break;
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseSartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //将标签删除

        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性进行解析
          advance(start[0].length); //将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); //放在了attrs这个属性中
        }

        if (end) {
          //去掉开始标签的 >
          advance(end[0].length);
        }

        return match;
      }
    }
  }

  function compileToFunction(template) {
    console.log(template, '---');
    var root = parseHTML(template);
    return function render() {};
  }
  /**
   * 通过上面的正则，可以把下面的html编译成
   * start div:  attr:[{name:'id',value:'app'}]
   * start p
   * text hello
   * end p
   * end div 
   */

  /*
  <div id="app">
      <p>hello</p>
  </div>
  //上面的html就会变成下面的抽象的语法，这就是ast语法树
  这个root就是ast语法树
  let root ={
      tag:'div',
      attrs:[//属性
          {name:'id',value:'app'}
      ],
      parent:null,
      type:1,//它是什么类型，元素类型为1
      children:[{
          tag:'p',
          attrs:[],
          parent:root,
          children:[{
              text:'hello',
              type:3,//文本类型为1
              }]
      }]
  }
  */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      //    数据的劫持
      var vm = this; //vue中使用this.$options 指代

      vm.$options = options; // 初始化状态

      initState(vm); //分割代码（这里面有1.数据劫持）
      // 2.模板编译
      // 如果用户传入了el属性  需要将页面渲染出出来
      // 如果用户传入了el  就要实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认先会查找有没有render方法，没有render  会 采用template， template也没有就用el中的内容

      if (!options.render) {
        // 对模板进行编译
        var template = options.template; //取出模板

        if (!template && el) {
          template = el.outerHTML;
        } // console.log(template);

        /*这是拿到的template的模板
        <div id="app">
            <p>{{name}}</p>
            <span>{{age}}</span>
        </div>*/
        // 我们需要将template  转换成render方法
        // vue1.0是用的纯字符串编译，正则转换的方式，性能不高；vue2.0引用的是虚拟dom

        /* 将上面的拿到的template模板，用render函数写成：
        render(){  //_c是creatElement创建一个元素div； 有一些属性{id:'app'}： 
        有俩个儿子  p没有属性undefined; p里面有文本，创建一个文本_v;  _s表示的是json.stringify取值，转成一个对象格式或字符串格式，创建出来一个文本;  span同理
        这样就创建出一个虚拟节点，变成上面的html
            return _c('div',{id:'app'},_c('p',undefined,_v(_s(name))),_c('span',undefined,_v(_s(age))))
        }
        */
        // 模板进行编译用compileToFunction这个函数(自己封装的)，也就是把template这个html编译成一个函数


        var render = compileToFunction(template);
        options.render = render; //这个是为了用户传了render用用户传的，用户没传，就用自己写的
      }
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
