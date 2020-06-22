const path=require('path');
const HtmlWebpackPlguin=require('html-webpack-plugin')
const merge = require('webpack-merge');
const base=require('./webpack.base')

module.exports=merge(base,{
    mode:'development',
    entry:{
        client:path.resolve(__dirname,'../src/client-entry.js'),
    },
    plugins:[
        new HtmlWebpackPlguin({
            template:path.resolve(__dirname,'../public/index.client.html'),
            filename:'index.client.html',
            minify:false
        })
    ]
})