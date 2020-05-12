import Vue from 'vue'
import App from './App.vue';//App =>new Vue.extend({component,name,render})
import router from './router/index'
new Vue({
    name:'root',
    el:'#app',
    render:h=>h(App),
    router//这里让所有组件都可以获取到router属性

})

// 单页应用  可以实现组件的切换


// 首页  /
// 关于页面  /about


// 多页应用  1个页面一个html
// 前端路由常见的俩个方案  hash的模式  #aa #b  通过#后面路径的方式进行切换  （缺陷:丑）
// window.location.hash = '/about'
// window.onhashchange =function(){} 渲染对应的路径的组件

// window.history.pushState() 它可以实现增添路径，但是强制刷新还是会有问题（只能来靠服务端来解决这个问题）
// window.oppopstate = function(){}  监控浏览器路径的变化

// vue-router源码中在hash模式下，  如果支持onpopstate会优先采用，如果低版本浏览器  会采用onhashchange
 






// （浏览器的历史记录）浏览器是栈型结构
// 内部是通过俩个栈来实现的，，可以理解为后进的先出（存放历史的）

// 默认内部俩个栈来实现  当后退时会把第一个栈顶的路由存放到另一个栈中，当再次输入路径会将另一个栈清空












