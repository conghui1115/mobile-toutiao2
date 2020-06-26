import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
// 导入vant
import vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import '@/styles/index.less'

Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
