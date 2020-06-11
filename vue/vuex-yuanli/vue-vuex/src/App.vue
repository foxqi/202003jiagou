<template>
  <div id="app">
  珠峰的年龄{{$store.state.age}} <br>
  <!-- <button @click="$store.state.age+=10"></button> -->
    我的年龄： {{$store.getters.getAge}} <br>

  <button @click="$store.commit('changeAge', 5)">同步更新状态</button>
    <button @click="$store.dispatch('changeAge',5)">异步更新状态</button>
  </div>
</template>
