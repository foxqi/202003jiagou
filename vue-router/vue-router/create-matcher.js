import createRouteMap from './create-route-map'
import {createRoute} from './history/base.js'
export default function createMatcher(routes){
//    routes是用户自己配置的 但是用起来不方便

// pathList 会把所有的路由  组成一个数组 ['/','/about','/about/a','/about/b']
// pathMap {/:{},/about:{},/about/a:{}}
   let {pathList,pathMap} = createRouteMap(routes)
  console.log(pathList) 
  console.log(pathMap) 

   function match(location){//等会要通过用户输入的路径  获取对应的匹配记录
      let record = pathMap[location];//获取对应的记录 
      return createRoute(record,{
          path:location
      })
   }
   function addRoutes(routes) {//routes动态添加的路由
       createRouteMap(routes,pathList,pathMap)
   }
   return {
       match,
       addRoutes
   }
    
}







