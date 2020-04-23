//将html变成函数的话，会用到ast语法树
/*ast语法树  和 虚拟到dom有什么区别
ast语法树 是 用对象来编译html语法的（下面的原理）
虚拟dom 是  用对象来描述dom节点的（也就是那个html下面有div标签，div下面有p，span标签等的dom节点）



render函数返回的是虚拟dom，现在做的是把template变成render函数
*/  

// vue源码
// ?:匹配不补货
 const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'//命名空间：表示能匹配到abc-aaa这样的一个字符串
 const qnameCapture = `((?:${ncname}\\:)?${ncname})`//命名空间标签：<aaa:asdee>
 // 匹配开始标签开始部分
 const startTagOpen = new RegExp(`^<${qnameCapture}`)//标签开头的正则，捕获的内容是标签名


/**
 * 这是验证上面的正则是否正确
 * let r = '<a:b>'.match(startTagOpen);
 * console.log(r)
 * 
 * 获得这样的东西  ["<a:b", "a:b", index: 0, input: "<a:b>", groups: undefined]
 * 
 * arguments[0] = 匹配到的标签  arguments[1] = 匹配到的标签名字 
 */
 const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)// 匹配标签结尾的闭比如</div>
 // 匹配属性
 const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

 const startTagClose = /^\s*(\/?)>/   // 匹配标签结束的 >

 const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配默认的分隔符 "{{}}"




export function compileToFunction(template){
    console.log(template,'---');
    

    return function render(){

    }
}

/*
<div id="app">
    <p>hello</p>
</div>
//上面的html就会变成下面的抽象的语法，这就是ast语法树
这个root就是ast语法树
let root ={
    tag:'div',
    attrs:[//属性
        {name:'id',value:'app'}
    ],
    parent:null,
    type:1,//它是什么类型，元素类型为1
    children:[{
        tag:'p',
        attrs:[],
        parent:root,
        children:[{
            text:'hello',
            type:3,//文本类型为1
            }]
    }]
}
*/ 













