<template>
  <div>
      <label v-if="label">{{label}}</label>
      <slot></slot>
      <span v-if="errorMessage">{{errorMessage}}</span>
  </div>
</template>

<script>
import Schema from 'async-validator'
export default {
    name:'elFormItem',
    inject:['elForm'],//注入  去找父亲的._provided属性 找到后合并到自己的身上
    data(){
        return {errorMessage:null}
    },
    props:{
        label:{
            type:String,
        },
        prop:{
            type:String,
        }
    },
    methods:{
        validate(){
            if(this.prop){
                let value = this.elForm.model[this.prop];//当前数据
                let ruleValue=this.elForm.rules[this.prop];
            
                console.log(value,ruleValue);
                // 在element中安装一个async-validate这个包，可完成校验
                let schema = new Schema({
                    [this.prop]:ruleValue
                })
                return schema.validate({[this.prop]:value},(err)=>{
                    if(err){
                        this.errorMessage = err[0].message;
                    }else{
                        this.errorMessage = null;
                    }

                })
            }
        }
    },
    // 在el-form-item中需要校验当前你输入的内容是否符合规范，用户更改对应的输入框，对应的el-form-item应该知道
    mounted(){//挂载的顺序  是先子在父
    this.$on('validate',()=>{
        this.validate();
        
    })

    }
}
</script>

<style>

</style>