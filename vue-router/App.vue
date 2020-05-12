<template>
  <div>
      导航
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
      <!-- 目前还不具备渲染 -->
      <router-view></router-view>

  </div>
</template>

<script>
export default {
   name:'App'
}
</script>

<style>

</style>