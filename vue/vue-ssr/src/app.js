import Vue from 'vue';
import App from './App.vue';
export default () => {
    let app = new Vue({
        render: h => h(App)
    });

    return { app }
}


