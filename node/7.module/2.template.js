// 实现自定义的模板引擎 

// const ejs = require('ejs'); // 第三方模块
const path = require('path');
// ejs.renderFile(path.resolve(__dirname,'template.html'),{name:'zf',age:11,arr:[1,2,3]},(err,data)=>{
//     console.log(data);
// })
const fs = require('fs');
const renderFile = (filePath,obj,cb) =>{
    fs.readFile(filePath,'utf8',function (err,html) {
        if(err){
            return cb(err,html);
        }
        // arguments[0] 就是匹配到的原字符串 arguments[1] 就是第一个原来括号
        html = html.replace(/\{\{([^}]+)\}\}/g,function () { // RegExp.$1
            let key = arguments[1].trim();
            return '${'+key+'}' // {{name}} => ${name}  
        });
        let head = `let str = '';\r\n with(obj){\r\n`;
        head += 'str+=`'
        html = html.replace(/\{\%([^%]+)\%\}/g,function () {
            return '`\r\n'+arguments[1] + '\r\nstr+=`\r\n'
        })
        let tail = '`}\r\n return str;'
        let fn = new Function('obj',head + html + tail)
        cb(err,fn(obj));
    });
}
renderFile(path.resolve(__dirname,'my-template.html'),{name:'zf',age:11,arr:[1,2,3]},function (err,data) {
    console.log(data);
});


