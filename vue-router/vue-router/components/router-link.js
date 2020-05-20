export default{
    name:'router-link',
    // this指代的是当前组件
    // 插槽 分为具名插槽，如果不写name,则插槽默认为default
    functional:true,
    props:{
        to:{
            type:String,
            required:true
        },
        tag:{
            type:String
        }
    },

    render(h,context){
        let tag = context.tag||'a';
        const clickHandler=()=>{//指定跳转方法
            context.parent.$router.push(context.props.to);//调用$router中的push方法进行跳转 
        }
       return h(tag,{
           on:{
               click:clickHandler
           }
       },context.slots().default);
    }
}