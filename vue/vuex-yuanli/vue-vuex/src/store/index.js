import Vue from 'vue'
import Vuex from '../vuex'

// 因为它内部创建了一个vue实例，所以无法脱离vue
Vue.use(Vuex)
// 跨组件通信（Store可以看做一个容器，里面有组件，状态等）
export default new Vuex.Store({//内部会创造一个vue实例，通信用的
  state: {//组件的状态   new Vue（data）
    age: 10
  },
  getters: {//获取 计算属性  new Vue(computed) 依赖 当依赖的值变化后会重新执行
    getAge(state) {//如果返回的结果相同，不会重新执行这个函数
      //如果age属性不发烧变化  就不会重新执行
      console.log('getter执行');
      return state.age + 18;
    }
  },
  mutations: {//vue中的方法  唯一可以改变状态方法
    changeAge(state, payload) {//同步的    
      state.age += payload
    }
  },
  actions: {//通过action中发起请求,异步操作
    changeAge({ commit }) {
      setTimeout(() => {
        commit('changeAge', 10)
      }, 1000)
    }
  },
  modules: {
  }
})
