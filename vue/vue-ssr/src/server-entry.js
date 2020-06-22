// 以前代码是运行在客户端上的  每个人都有一个独立的vue实例

// 如果跑在服务端上，不能所有人用的都是一个实例


import creatApp from './app'

// 服务端渲染打包需要返回一个函数

export default ()=>{
    // 这个函数会在访问服务器时被调用，是在服务端执行的
    const {app} = createApp();

    // 服务端需要拿到一个vue 的实例，而且每个用户都是全新的
    return app;
}