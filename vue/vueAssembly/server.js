const express =require('express');
const app = express();
app.use(express.static(__dirname))
app.listen(8000);



//设置跨域请求

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

const arr = [];
for(let i = 10; i <=20;i++){
    arr.push(`http://localhost:8000/images/${i}.jpeg`)
}
app.get('/api/img',(req,res)=>{
    res.json(arr)
})
// 启动后访问http://localhost:8000/api/img