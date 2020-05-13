// 这个文件夹是自己封装的vue-router插件

import install from './install';
import createMatcher from './create-matcher';
class VueRouter{
    constructor(options){
        // 创建匹配器的过程  1.匹配功能match   2.可以添加匹配 动态路由添加  addRoutes 权限

       this.matcher = createMatcher(options.routes ||  []);//获取用户的整个配置

    }
    init(app){//目前这个app指代的就是最外层new Vue
      //需要用户的配置  做出一个映射表来  
    }
}

VueRouter.install =install;
export default VueRouter







