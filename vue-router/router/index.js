import Vue from 'vue';
import VueRouter from '../vue-router';//1.引入的时候是个类

import Home from '../views/home.vue';
import About from '../views/about.vue';

// use 方法会调用install方法，会注册全局组件  router-link  router-view

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/about',
        component: About,
        children: [
            {
                path: 'a', component: {
                    // jsx 是js+html
                    render: h => <h1>about a</h1>//这里是jsx语法 h('h1',[about a])
                }
            },
            {
                path: 'b', component: {
                    render: h => <h1>about b</h1>//这里是jsx语法
                }
            }
        ]
    }
]

Vue.use(VueRouter)//2.能使用use,说明它包含install方法

// 3.当可以new VueRouter这个类的时候，它里面传了一个参数，这个参数是routes
export default new VueRouter({
    routes
})


