let id = 0;//每个dep也要有每个标识
class Dep {
    constructor() {
        this.id = id++;
        this.subs = []
    }
    depend() {
        this.subs.push(Dep.target);//观察者模式
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }


}

let stack = [];
// 目前可以做到 将watcher保留起来  和  移除的功能
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher)

}
export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1]

}

export default Dep




