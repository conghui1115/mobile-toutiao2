import dayjs from 'dayjs' // 引入时间插件
import 'dayjs/locale/zh-cn' // 语言
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间模块
dayjs.extend(relativeTime) // 扩展
export default {
// 导出一个默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    // 给Vue的原型属性复制一个函数
    Vue.prototype.$sleep = sleep
    // 注册成全局过滤器 名字是relTime
    Vue.filter('relTime', relTime)
  }
}

// 延迟处理函数
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
// 处理时间函数
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
