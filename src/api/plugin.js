export default {
// 导出一个默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
  }
}
