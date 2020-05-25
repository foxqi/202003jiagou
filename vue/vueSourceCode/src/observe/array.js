// 这里为什么要重写数组的方法呢，是因为用户是在前台把数组更新了，但是我们怎么获取更新的数组呢，只能在监听到用户传的方法也就是前面的value.__protp__=arrayMethods获取到所有的方法，然后这边在根据方法和传入的值在进行数组更新，然后在返回新的数组



//  我要重写数组的哪些方法  ：7个  push shift  unshift  pop  reverse sort splice 会导致数组本身发生变化
// slice（）这个方法并不会改变数组，就不用去通知了也不需要劫持，我们只监听数组变了的方法


// 这就是原型链查找问题，会向上查找，先查找我重写的，重写的没有会继续向上查找
let oldArrayMethods = Array.prototype;//设置这个变量是为了如果用户调用了我们没有重写的方法（比如slice），会直接调用Array基类的方法
// value.__propo__ = arrayMethods(数组通过原型链指向了arrayMethods)
//arrayMethods.__propo__ = oldArrayMethods(arrayMethods通过原型链指向了oldArrayMethods)
export const arrayMethods = Object.create(oldArrayMethods); // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 也就是这端代码 等于 arrayMethods.__propo__ = oldArrayMethods


const methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'sort',
    'splice',
    'reverse'
]

methods.forEach(method=>{
    // 在arrayMethods这个属性上增加上面那些方法，调这些方法的时候会传入很多参数
    arrayMethods[method] = function(...args){//...agrs是{name: "zf", age: 3}
       // console.log('用户调用了方法');// AOP 切片编程  
        const result = oldArrayMethods[method].apply(this,args);//调用原生的数组方法,这里的this指的是value,因为是value调用的,这个result返回的是value的length


       // 判断：如果添加的元素可能还是一个对象

        let inserted;//当前用户插入的元素
        let ob =this.__ob__;//这里的this是指value，因为value在外面定义了value.__ob__=this;，这指向Observer的实例，而这个实例又有observerArray方法，所以可以调用observerArray方法
        switch(method){
            case 'push':
            case 'usnshift':
                inserted = args;
                break;
            case 'splice':  //3个  新增的属性  splice 有删除 新增 的功能 arr.splice(0,1，{name:1})
                inserted = args.slice(2);     //获取到最后新增的数据截取出来
            default:
                break;            
        }
        if(inserted) ob.observerArray(inserted);//将新增对象属性继续观测
        ob.dep.notify();//如果用户调用了push方法  我会通知当前这个dep去更新
        return result;//这是是为了上面arrayMethods[method]=result,这个result就是为了改变this指向，让外面调用原生的方法
    }
})







