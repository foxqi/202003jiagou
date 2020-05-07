// 专门做调度的一个js

let queue = [];
let has = {};
import {nextTick} from '../util/next-tick';
function flusSchedularQueue(){
    queue.forEach(watcher => watcher.run())
    queue = [];//让下一次可以继续使用
    has = {};
}
export function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        queue.push(watcher);
        has[id] = true;

        // 宏任务和微任务（vue里面使用了Vue.nextTick）
        // Vue.nextTick = promise /mutatuinObserver/setImmediate/setTimeout//优雅降级


        nextTick(flusSchedularQueue)
    }
}