export const createRoute=(record,location)=>{
   let metched = []
   return {
       ...location,
       metched
   }
}

export default class History{
    constructor(router){
        this.router = router;

        // 这个代表的是   当前路径匹配出来的记录
        //  / {path:'/',component:home}
        this.current = createRoute(null,{
            path:'/'
        }) 
    
    }
    transitionTo(location,complete){
        // 获取当前路径匹配出对应的记录，当路径变化时获取对应的记录  => 渲染页面（router-view实现的）

// 通过路径拿到对应的记录  有了记录之后 就可以找到对象的匹配
        let record = this.router.match(location)
        console.log(location);//匹配路径
        complete && complete();

    }
}