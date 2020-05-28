// promise就是一个类
// 1.promise 有三个状态：成功态（resolve）  失败态（reject） 等待态（pending又不成功又不失败）
// 2.用户自己决定失败的原因和成功的原因 ，成功和失败也是用户定义的
// 3.promise默认执行器时立即执行
// 4. promise的实例都拥有一个then方法，一个参数是成功的回调，另一个是失败的回调
// 5.如果执行函数时发生了异常也会执行失败逻辑
// 6.如果promise一旦成功就不能失败，反过来也是一样的

// 自写promise

console.log('my');

const RESOLVED = 'RESOLVED';//成功
const REJECTED = 'REJECTED';//失败
const PENDING = 'PENDING';//等待态

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
        if (this.status === RESOLVED) {
            onFulfilled(this.value)
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)
        }
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                // todo...
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                // todo...
                onRejected(this.reason)
            })
        }
    }
}
module.exports = Promise



















