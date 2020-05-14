export default class History{
    constructor(router){
        this.router = router;
    
    }
    transitionTo(location,complete){
        // 获取当前路径匹配出对应的记录，当路径变化时获取对应的记录  => 渲染页面（router-view实现的）
        console.log(location);//匹配路径
        complete && complete();

    }
}