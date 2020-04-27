//将html变成函数的话，会用到ast语法树
/*ast语法树  和 虚拟到dom有什么区别
ast语法树 是 用对象来编译html语法的（下面的原理）
虚拟dom 是  用对象来描述dom节点的（也就是那个html下面有div标签，div下面有p，span标签等的dom节点）



render函数返回的是虚拟dom，现在做的是把template变成render函数


把html不停的循环，拿出来之后组成一个树，这个树描述了一个dom结构
*/

import { parseHTML } from './parser-html'

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配默认的分隔符 "{{}}"

function genProps(attrs) {//处理属性，拼接成属性的字符串
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            //style="color:red;font-size:14px" => {style:{color:'red'},id:name}
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
function genChildren(el) {
    let children = el.children;
    if (children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}
function gen(node) {
    if (node.type == 1) {
        //元素标签
        return generate(node)
    } else {
        let text = node.text;// a {{name}}  b{{age}}  c
        // _v("a"+_s(name)+"b"+_s(age)+'c')
        let tokens = [];
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0;   // 正则的问题 lastIndex设为0才可以用exec正常匹配（具体为什么自己百度） 只要全局匹配，就需要将lastIndex每次匹配的时候就调到0处
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }


        return `_v(${tokens.join('+')})`;
    }
}

function generate(el) {//[{name:'id',value:'app'},{}]  => {id:app,a:1,b:2}
    let children = genChildren(el);
    let code = `_c("${el.tag}",${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
        }${children ? `,${children}` : ''
        }) `
    return code;
}

export function compileToFunction(template) {
    //console.log(template, '---');
    //1）解析html字符串，将html字符串 => ast语法树
    let root = parseHTML(template)
    // console.log(root)


    let code = generate(root);

    //2)需要将ast语法树生成最终的render函数  就是字符串拼接 （模板引擎）
    // 核心思路就是将模板转换成 下面这段字符串
    // <div id="app">hello<p>{{name}}</p><span>{{age}}</span></div>
    // 将ast树，再次转换成js的语法树（重点：这个是js语法 执行后返回的是虚拟dom）
    // _c('div',{id:'app'},_c('p',undefined,_v(_s(name))),_c('span',undefined,_v(_s(age))))

    // 所有的模板引擎实现，都需要new Function + with
    //这里加的with方法是为了实现ƒ anonymous(
    // ) {
    //     with(this){return _c("div",{id:"app",style:{"color":" red"}},_v("hello"),_c("p",undefined,_v(_s(name))),_c("span",undefined,_v(_s(age)))

    //         )

    //         } 
    //     }
    // 这个函数，也就是render这个函数的，因为这个才是将模板进行编译的
    let renderFn = new Function(`with(this){return ${code}} `)
    // console.log(renderFn);(renderFn返回的是一个render函数，这个函数调用后就会形成虚拟dom)

    //vue的render  它返回的是虚拟dom()
    return renderFn
}

/**
 * 通过上面的正则，可以把下面的html编译成
 * start div:  attr:[{name:'id',value:'app'}]
 * start p
 * text hello
 * end p
 * end div
 */
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













