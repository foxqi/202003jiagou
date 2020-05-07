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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  /**
   * 取值时实现代理效果
   *  // 为了让用户更好的使用，我希望可以直接vm.xx。vm直接取值
   * @param {*} vm 
   * @param {*} source 
   * @param {*} key 
   */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  } // 生命周期的钩子

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  /**
   * 实现俩个对象的合并
   * @param {*} parent 
   * @param {*} child 
   */

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      //如果已经合并过了就不需要再次合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略  但是有些属性 需要有特殊的合并方式  生命周期的合并


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2({}, parent[key], {}, child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //...agrs是{name: "zf", age: 3}
      // console.log('用户调用了方法');// AOP 切片编程  
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

      ob.dep.notify(); //如果用户调用了push方法  我会通知当前这个dep去更新

      return result; //这是是为了上面arrayMethods[method]=result,这个result就是为了改变this指向，让外面调用原生的方法
    };
  });

  var id = 0; //每个dep也要有每个标识

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 让wacher记住我当前的dep
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 目前可以做到 将watcher保留起来  和  移除的功能

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  /**
   *   步骤一：先创建一个Observer类进行数据监听，如果传入进来的data是个  对象  的话，遍历对象，用Object.defineProperty中的get和set方法进行数据变化的监听，如果对象里面嵌套对象，那么就用递归的方式进行深度监听
   *   步骤二：如果传入进来的data是个  数组   的话，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能，所以为了不给数组的索引进行get，set监听，遍历数组获得每个对象，在给里面的每个对象进行监听
   *    步骤三：当data是个数组的话，如果用户对这个数组进行了方法调用改变数组（比如用了push，unshift等方法）我们也要对方法进行重写，进行监听，并重新赋值。
   * （这一步的大概逻辑是：会导致数组本身发生变化的方法写成一个数组，然后遍历在调用原生方法，将原生方法进行输出，具体看array.js）
   * （这里好像还要有模板解析）    
   * 步骤四：依赖收集
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

      /* 步骤四. start*/
      this.dep = new Dep(); //给数组用的

      /* 步骤四. end*/

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

        this.observerArray(value); //这里虽然递归了，但是没有依赖收集
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
    var dep = new Dep();
    /* 步骤四 start*/
    //  observe(value);//这里的调用，是为了递归，获取到对象中的对象的属性:递归实现深度检测，但是如果层级太多使用递归会很浪费性能
    // 上面是之前写的，在写依赖收集的时候改为下面写法

    var childOb = observe(value); //这里这个value可能是数组，也可能是对象，返回的结果是observer的实例，当前这个value对应的observer

    /* 步骤四 end*/

    Object.defineProperty(data, key, {
      get: function get() {
        //获取值的时候作一些操作
        console.log('取值'); //每个属性都对应着自己的watcher

        if (Dep.target) {
          //如果当前有watcher
          dep.depend(); //意味着我要将watcher存起来

          /* 步骤四 start*/

          if (childOb) {
            //数组的依赖收集
            childOb.dep.depend(); //收集了数组的相关依赖
            // 如果数组中还有数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
          /* 步骤四 end*/

        }

        return value;
      },
      set: function set(newValue) {
        //当数据发生变化，也可以设置一些操作
        console.log('更新数据');
        if (newValue === value) return;
        observe(newValue); //继续劫持用户设置的值，因为有可能用户设置的值是一个对象；这里深度劫持就会在这个对象里有set和get方法，就能再次进行更改监听

        value = newValue;
        dep.notify(); //通知依赖的watcher来进行一个更新操作
      }
    });
  }
  /* 步骤一 end*/

  /* 步骤四 start*/


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; //将数组中的每一个都取出来，数据变化后  也去更新视图
      //   数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }
  /* 步骤四 end*/

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
    // 为了让用户更好的使用，我希望可以直接vm.xx。vm直接取值

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); //1.响应式原理
  }

  // vue源码
  // ?:匹配不补货
  var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'; //命名空间：表示能匹配到abc-aaa这样的一个字符串

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //命名空间标签：<aaa:asdee>
  // 匹配开始标签开始部分

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则，捕获的内容是标签名

  /**
   * 这是验证上面的正则是否正确
   * let r = '<a:b>'.match(startTagOpen);
   * console.log(r)
   * 
   * 获得这样的东西  ["<a:b", "a:b", index: 0, input: "<a:b>", groups: undefined]
   * 
   * arguments[0] = 匹配到的标签  arguments[1] = 匹配到的标签名字 
   */

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的闭比如</div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    var root = null; //ast语法树的树根

    var currentParent; //标识当前父亲是谁

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      //console.log('开始标签：', tagName, '属性是：', attrs);
      //遇到开始标签 就创建一个ast元素
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; //把当前元素标记成父ast树

      stack.push(element); //将开始标签存放在栈中
    }

    function chars(text) {
      // console.log('文本是：', text)
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      // console.log('结束标签', tagName)
      var element = stack.pop(); //拿到的是ast对象
      //我要标识当前这个p是属于这个div的儿子的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); //实现了一个树的父子关系
      }
    } // 不停的解析html


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        //   如果当前索引为0  肯定是一个标签  开始标签  结束标签
        var startTagMatch = parseSartTag(); //通过这个方法获取到匹配的结果 tagName，attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); //1.解析开始标签

          continue; //如果开始标签匹配完毕后，继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(); //2.解析结束标签

          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); //3.解析文本
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

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性进行解析
          advance(attr[0].length); //将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); //放在了attrs这个属性中
        }

        if (_end) {
          //去掉开始标签的 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; // 匹配默认的分隔符 "{{}}"

  function genProps(attrs) {
    //处理属性，拼接成属性的字符串
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          //style="color:red;font-size:14px" => {style:{color:'red'},id:name}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      //元素标签
      return generate(node);
    } else {
      var text = node.text; // a {{name}}  b{{age}}  c
      // _v("a"+_s(name)+"b"+_s(age)+'c')

      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0; // 正则的问题 lastIndex设为0才可以用exec正常匹配（具体为什么自己百度） 只要全局匹配，就需要将lastIndex每次匹配的时候就调到0处

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    //[{name:'id',value:'app'},{}]  => {id:app,a:1,b:2}
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ") ");
    return code;
  }

  //将html变成函数的话，会用到ast语法树
  function compileToFunction(template) {
    //console.log(template, '---');
    //1）解析html字符串，将html字符串 => ast语法树
    var root = parseHTML(template); // console.log(root)

    var code = generate(root); //2)需要将ast语法树生成最终的render函数  就是字符串拼接 （模板引擎）
    // 核心思路就是将模板转换成 下面这段字符串
    // <div id="app">hello<p>{{name}}</p><span>{{age}}</span></div>
    // 将ast树，再次转换成js的语法树（重点：这个是js语法 执行后返回的是虚拟dom）
    // _c('div',{id:'app'},_c('p',undefined,_v(_s(name))),_c('span',undefined,_v(_s(age))))
    // 所有的模板引擎实现，都需要new Function + with
    //这里加的with方法是为了实现ƒ anonymous(
    // ) {
    //     with(this){return _c("div",{id:"app",style:{"color":" red"}},_v("hello"),_c("p",undefined,_v(_s(name))),_c("span",undefined,_v(_s(age)))
    //         )
    //         } 
    //     }
    // 这个函数，也就是render这个函数的，因为这个才是将模板进行编译的

    var renderFn = new Function("with(this){return ".concat(code, "} ")); // console.log(renderFn);(renderFn返回的是一个render函数，这个函数调用后就会形成虚拟dom)
    //vue的render  它返回的是虚拟dom()

    return renderFn;
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

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
  }

  function nextTick(cb) {
    // 多次调用nextTick 如果没有刷新的时候  就先把他放到数组中，
    // 刷新后  更改waiting
    callbacks.push(cb);

    if (waiting === false) {
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  // 专门做调度的一个js
  var queue = [];
  var has = {};

  function flusSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = []; //让下一次可以继续使用

    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // 宏任务和微任务（vue里面使用了Vue.nextTick）
      // Vue.nextTick = promise /mutatuinObserver/setImmediate/setTimeout//优雅降级

      nextTick(flusSchedularQueue);
    }
  }

  var id$1 = 0; //每个watcher都有一个标识

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn; //将内部传过来的回调函数  放到getter属性上

      this.depsId = new Set(); //es6中的集合（不能放重复项）

      this.deps = [];
      this.get(); //调用get方法，会让渲染watcher执行
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        //watcher 里不能放重复的dep dep里不能放重复的watcher
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //把watcher存起来 在Dep.target

        this.getter(); //渲染watcher的执行

        popTarget(); //移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        // 等待着   一起来更新  因为每次调用update的时候  都放入了watcher
        //   这个方法是为了解决用户多次调同一个，比如push方法
        queueWatcher(this); // console.log(this.id);
        // this.get();
      }
    }, {
      key: "run",
      value: function run() {
        console.log(55);
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // console.log(oldVnode , vnode);
    // 递归创建真实节点  替换掉老的节点
    // 1.判断是更新还是渲染
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode; //拿到div id="app"

      var parentElm = oldElm.parentNode; //body

      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm); // 需要将渲染好的结构返回

      return el;
    }

    function createElm(vnode) {
      //根据虚拟节点创建真实的节点
      var tag = vnode.tag,
          children = vnode.children,
          key = vnode.key,
          data = vnode.data,
          text = vnode.text; //    是标签就创建标签

      if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        updateProperties(vnode);
        children.forEach(function (child) {
          //递归创建儿子节点，将儿子节点扔到父节点中
          return vnode.el.appendChild(createElm(child));
        });
      } else {
        // 虚拟dom上映射这真实dom  方便后续更新操作
        vnode.el = document.createTextNode(text);
      } // 如果不是标签就是文本


      return vnode.el;
    } // 更新属性


    function updateProperties(vnode) {
      var newProps = vnode.data;
      var el = vnode.el;

      for (var key in newProps) {
        if (key === 'style') {
          for (var styleName in newProps.style) {
            el.style[styleName] = newProps.style[styleName];
          }
        } else if (key === 'class') {
          el.className = newProps["class"];
        } else {
          el.setAttribute(key, newProps[key]);
        }
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 我要通过虚拟节点  渲染出真实的dom

      vm.$el = patch(vm.$el, vnode); //需要用虚拟节点创建出真实节点  替换掉  真实的$el
      // console.log(vnode)
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options; //render

    vm.$el = el; //代表真实的dom元素
    // console.log(options,vm.$el);
    // console.log(options,vm.$el)
    // Watcher 就是用来渲染的
    // vm._render 通过解析的render方法 渲染出虚拟dom  _c _v _s
    // vm._update 通过虚拟dom  创建真实的dom

    callHook(vm, 'beforeMount'); // 渲染页面

    var updateComponent = function updateComponent() {
      //无论是渲染还是更像都会调用此方法
      //返回的是虚拟dom
      console.log('update');

      vm._update(vm._render());
    }; // 渲染watcher 每个组件都有一个watcher


    new Watcher(vm, updateComponent, function () {}, true); //true表示他是一个渲染watcher

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; //[fn,fn,fn]

    if (handlers) {
      //找到对应的钩子依次执行
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      //    数据的劫持
      var vm = this; //vue中使用this.$options 指代
      // vm.$options = options;
      // 下面这个是合并多个方法才开始写成这样的
      // 将用户传递的  和  全局的进行一个合并

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm); //分割代码（这里面有1.数据劫持）

      callHook(vm, 'created'); // 2.模板编译
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
      } // options.render
      // console.log(options.render, vm)
      // 3.挂载组件：渲染当前的组件或者叫挂载这个组件


      mountComponent(vm, el);
    }; //用户调用nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } // 虚拟节点  就是通过_c _v _s 实现用对象来描述dom操作  （对象）
  // 1)将template转换成ast语法树 -> 生成render方法  ->  生成虚拟dom  ->  真实的dom
  // 重新生成虚拟dom  -> 更新dom

  /**这是虚拟dom
   * 
   * {
   * tag:'div'
   * key:undefined,
   * data:{},
   * children:[
   * 
   * ],
   * text:undefined
   * }
   * 
   * 
   * 
   */

  function renderMixin(Vue) {
    // _c是创建元素的虚拟节点
    // _v创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); //tag,data,children1,childern2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text); //tag,data,children1,childern2
    };

    Vue.prototype._s = function (val) {
      return val =  _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function (params) {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); //去实例上  取值

      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    //整合了所有的全局相关的内容
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // 如何实现俩个对象的合并
      this.options = mergeOptions(this.options, mixin);
    }; // 生命周期的合并策略  [beforeCreate,beforeCreate]
    // Vue.mixin({
    //     a: 1,
    //     beforeCreate() {
    //         console.log('mixin 1')
    //     }
    // })
    // Vue.mixin({
    //     b: 2,
    //     beforeCreate() {
    //         console.log('mixin 2')
    //     }
    // })
    // console.log(Vue.options)

  }

  // 自写vue的核心代码,只是vue的一个声明

  function Vue(options) {
    //进行vue的初始化操作
    this._init(options);
  } // 通过引入文件的方式 给vue原型上添加方法


  initMixin(Vue); //给vue原型上添加一个_init方法

  renderMixin(Vue);
  lifecycleMixin(Vue); // 初始化全局的api

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
