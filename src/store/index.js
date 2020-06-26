import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      // 更新vuex的state token
      state.user = payload.user
      // 本地更新
      auth.setUser(payload.user)
    },
    // 删除token
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
