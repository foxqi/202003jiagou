export default{
    name:'router-link',
    // this指代的是当前组件
    // 插槽 分为具名插槽，如果不写name,则插槽默认为default
    render(h){
       return <a>{this.$slots.default}</a>
    }
}