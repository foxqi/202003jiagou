export const createRoute = (record, location) => {//根据匹配到的记录来计算匹配到的所有记录
    let metched = []
    if (record) {
        while (record) {
            metched.unshift(record)
            record = record.parent;//通过当前记录找到所有的父亲  /about
        }
    }

    return {//{path:'/',matched:[{}]}
        ...location,
        metched
    }
}

export default class History {
    constructor(router) {
        this.router = router;

        // 这个代表的是   当前路径匹配出来的记录
        //  / {path:'/',component:home}
        this.current = createRoute(null, {
            path: '/'
        })
        // this.current ={path:'/',matched:[]}

    }
    transitionTo(location, complete) {
        // 获取当前路径匹配出对应的记录，当路径变化时获取对应的记录  => 渲染页面（router-view实现的）

        // 通过路径拿到对应的记录  有了记录之后 就可以找到对应的匹配
        this.current = this.router.match(location)
        console.log(location);
        console.log(this.current);

        // console.log(location);//匹配路径
        complete && complete();

    }
}