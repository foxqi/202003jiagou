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

#### 1.Vue中的模板 (vueAssembly/1.start.html)
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

#### 2.Vue中的  {{}} (vueAssembly/2.expression.html)
- {{}} 这种双括号叫模板语法，会在当前的vue实例上进行取值  _v() 
- 表达式只能存放 有返回值的结果
- 可以放 :运算  函数执行获取返回值  三元表达式  取值 


` 响应式原理的缺陷`
```javascript
        // 1.（对象的情况）不存在的属性 如果新增的话不能渲染视图 因为它是内部会采用defineProperty重新定义属性 getter 和 setter
        // 解决办法
        // vm.name={
        //     ...vm.name,
        //     a:1
        // }
        //或 内部也会触发更新，而且新增的a属性是可以响应式的
        // vm.$set(vm.name,'a',1)
        // vm.name.a=100
        // 数据尽量少嵌套关系，因为如果嵌套关系非常的深，默认会递归所有的对象，给他增加getter和setter属性，所以性能不好


        // 2.数组只能通过改变数组的七个方法来实现更新视图，不能使用索引，长度（因为它不监控索引和长度）
        // 解决办法
        // vm.arr.push(4,5,6)
        // 也可以用$set,
        //vm.$set(vm.arr, 0, 100);//内部会采用splice，数组实现响应式主要是靠重写原型的方法，vm.$delete同$set一样
    
    // 但是vue2.0这样写很麻烦，所以vue3.0使用了 proxy 来实现代理，就解决了以上的所有问题，不需要一上来就进行递归（性能能好，但兼任性差）
```
#### 3.实例上有很多方法 (vueAssembly/3.instance.html)
- 属于方法类的
  - vm.$mount  内部会判读用户是否传入el属性，如果没有，则用vm.$mount('#app')进行挂载操作
     - 因为有可能有些组件我不希望不挂载到app的节点上，可以通过这个方式挂载到其他的元素上. 它可以自定义挂载点  弹框组件

  -  vm.$nextTick  保证页面渲染完毕后获取最新的dom元素
  -  vm.$watch()  默认我们有渲染watcher ，还有可以自定义的

- 属于属性类的
  - vm.$options  用户传入的所有属性
  - vm.$data == vm._data  true 代表响应后的数据（下划线一般代表私有的，所有提供了一个$data的公有属性）
  -  vm.$el  代表当前渲染的元素，因为渲染是异步的，它是引用类型（整个页面走完之后，它已经改变了值，它打印的结果是xxx,所有它一般和vm.$nextTick一起使用

#### 4.常用指令(vueAssembly/4.directive.html)
- v-once 这个标签是个静态节点，稍后渲染时，不会重新的渲染了，有缓存了
- v-html
  - 它相当于 innerHTML（innerHTML会转换成标签插入）对导致 xss攻击 

        ` 如果一个input里放入 <img src="xxx" onerror="alert(111)">’`。如果input是使用的v-html那么alert(111)就会被弹出，可能会不好的人攻击。如果是后台传入的是html可以考虑
        所有这里需要对内容严格把控，不要信任用户输入的内容 `
- v-if/ v-else / v-else-if  它等价于三元表达式
  - 它最终会被编译成  render函数(具体实现在G:\202003jiaogou3\vueAssembly\1.test.js)    
  - 如果条件不满足这个节点就不渲染，操作的是dom元素
  -v-if可以配合template一起使用      
- template 没有任何意义的标签,它可以代替div等dom，减少dom渲染
- v-show 最终会通过样式来控制这个div是显示还是隐藏 display:none
  - 为什么不用opacity或visibilty:hidden呢，因为display是不占位置的
- v-for  循环 循环字符串  数组 数字  对象
```html
        <!-- (每一项，索引) -->
        <div v-for="(a,index) of arr" ::key="index"></div>
         <!-- 1.如果使用v-for  就不能和v-if连用
        v-for和v-if 的优先级问题
        它是先循环再判断，性能不好，
        尽量使用计算属性来解决这个问题
        
        -->
        <!-- 2.key的问题 尽量不要使用索引作为key (尤其是经常操作的列表) 
        因为如果用索引的话，如果相同的索引但是发现元素内容发生变化，会直接重新渲染，比如下面的苹果和香蕉的各自的li会渲染俩次。但是我们想如果相同的dom结构，尽量不要重新渲染，索引用索引不好
        
        
        -->
        <li :key="0">苹果</li>
        <li :key="1">橘子</li>
        <li :key="2">香蕉</li>

        <li :key="0">香蕉</li>
        <li :key="1">橘子</li>
        <li :key="2">苹果</li>
<!-- 但如果使用唯一的key标识，它是会找到进行比对，如果不同，会进行移动，而不是删除在添加.有key的话不会去重新创建dom -->
        <li :key="p">苹果</li>
        <li :key="j">橘子</li>
        <li :key="x">香蕉</li>

        <li :key="x">香蕉</li>
        <li :key="j">橘子</li>
        <li :key="p">苹果</li>
```

#### 5.自定义指令(vueAssembly/5.directive.html)
 - directives
 ```javasctipt
    // 一个指令里面的生命周期
    // bind(el,bindings,vnode,oldVnode){
    //     console.log(el.parentNode);
    // },
    // inserted(el,bindings,vnode,oldVnode){
    //     console.log(el.parentNode);
    // },
    // update(el,bindings,vnode,oldVnode){
    //     console.log(el.innerHTML);
    // },
    // componentUpdated(el,bindings,vnode,oldVnode){
    //     console.log(el.innerHTML);
    // },
    // unbind(){
    //     // 解除事件绑定
    // }
 ```

 #### 6. 图片懒加载 vue-lazyLoad 第三方插件 (vueAssembly/index.html)
    - ***自写 方法


### 小测
1. 关于框架和库的说法正确的是：框架则是为解决一类问题而开发的产品，库是将代码集合成一个产品 
2. 关于MVC 和 MVVM说法正确的是： 前端既存在MVC框架也存在MVVM框架
3. 关于render和template属性说法正确的是：render函数的优先级高于template
4. 响应式原理说法正确的是：Vue的响应式原理：对象通过defineProperty来实现，数组通过重写数组原型方法来实现
5. v-if和v-show的区别 :v-if操作的是dom是否存在，最终会编译成三元表达式
6. 关于v-for说法正确的是?  如果是静态展示的属性可以使用索引作为key
7. 关于v-model说法正确的是？v-model可以理解成是语法糖形式  


## 进阶vue篇（二）

#### 组件化开发：可复用、方便维护、减少不必要的更新操作

#### 一、vue-cli项目创建
#### 1.安装
```javascript
npm install -g @vue/cli(这里的@是指作用域包，这里是指vue包，发包的一个规范)
npm install -g @vue/cli-service-global(快速创建项目工具,默认可以采用vue-cli的目录)
vue create vue-online-edit（后面这个是项目名字）
```
#### 2.初始化
```javascript
? Check the features needed for your project:
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 ( ) Router
 ( ) Vuex
>(*) CSS Pre-processors
 ( ) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing


? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default)
  Sass/SCSS (with dart-sass)
  Sass/SCSS (with node-sass)
  Less
> Stylus
```

`
cd vue-online-edit  &  yarn serve
`


#### 二.Vue组件通信
#### 1.常见组件通信方式
- 1)props和$emit 父组件向子组件传递数据是通过prop传递的，子组件传递数据给父组件是通过$emit触发事件来做到的
- 2.$attrs和$listeners A->B->C。Vue 2.4 开始提供了$attrs和$listeners来解决这个问题
- 3.$parent,$children
- 4.$refs 获取实例
- 5.父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量。跨组件使用
- 6.envetBus 平级组件数据传递 这种情况下可以使用中央事件总线的方式
- 7.vuex状态管理

#### 三.Vue的表单结构（内含组件间的通信方式）（vueAssembly2/vue-form）

## vueRouter封装（./vue-router）

#### 一、文件关系
- compinents 存放vue-router的俩个核心组件
- history 存放浏览器跳转相关逻辑
- create-matcher.js 创建匹配器
- create-route-map.js 创建路由映射表
- index.js 引用时的入口文件
- install.js install方法


#### 1.当使用vueRouter的时候使用的是index.js文件（在router/index.js中引入的就是自己写的vue-router/index.js，里面的use方法是默认会调用当前返回对象的install方法）

#### 2.因为index.js中放入太多，所以提取出 install.js 单独作为一个文件。
- 这个install文件 内部一般会用他来定义一些全局的内容 指令  全局组件 给原型扩展方法
- Vue.mixin 方法   给所有组件的生命周期都增加beforeCreate方法
- beforeCreate方法中判断是否有router属性，如果有，说明是根实例，并将根实例挂载到_routerRoot属性上，把当前router实例挂载在_router上； 如果没有，将父组件渲染后会渲染子组件，保证所有子组件都拥有_routerRoot属性，指向根实例。保证所有组件可以通过this._routerRoot._router 拿到用户传递进来的路由实例对象


#### 3.index.js中在Vue-Router上增加一个init方法，主要目的是初始化功能

#### 4.index.js中在VueRouter类中开始写路由（匹配到对应路径显示对应的组件）
- 根据用户传递的routes创建匹配关系，this.matcher需要提供俩个方法：1. match 用来匹配规则；
2.addRoutes 用来动态添加路由

#### 5.编写createMatcher方法（在create-matcher.js文件里）
- 收集所有的路由路径，收集路径的对应渲染关系
- addRoutes 动态加载路由的方法，将新增的路由追加到pathList和pathMap中，在这个方法中需要添加createRouteMap方法，创建映射关系

#### 6.编写createRouteMap方法（在create-route-map.js文件里）
- 编写addRouteRecord这个方法，将当前路由存储到pathList和pathMap中，在里面判断，是否是子路由，如果是需要增加前缀，获取record提取需要的信息；  判断pathMap对象有没有path属性，如果没有在pathList数组里添加path属性，并将record属性赋值给pathMap[path];   递归添加子路由，每一个route.children子路由，再次递归调用addRouteRecord来添加子路由
- addRouteRecord 这个方法是处理路径和不同路径对应的记录

#### 7.编写浏览器历史相关代码
- vue路由有三种模式  hash/h5api/abstrat，为了保证嗲用时方法一致。我们需要提供一个base类，在分别实现子类，不同模式下通过父类调用对应子类的方法
- 再index.js分开写一个专门编写浏览器历史的相关代码的history/hashHistory.js, 这里我们以 hash 路由为主，
- 1.创建 hash 路由实例 2.如果是hash路由，打开网站如果没有hash默认应该添加 #/ 3.在init初始化里，先拿到当前路劲，进行匹配逻辑  4. 让路由系统过渡到某个路劲
- setupListener  监听路径变化；  
  - 根据当前hash值，过渡到对应路径
- getCurrentLocation 子类获取对应的路径；  
  - 获取到#后面的路由
- transitionTo  父类提供方法负责跳转；
  - createRoute方法是获取到路径的，如{path:'/',matched:[record,record]},如果有record记录，就将当前记录的父亲放到前面
  - 去匹配路径用match方法（是调用create-matcher.js的match方法获取路由：根据location用户传入的路径找到对应的记录，根据记录创建对应的路由，找不到则返回空匹配），相同的路径不必过渡，用updateRoute方法（这个方法和当路由发生变化不是一个方法，它只是更新current属性，而下面还需要更新_route属性）更新路由，将输入的路由（location）转变为最新的current路径

- setupHashListener 跳转成功后注册路径监听，为视图更新做准备
- 路径发生变化时都会更改 current 属性，所有可以把current属性变成响应式的，每次current变化刷新视图即可。变成响应式的就用到了Object.defineProperty,指获取用get方法，不用set设置即可,而是通过Vue.util.defineReactive更新，这个方法是vue中响应式数据变化的核心
- 当路径变化时需要执行此回调更新 _route 属性 ，在init方法中增加监听函数
  - listen :注册函数;  
    - 将用户传来的函数重新放到回调函数中，
  - updateRoute:更新current，更新_route属性

#### 8.编写Router-Link 及 Router-View组件
- 获取到tag，并触发在context.parent绑定$router的路由链接
- 根据matched(也就是current渲染页面) 渲染对应的router-view

#### 9.beforeEach实现（现在是异步工作的，并且携带一个 next 函数作为其第三个参数）
- 将fn注册到heforeHooks队列中
- 将用户函数注册到数组中
  - 迭代queue,把注册函数通过 iterator将本次迭代到hook  传递给iterator函数中，将下次的权限也一并传入
  - runQueue依次执行队列，执行完毕后更新路由



# vuex 原理

#### vuex使用
```
// 跨组件通信（Store可以看做一个容器，里面有组件，状态等）
export default new Vuex.Store({//内部会创造一个vue实例，通信用的
  state: {//组件的状态   new Vue（data）
    age:28
  },
  getters: {//获取 计算属性  new Vue(computed) 依赖 当依赖的值变化后会重新执行
    getAge(state){//如果返回的结果相同，不会重新执行这个函数
      //如果age属性不发烧变化  就不会重新执行
      return state.age + 10;
    }
  },
  mutations: {//vue中的方法  唯一可以改变状态方法
    changeAge(state,payload){//同步的
      state.age += payload
    }
  },
  actions: {//通过action中发起请求,异步操作
    changeAge({commit}){
      setTimeout(()=>{
        commit('changeAge',10)
      },3000)
    }
  },
  modules: {
  }
})
```

`
在store的index.js里面创建一个new Vuex.Store的实例，这个实例默认情况下可以设置状态state，计算属性getters，mutations、actions,还可以通过模块modules的方式，去定义a模块、b模块。把上述数据进行一个格式化操作，格式化成一个响应的结果之后，在进行安装

在main.js里把store注入，引入自己的store
引入我们自己写的vuex，默认找的是我们自己创造的一个插件vuex/index.js，这个文件主要导出了Store这个类，还有就是insatll方法：默认用这个插件的时候，会使用Vue.use(Vuex)默认会去执行当前对应的install方法

install方法主要做了个Mixin,这个方法里，让所有人有一个叫$store,$store指向的都是我们在根实例中注入的store那个属性，这样的话所有组件就共用了一个store的实例。它通过的是Vue.mixin做了一个合并。

用户new的时候，new的就是我的类class Store。用户把参数传递给我。我在这里做了一个模块的收集，把这个模块格式化成了一个我想要的结果new ModuleCollection,作用就是把我们用户传入的数据变成一个树状结构，格式化成一个this.root对象，对象里有一个_raw属性，指的就是当前用户定义的那个对象；同样加了一个孩子属性_children，把它里面的模块都放到了它的孩子里去了，同样把单独的状态state拎出去了，因为等会再写代码的时候,用户在调mutations的时候，a模块里的mutations里面的状态，指代的肯定是同级的state状态，默认情况向外面的状态指的是最外层的状态。
作用映射的时候，映射成了每个模块对应到自己的状态，用的时候更加方便（模块.state）

register将树结构格式化，默认会传一个数组，根据这个数组实现一个递归操作，每次创建的时候都创建了一个模块 new Module，通过类的好处是我们可以通过一些共用的方法，放到module这个实例中，可以调用它的方法。
Module这个类中有三个属性:_rawModule,_children,state。内部可以格式化很多方法，这些方法可以通过这个类来拓展。
register这个方法刚开始的时候path的长度是0，所有当前创建的模块是根模块；之后会循环这个根模块，如果他有rootModule.modules这个属性，他就有儿子模块，儿子模块接着去调用注册方法也就是格式化方法，并且将当前模块的名字进行拼接。
拼接的时候path的长度不再是0了，那么注册的是子模块，如果子模块有多层注册的情况，要先找到最小的孙子辈，将最小的孙子注入到它的父辈上。所以做了截取，先找到它的父辈通过reduce方法，先从根模块this.root开始找找到它的父辈，。memo就是根模块，通过根模块拿到它的父辈。再在父辈上添加最小的孙子。完成递归操作

格式完以后，就拿到了一个根状态this._modules_root.state.

把这个模块进行安装，默认情况下，模块是没有命名空间的概念。所以需要把左右模块里的mutations，actions,getter都分别放到三个对象里，内部会维护三个对象，分别会把所有模块中的mutations，actions,getter都放到这个对象里，一对多，可能不同模块下有同名的方法；所以调了installModule，中this指的是当前实例，state根状态，空数组表示它里面还有递归放到这个对象里，在根模块进行安装。
运行这个方法，有那个根模块遍历自己身上的mutations，actions,getter，它的孩子


`


# ssr
- ssr 服务端渲染 （页面在服务器渲染后，返回给前端）
- spa 页面<div id="app"><div> 无法去爬取dom元素 不利于seo优化
- 多页面应用有利于seo优化的  像原生开发页面可以建立很多html  去实现seo
- vue-server-render vue实现了可以在node中解析vue  实现将实例渲染成一个字符串


> 预渲染（启动一个浏览器 生成html，加载这个页面的时候先显示html在进行替换，适合一些静态页面） 服务端渲染 （更好 博客新闻类）

#### SSR的缺陷
- SSR会占很多服务器内存（缓存）
- 浏览器一些api无法正常使用了  beforCreate (created)

> 页面渲染完后发起ajax请求数据，用请求来的数据渲染页面（js很大，首屏白屏问题），服务端渲染在后台请求数据直接用于渲染（可以减少白屏时间）
> 通过一份代码打包 出俩份代码  -> 用node  渲染打包的结果  ->  字符串（没有交互能力） 再把另一份打包的结果插入到页面中

### 配置一个vue的开发环境
- webpack(打包) webpack-cli(解析参数)
- vue-loader


## 配置一个Vue的开发环境
- webpack(打包)  webpack-cli(解析参数) webpack-dev-server(webpack开发环境)
- vue-loader（解析.vue文件）    vue-style-loader（支持服务端渲染）  css-loader（处理css）  vue-template-compiler（解析template标签）
- @babel/core（babel核心模块）  @babel/preset-env（高级语法转换成低级语法）
- babel-loader（解析js文件的）
- html-webpack-plugin（打包html插入到页面中）
- webpack-merge webpack合并文件



<!-- http://localhost:8080/index.client.html -->