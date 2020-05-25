// 默认vue就是 runtime-only 不识别模板，如果想要自己创建一个vue.config.js文件

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  // template:`<h1>hello</h1>`

  //  h 是createElement 渲染组件
  render: h => h(App),

  // 这个方法直接渲染这个组件
  // ...App
}).$mount('#app')
