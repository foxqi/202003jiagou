let compiler = require('vue-template-compiler');

let t = `<div v-if="true">hello</div>
<div v-else>world</div>`


// vue-loader这个逐渐就会采用vue-template-compiler这个第三方插件进行编译
console.log(compiler.compile(t).render);

// with(this){return (true)?_c('div',[_v("hello")]):_c('div',[_v("world")])}