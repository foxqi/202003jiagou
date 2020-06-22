<template>
  <div class="bar" @click="handleClick">
      foo
  </div>
</template>

<script>
export default {
  methods:{
    handleClick(){
      alert(1)
    }
  }
}
</script>

<style>
.bar{
  color: blue;
}

</style>