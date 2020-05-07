// 自写vue的核心代码,只是vue的一个声明
import {initMixin} from './init';
import {renderMixin} from './render';
import {lifecycleMixin} from './lifecycle';

import {initGlobalAPI} from './initGlobalAPI/index'

function Vue(options){
    //进行vue的初始化操作
    this._init(options);

}
// 通过引入文件的方式 给vue原型上添加方法
initMixin(Vue)  //给vue原型上添加一个_init方法
renderMixin(Vue);
lifecycleMixin(Vue);




// 初始化全局的api
initGlobalAPI(Vue)
export default Vue