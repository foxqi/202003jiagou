

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


let root = null;//ast语法树的树根
let currentParent;//标识当前父亲是谁
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement(tagName, attrs) {
    return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs,
        parent: null
    }
}

function start(tagName, attrs) {
    //console.log('开始标签：', tagName, '属性是：', attrs);
    //遇到开始标签 就创建一个ast元素
    let element = createASTElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    currentParent = element;//把当前元素标记成父ast树
    stack.push(element);//将开始标签存放在栈中

}
function chars(text) {
    // console.log('文本是：', text)
    text =text.replace(/\s/g,'');
    if(text){
        currentParent.children.push({
            text,
            type:TEXT_TYPE
        })
    }
}
function end(tagName) {
    // console.log('结束标签', tagName)
    let element = stack.pop();//拿到的是ast对象
    //我要标识当前这个p是属于这个div的儿子的
    currentParent = stack[stack.length-1];
    if(currentParent){
        element.parent = currentParent;
        currentParent.children.push(element);//实现了一个树的父子关系
    }
}



export function parseHTML(html) {
    // 不停的解析html
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            //   如果当前索引为0  肯定是一个标签  开始标签  结束标签
            let startTagMatch = parseSartTag();//通过这个方法获取到匹配的结果 tagName，attrs
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)//1.解析开始标签
                continue;//如果开始标签匹配完毕后，继续下一次 匹配
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch);//2.解析结束标签
                continue;
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length);
            chars(text)//3.解析文本
        }
    }
    function advance(n) {
        html = html.substring(n);
    }
    function parseSartTag() {
        let start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);//将标签删除

            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // 将属性进行解析
                advance(attr[0].length);//将属性去掉
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                });//放在了attrs这个属性中

            }
            if (end) {//去掉开始标签的 >
                advance(end[0].length);
                return match
            }
        }
    }
    return root;
}