// 串行：借助回调 第一个的输出是下一个的输入
// 并发（使用for循环迭代执行）
const fs = require('fs');
const isPromise = value => typeof value.then === 'function';
Promise.all = function (promises) {//全部成功才成功
    return new Promise((resolve, reject) => {
        // 异步：并发（使用for循环迭代执行）  和 串行（借助回调  第一个完成后调用第二个）
        // 遍历数组  依次拿到执行结果
        let arr = [];
        let index = 0;
        const processData = (key, data) => {
            arr[key] = data;//不能使用数组的长度来计算
            if (++index === promises.length) {
                resolve(arr)
            }
        }
        for (let i = 0; i < promises.length; i++) {
            let result = promises[i];
            if (isPromise(result)) {
                result.then((data) => {
                    processData(i, data)
                }, reject)
            } else {
                processData(i, result)
            }
        }

    })
}

// promise缺陷默认无法中断，只是不采用返回的结果
Promise.all([fs.readFile('name.txt','utf8'),fs.readFile('age.txt','utf8'),1]).then((data) => {
    console.log(data);
}).catch(err => console.log(err))







