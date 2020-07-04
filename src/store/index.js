import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  // user:{token:'',refresh_token:''}
  state: {
    user: auth.getUser(),
    photo: null// 用户头像
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
    },
    // 更新头像
    updatePhoto (state, payload) {
      state.photo = payload.photo // 在载荷中传入photo
    }
  },
  actions: {
  },
  modules: {
  }
})
