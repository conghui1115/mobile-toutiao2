import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
// 导入vant
import vant, { Lazyload } from 'vant'
import plugin from '@/utils/plugin'
import 'vant/lib/index.css'
import 'vant/lib/index.less'
import 'amfe-flexible'
import '@/styles/index.less'
Vue.use(vant)
Vue.use(Lazyload)
Vue.use(plugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
