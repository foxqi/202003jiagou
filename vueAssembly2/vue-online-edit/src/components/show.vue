<template>
  <div class="show">
      <h1>代码运行结果</h1>

      <div class="show-box">
          这里显示最终的结果
      </div>
      
  </div>
</template>

<script>
export default {
    props:{
        code:{//会将这个属性放到当前的实例上
            type:String,//默认code就是一个字符串类型
            default:''
        }
    },
    methods:{
        run(){
           console.log('run');
            
        }
    }
}
</script>

<style>

</style>