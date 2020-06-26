import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant
import vant from 'vant'
import 'vant/lib/index.css'

Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
