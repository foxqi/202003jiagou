// 把data中的数据 都使用Object.defineProperty重新定义  这是一个es5的方法
// Object.defineProperty不能兼容ie8及以下，vue2无法兼容ie8版本
import {isObject,def} from '../util/index'
import {arrayMethods} from './array.js'
import Dep from './dep.js'
/**
 *   步骤一：先创建一个Observer类进行数据监听，如果传入进来的data是个  对象  的话，遍历对象，用Object.defineProperty中的get和set方法进行数据变化的监听，如果对象里面嵌套对象，那么就用递归的方式进行深度监听
 *   步骤二：如果传入进来的data是个  数组   的话，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能，所以为了不给数组的索引进行get，set监听，遍历数组获得每个对象，在给里面的每个对象进行监听
 *    步骤三：当data是个数组的话，如果用户对这个数组进行了方法调用改变数组（比如用了push，unshift等方法）我们也要对方法进行重写，进行监听，并重新赋值。
 * （这一步的大概逻辑是：会导致数组本身发生变化的方法写成一个数组，然后遍历在调用原生方法，将原生方法进行输出，具体看array.js）
 *       
 * 
 * 
 * 
 * 
 * 
 */



/* 步骤一 start*/ 

//创建一个Observer的类
class Observer{
   constructor(value){//这里的constructor是es6的新写法，一个类必须有 constructor 方法，一般 constructor 方法返回实例对象 this ，但是也可以指定  constructor 方法返回一个全新的对象，让返回的实例对象不是该类的实例。
    //这是constructor的概念https://www.jianshu.com/p/fc79756b1dc0


/* 步骤三.2 start*/ 
//value.__ob__=this;//我给每一个监控过的对象都增加一个__ob__属性，这的this指的是Observer的实例,为了给后面的方法调用observerArray，进行数据监听
// 上面的方法不能直接在vulue上加属性，因为下面的observe会进行数据监听，它会以为value增加新的数据，而上面的方法只是为了以后数据调用代码而进行赋值的，所以只能用下面的方法
     def(value,'__ob__',this)
/* 步骤三 end*/

/* 步骤二 start*/ 

    // 如果是传进来的是数组，那么它会对索引进行监听并附有get和set方法,如果有一百万个数组那么会监听一百万次，很浪费性能
    if(Array.isArray(value)){
        //如果是数组的话并不会对索引进行观测，因为会导致性能问题
        // 前端开发中很少很少  去操作索引  push  shift  unshift

/* 步骤三.1 start*/ 
       value.__proto__= arrayMethods;
/* 步骤三 end*/ 


        // 如果数组里放的是对象我在监控
        this.observerArray(value);
    }else{
        //vue如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
        this.walk(value)// 先考虑一步的数据
    }

   }

/* 步骤二 end*/ 

/* 步骤二 start*/   
//这个方法是为了不给数组的索引进行get，set监听，直接遍历数组获得每个对象，在给对象进行监听
   observerArray(value){//value是[{}],用observe监控了数组的每一项
        for(let i=0; i<value.length;i++){
            observe(value[i])
        }
   }
/* 步骤二 end*/ 

/* 步骤一 start*/ 
   walk(data){
       let keys = Object.keys(data); //[name,age,address]

    //    for(let i=0;i<keys.length;i++){
    //         let key =keys[i];
    //         let value =data[key];
    //         defineReactive(data,key,value);//定义响应式数据
    //     }
    // 可以简化为下面的代码
        keys.forEach((key)=>{
            defineReactive(data,key,data[key]);//定义响应式数据
        })

      
   }
/* 步骤一 end*/ 
}
/* 步骤一 start*/  
function defineReactive(data,key,value){
    let dep = new Dep();
    observe(value);//这里的调用，是为了递归，获取到对象中的对象的属性:递归实现深度检测，但是如果层级太多使用递归会很浪费性能
    Object.defineProperty(data,key,{
        get(){//获取值的时候作一些操作
           //console.log('取值')//每个属性都对应着自己的watcher
           if(Dep.target){//如果当前有watcher
            dep.depend();//意味着我要将watcher存起来


           }
           return value;
        },
        set(newValue){//当数据发生变化，也可以设置一些操作

            console.log('更新数据')


           if(newValue === value)  return;
           observe(newValue);//继续劫持用户设置的值，因为有可能用户设置的值是一个对象；这里深度劫持就会在这个对象里有set和get方法，就能再次进行更改监听
           value = newValue

           dep.notify();//通知依赖的watcher来进行一个更新操作
        }
    })
}
/* 步骤一 end*/ 

/* 步骤一 start*/  

// 这里是输出Observer观察到的数据
export function observe(data){
    let isObj = isObject(data);
    if(!isObj){
        return;
    }   
   return new Observer(data)  // 用来观测数据
 
}
/* 步骤一 end*/


