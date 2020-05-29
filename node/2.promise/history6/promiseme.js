// 自写promise

console.log('my');

const RESOLVED = 'RESOLVED';//成功
const REJECTED = 'REJECTED';//失败
const PENDING = 'PENDING';//等待态
const resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) {
        return reject(new TypeError('链式调用不能用同一个promise'))
    }
    // 后续的条件要严格判断  保证代码能和别的库一起使用
    let called;
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {//有可能是一个promise
        // 要继续判断
        try {
            let then = x.then;
            if (typeof then === 'function') {//只能认为是一个promise了
                // 不要写成x.then  直接then.call就可以了  因为x.then 会再次取值
                then.call(x, y => {//根据promise的状态决定是成功还是失败
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, e => {
                    if (called) return;
                    called = true;
                    reject(e)
                })

            } else {//{then:'23'}
                resolve(x)
            }

        } catch (e) {
            if (called) return;
            called = true;
            reject(e);//取值出错
        }
    } else {
        resolve(x)
    }
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];//专门用来存放成功的回调
        this.onRejectedCallbacks = [];//专门用来存放失败的回调
        let resolve = (value) => {//调用此方法就是成功
            if (this.status === PENDING) {
                this.value = value;
                this.status = RESOLVED;
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)//立即执行
        } catch (e) {//错误处理  需要直接走错误逻辑
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {

            if (this.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // todo...
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    // todo...
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }

        });
        return promise2;
    }
}


// 测试自己写的promise好不好
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}
// 要下载第三方插件
// npm install promises-aplus-tests -g
// 在这个文件下运行 promises-aplus-tests promise.js
module.exports = Promise



















