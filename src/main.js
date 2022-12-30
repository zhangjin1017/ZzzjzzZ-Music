import Vue from 'vue'
//饿了吗UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//Vant UI
import Vant from 'vant';
import 'vant/lib/index.css';

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import '@/assets/styles/style.scss'

import './filters'

import './plugins/axios'
import api  from './api'

Vue.use(ElementUI);
Vue.use(Vant);

Vue.prototype.$api = api

Vue.prototype.$message = config => {
  store.commit('layout/setMessage', config)
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
