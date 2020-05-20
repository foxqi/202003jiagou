
export default{
    name:'router-view',
    functional:true,//函数式组件  函数不用new  没有this 没有生命周期  没有数据data
    render(h,context){
        // this.$route 有matched属性，这个属性有几个就一次的将他赋予到对应的router-view上
        let {parent,data}=context;
        let route = parent.$route;
       let depth=0;
       data.routerView=true;//标识路由属性
       while(parent){
           if(parent.$vnode && parent.$vnode.data.routerView){
               depth++;
           }
           parent=parent.$parent;
       }
       let record= route.matched[depth];
       if(!record){
           return h();//渲染一个空元素
       }
      
       return h(record.component,data)
    }
}