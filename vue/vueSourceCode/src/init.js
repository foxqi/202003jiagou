import { initState } from './state'

import { compileToFunction } from './compiler/index.js'
import { mountComponent,callHook } from './lifecycle'

import { mergeOptions } from './util/index'

import {nextTick} from './util/next-tick'

// 在原型上添加一个init方法
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        //    数据的劫持
        const vm = this;//vue中使用this.$options 指代

        // vm.$options = options;
        // 下面这个是合并多个方法才开始写成这样的
        // 将用户传递的  和  全局的进行一个合并
        vm.$options = mergeOptions(vm.constructor.options,options);
        callHook(vm,'beforeCreate');
        // 初始化状态
        initState(vm);//分割代码（这里面有1.数据劫持）

        callHook(vm,'created')



        // 2.模板编译
        // 如果用户传入了el属性  需要将页面渲染出出来
        // 如果用户传入了el  就要实现挂载流程
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }

    }
    Vue.prototype.$mount = function (el) {
        const vm = this;


        const options = vm.$options;
        el = document.querySelector(el);

        // 默认先会查找有没有render方法，没有render  会 采用template， template也没有就用el中的内容
        if (!options.render) {
            // 对模板进行编译
            let template = options.template;//取出模板
            if (!template && el) {
                template = el.outerHTML;
            }
            // console.log(template);
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
            const render = compileToFunction(template);
            options.render = render;//这个是为了用户传了render用用户传的，用户没传，就用自己写的
        }

        // options.render
        // console.log(options.render, vm)

        // 3.挂载组件：渲染当前的组件或者叫挂载这个组件
        mountComponent(vm, el);


    }
    //用户调用nextTick
    Vue.prototype.$nextTick = nextTick
}

