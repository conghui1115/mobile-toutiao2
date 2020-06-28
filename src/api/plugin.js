export default {
// 导出一个默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    // 给Vue的原型属性复制一个函数
    Vue.prototype.$sleep = sleep
  }
}

// 延迟处理函数
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
