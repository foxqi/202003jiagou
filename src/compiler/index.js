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
 const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
 const startTagClose = /^\s*(\/?)>/   // 匹配标签结束的 >
 const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配默认的分隔符 "{{}}"

 function start(tagName,attrs){
    console.log('开始标签：',tagName,'属性是：',attrs);
    
 }

function parseHTML(html){
    // 不停的解析html
   while (html){
      let textEnd = html.indexOf('<');
      if(textEnd == 0){
        //   如果当前索引为0  肯定是一个标签  开始标签  结束标签
       let startTagMatch = parseSartTag();//通过这个方法获取到匹配的结果 tagName，attrs
       start(startTagMatch.tagName,startTagMatch.attrs)
      }  
      let text;
      if(textEnd >= 0){
          text = html.substring(0,textEnd)
      }
      if(text){
          advance(text.length);
          ChannelSplitterNode(text)
          break;
      }
   }
   function advance(n){
      html = html.substring(n);
   }
    function parseSartTag(){
        let start = html.match(startTagOpen)
        if(start){
            const match={
                tagName:start[1],
                attrs:[]
            }
            advance(start[0].length);//将标签删除
            let end,attr ;
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))  ){
                // 将属性进行解析
                advance(start[0].length);//将属性去掉
                match.attrs.push({
                    name:attr[1],
                    value:attr[3] || attr[4] || attr[5]
                });//放在了attrs这个属性中
    
            }
            if(end){//去掉开始标签的 >
                advance(end[0].length);
            }
            return match
            console.log(match)
            console.log(html)
        }
    }
}


export function compileToFunction(template){
    console.log(template,'---');
    let root = parseHTML(template)

    return function render(){

    }
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













