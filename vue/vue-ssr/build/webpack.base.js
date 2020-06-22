const path=require('path');
const VueLoaderPlugin=require('vue-loader/lib/plugin')

module.exports={//导出打包的配置文件
   output:{
       filename:'[name].bundle.js',
       path:path.resolve(__dirname,'../dist')
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
   ]


}











