## 进阶vue篇（一）

#### 一、什么是库？什么是框架？
- 库是将代码集合成一个产品，库是我们调用库中的方法实现自己的功能，比如jquery，react（因为官网上说是用于构建用户界面的javascript库）
- 框架则是为了解决一类问题而开发的产品，框架是我们在指定的位置编写好代码，框架本身帮我们调用我们的逻辑，比如vue


#### 二、MVC 和 MVVM 区别
` 传统的 MVC 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染 `
- model controller view   我们在全栈开发 view视图对页面进行了操作或者修改，会调用后端的控制器controller（也可以理解为路由），在去调用数据层model，然后手动的渲染给我们的视图view


` MVVM :传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁. `
- 前后端分离  :前端部分  mvc(例如有backbone，它是获取数据后手动渲染到页面中)/mvvm 双向绑定，model viewModel  view（视图和数据交互，是自动映射的关系，不需要手动的操作dom）


` Vue并没有完全遵循MVVM模型，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信。 是他的响应式原理遵循了mvvm模式`
- vue是渐进式框架
  - 我们可以使用局部功能，也可以使用完整功能
  - vue的响应式原理 + vue的组件化的功能(响应式原理和组件化功能是最核心的) + 我可以根据我的选择进行添加功能 （例如：vue-router单页应用的路由系统 + 或者我们的页面更大一点时，很多页面进行通信，统一状态管理vuex + 自动运行自动打包 vue-cli）
  - mvvm中的 view 和 model之间不能直接通信，必须通过viewModel进行通信。vue可以不直接通过viewModel，来操作视图
  - React 只是做v层，也就是视图层，只针对视图层的库


## vue应用

#### Vue中的模板 (vueAssembly/1.start.html)
```javascript
    <script src="node_modules/vue/dist/vue.js"></script>
    <!-- 3.外部模板 -->
    <div id="app">{{name}}</div>
    <script>
        const vm = new Vue({
            el:'#app',
            data:{
                name:'jw',
                age: 22
            },
            // 2.内部模板
            template:'<div>{{age}}</div>',
            // 1.render函数
            render(h){
                return h('h1',['hello,',this.name,this.age])
            }
        });
    </script>
```

` 我们默认使用的是 runtime-with-compiler版本的vue,带compiler的版本才能使用template属性，内部会将template编译成render函数 `

- 渲染流程，会先查找用户传入的render
- 如果没有传入render则查找template属性
- 如果没有传入template则查找el属性，如果有el，则采用el的模板










