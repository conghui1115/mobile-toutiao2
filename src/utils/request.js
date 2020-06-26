/**
 * request.js 处理请求拦截  请求时带入token 响应的时候结构数据
 * token失效 处理失效
 * 处理大数字失真问题 json-bigint
 */
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 新建一个axios 的实例 在实例上做些拦截 不破坏原有的axios
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 为基础请求地址
  transformResponse: [function (data) {
    // data 是后台响应回来的字符串
    return data ? JSONBig.parse(data) : {}
  }]
})

// 请求拦截器 token 注入
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做什么
  if (store.state.user.token) { config.headers.Authorization = `Bearer ${store.state.user.token}` }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 请求响应拦截器
// 结构两层data
// 请求过去带去的token   处理响应的token 失效
instance.interceptors.response.use(function (response) {
  // axios默认包了一层 data
  // 几乎所有的返回数据都有一层data
  try {
    return response.data.data // 如果有两层则托两层
  } catch (error) {
    // 否则脱一层
    return response.data
  }
}, async function (error) {
  /**
   *  逻辑判断状态码401 认证失败  --token无效 则查看是否有token—>refresh_token ?
   *    refresh_token 存在 则换取token 重新请求 ：如果不存在 则直接跳转登录页,携带当前页的地址
   */
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath
      }
    }
    if (store.state.user.refresh_token) {
      try {
        const result = await axios({
          url: 'authorizations',
          method: 'put',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // 得到的result 更新vuex 的token 和本地
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token // 还是原来的token
          }
        })
        // 再次发送请求
        return instance(error.config)
      } catch (error) {
        // 重新登录 重新登录之前 需要  删除掉 token 因为此时 token失效 refesh_token也失效
        store.commit('delUser') // 删除token 因为失效了
        router.push(path)
      }
    } else {
      // 直接跳转
      store.commit('delUser') // 删除token 因为失效了
      router.push(path)
    }
  }
  return Promise.reject(error)
})

// 导出
export default instance
