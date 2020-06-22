const path=require('path');
const VueLoaderPlugin=require('vue-loader/lib/plugin')
const HtmlWebpackPlguin=require('html-webpack-plugin')

module.exports={//导出打包的配置文件
   entry:path.resolve(__dirname,'src/client-entry.js'),
   output:{
       filename:'bundle.js',
       path:path.resolve(__dirname,'dist')
   },
   module:{
       rules:[
           {
               test:/\.css$/,
               use:['vue-style-loader','css-loader']//从右向左
           },
           {
               test:/\.js$/,
               use:{
                   loader:'babel-loader',
                   options:{//解析js  将高级语法转换低级语法
                       presets:['@babel/preset-env']
                   }
               },
               exclude:/node_modules/
           },
           {
               test:/.vue$/,
               use:'vue-loader'
           }
       ]
   },
   plugins:[
       new VueLoaderPlugin(),
       new HtmlWebpackPlguin({
           template:path.resolve(__dirname,'public/index.client.html'),
           filename:'index.client.html',
           minify:false
       })
   ]


}











