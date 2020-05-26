// 观察者模式  有观察者  肯定有被观察者  观察者需要放到被观察者中，被观察者的状态发生变化需要通知观察者，我变化了

// 内部也基于发布订阅模式，  收集观察者  状态变化后要通知观察者

class Subject{//被观察者  小宝宝
    constructor(name){
        this.name=name;
        this.state ='开心的';
        this.observers =[];
    }
    attach(o){
        this.observers.push(o);
    }
    setState(newState){
        this.state=newState;
        this.observers.forEach(o=>o.update())
    }
}

class Observer{//观察者  我  我媳妇
    constructor(name){
        this.name = name
    }
}

// 我和我媳妇  需要观察小宝宝的心里状态的变化
let baby = new Subject('小宝宝');
let parent = new Observer('爸爸');
let mother = new Observer('妈妈');


