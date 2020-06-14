import { forEach } from "../util";
import Module from './module'

export default class ModuleCollection{
    constructor(options){
        // console.log(options);
        // 注册模块  递归注册  根模块
        this.register([],options);    
    }
    register(path,rootModule){//ast语法树解析一样
        let newModule=new ModuleCollection(rootModule)
        if(path.length==0){
            this.root=newModule
        }else{
            let parent =path.slice(0,-1).reduce((memo,current)=>{
                return memo.getChild(current);
            },this.root)
            parent.addChild(path[path.length-1],newModule)
        }
        if(rootModule.modules){
            forEach(rootModule.modules,(module,moduleName)=>{//[b,c]
                this.register([...path,moduleName],module);
            })
        }

    }
}

// 格式化树结构

// this.root={
//     _raw:xxx,
//     _childrren:{
//         a:{
//             _raw:xxx,
//             state:a.state
//         },
//         b:{
//             _raw:xxx,
//            _childrren:{
//             state:b.state
//            }
//         }
//     },
//     state:xxx.state
// }










