export default{
    name:'router-view',
    render(h){
       return <div>{this.$slots.default}</div>
    }
}