import History from './base';

const ensureSlash=()=>{
    //  如果想写兼容，自己要通过#去截取，window.location.href.slice('#')[0]
    if(window.location.hash){//这个方法不兼容
        return
    }
    window.location.hash='/'
}

export default class HashHistory extends History{
    constructor(router){
        super(router);
        this.router = router;
        // 如果使用hashHistory  默认如果没有hash  应该跳转到  首页 #/

        ensureSlash();
        
    }
    getCurrentLocation(){
        return window.location.hash.slice(1);
    }
    setupListener(){   
        window.addEventListener('hashchange',()=>{
            // 再次执行匹配操作
            this.transitionTo(this.getCurrentLocation())
        })
    }
}