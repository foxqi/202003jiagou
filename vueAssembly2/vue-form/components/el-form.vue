<template>
  <form @submit.prevent>
      <slot></slot>
  </form>
</template>

<script>
// 跨组件传递数据
export default {
    name:'elForm',
    provide(){//elFormItem这个属性  放到了 当前的组件的_provide上
      return {elForm:this}
    },
    props:{
        rules:{
            type:Object,
            default:()=>({})//保证数据不被共享和data一样
        },
        model:{
            type:Object,
            default:()=>({})//保证数据不被共享和data一样
        },
    },
    methods:{
        resetFields(){
        //   .async  v-mode  找到输入框清理
        },
         async validate(cb){
            // 需要看一下内部的elformItem 是否都通过了校验
            // 获取所有的子组件
            let children = this.$broadcast('elFormItem');//获取所有的子元素
            try {
                await Promise.all(children.map(child =>child.validate()));
                cb(true)
            } catch{
                cb(false)
            }
   

            
            

        }
    }
}
</script>

<style>

</style>