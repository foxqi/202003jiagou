2020年第3期架构课

开课第一天：
## vscode需要安装的插件
-  安装code run这样一个插件，为了更好的运行代码
-  在本文件中运行  npm init -y  安装初始化插件package.json，记录下载的包


一、 使用Rollup搭建开发环境
1、什么是Rollup？
 Rollup是一个JavaScript模块打包器，可以将小块代码编译成大块复杂的代码，rollup.js更专注于JavaScript类库打包（开发应用时使用Wwebpack，开发库时使用Rollup）

而webpack不仅仅能打包js，还能打包css，html，image等模块，所以它适合开发使用；而rollup主要打包js，打包体积更小，代码更加清晰，打包vue，react这样的专门js的类库，学起来也很容易


2、搭建环境
安装rollup环境
- npm install rollup @babel/core @babel/preset-env rollup-plugin-babel rollup-plugin-serve cross-env -D

   - rollup（打包工具）
   -  babel/core（用babel核心模块）
   -  @babel/preset-env  (es6转es5插件，babel高级语法转低级语法，预设代表插件的集合，它里面有很多的插件)
   -  rollup-plugin-babel （可以在rollup里使用babel插件）
   -  rollup-plugin-serve（实现静态服务）
   -  cross-env（设置环境变量）

1） 创建一个rollup的配置文件 => rollup.config.js
2） 创建一个babel的配置文件 => .babelrc
3） 依次如图创建文件，并在里面写配置


二、 使用Rollup搭建开发环境



