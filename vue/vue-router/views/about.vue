<template>
  <div>
      <h1>关于</h1>
      
      <router-link to="/about/a">a</router-link>
      <router-link to="/about/b">b</router-link>
      <router-view></router-view>
   </div>
</template>


<script>
export default {
  name:'about'
}
</script>

<style>

</style>