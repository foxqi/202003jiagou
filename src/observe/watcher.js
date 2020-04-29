import {pushTarget,popTarget} from './dep.js'

let id=0;//每个watcher都有一个标识

class Watcher{
    constructor(vm,exprOrFn,callback,options){
        this.vm =vm;
        this.callback=callback;
        this.options=options;

        this.id=id++;
        this.getter=exprOrFn;//将内部传过来的回调函数  放到getter属性上

        this.get();//调用get方法，会让渲染watcher执行
    }
    get(){
        pushTarget(this);//把watcher存起来 在Dep.target
        this.getter();  //渲染watcher的执行
        popTarget();//移除watcher
    }
    update(){
        this.get();
    }
}




export default Watcher
