const addRouteRecord = (routes, pathList, pathMap) => {
    let path = route.path;
    let record = {//根据当前路由产生一个记录 path/component
        path,
        component: route.component,
    }
    if (!pathMap[path]) {//防止用户编写路由时有重复的，不去覆盖
        pathMap[path] = record
        pathList.push(path)
    }
    // 要将子路由也放到对应的pathMap和pathList
    if(route.children){
        route.child.forEach(R=>{
            addRouteRecord(r,pathList,pathMap);
        })
    }



}
export function createRouteMap(routes, oldPathList = [], oldPathMap = {}) {

    let pathList = oldPathList || [];
    let pathMap = oldPathMap || {};
    routes.forEach(route => {
        addRouteRecord(route, pathList, pathMap);
    });
    return {
        pathList,
        pathMap
    }
}







