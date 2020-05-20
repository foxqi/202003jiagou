
export default{
    name:'router-view',
    functional:true,//函数式组件  函数不用new  没有this 没有生命周期  没有数据data
    render(h){
        // this.$route 有matched属性，这个属性有几个就一次的将他赋予到对应的router-view上
       let depth=0;
       let route=this.$route;
       return <div></div>
    }
}