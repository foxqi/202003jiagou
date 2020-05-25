import { ASSETS_TYPE } from './const';
export default function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(type => {
        Vue[type] = function (id, definition) {
            if (type === 'component') {
                //注册全局组件
                //使用extend 方法 将对象变成构造函数
            } else if (type === 'filter') {

            } else if (type === 'directive') {

            }
            this.options[type + 's'][id] = definition

        }
    });
}