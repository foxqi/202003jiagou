const Vue= require('vue')
const VueServerRenderer= require('vue-server-renderer')
const Koa= require('koa')
const fs=require('fs')
const Router= require('@koa/router')

let app = new Koa();//创建一个服务实例
let router=new Router();//创建路由实例

let vm = new Vue({
    data(){
     return {name:'zf'}
    },
    template:'<div>hello {{name}}</div>'
})
const serverBundle= fs.readFileSync('./dist/server.bundle.js','utf8')
const template =fs.readFileSync('./dist/index.ssr.html','utf8')

let render = VueServerRenderer.createBundleRenderer(serverBundle,{
   template
})
// 通过服务端渲染对应的服务端打包后的结果
router.get('/',async(ctx)=>{
   // 如果渲染的内容  需要增添样式 需要采用回调的方式
   ctx.body=await new Promise((resolve,reject)=>{
      render.renderToString((err,html)=>{
         resolve(html)
      })
   })
})

app.use(router.routes());
app.listen(3000)




