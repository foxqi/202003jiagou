<template>
  <div id="app">
    <!-- 相当于个edit绑定一个事件，这个事件是自己写的input -->
    <Edit @input="handleInput" @run="handleRun"></Edit>
    <!-- 这里可以传入属性也可以传入方法 -->
    <Show :code="code" ref="show"></Show>
  </div>
</template>

<script>
// 这里的向上查找文件的.可以替换成@是webpack的用法以防出现../.././/的多级查找
import Edit from './components/edit.vue'
import Show from './components/show.vue'
export default {
  components:{//注册组件
    Edit,
    Show
  },
  data(){
    return {code:''}
  },
  methods:{
    handleInput(v){
      this.code = v; 
    },
    handleRun(){
      this.$refs.show.run()
    }
  }

}
</script>

<style lang="stylus">
* {
  margin: 0;
  padding: 0;
}

html, body, #app {
  width: 100%;
  height: 100%;
}

#app {
  display: flex;

  & > div {
    width: 50%;
    height: 100%;
  }
}
</style>

