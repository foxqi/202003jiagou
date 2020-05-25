<template>
  <div>
      <input type="text" :value="value" @input="handleInput">
  </div>
</template>

<script>
export default {
    model:{
        // 可以重新定义v-model解析出来的结果
    },
    name:'elInput',
    props:{//属性不能改，你可以让父组件的数据更新  => 让子再次更新
        value:{
            type:String,
        }
    },
    methods:{
        handleInput(e){
            this.$emit('input',e.target.value)
            // 组件在创建的过程中会确定父子关系  指代的是组件
            // this.$parent.$emit('validate')
            // $parent 指向不明确 就会出现parent.parent
            // 解决方法:自己实现dispatch
            this.$dispatch('elFormItem','validate')
        }
    }
}
</script>

<style>

</style>