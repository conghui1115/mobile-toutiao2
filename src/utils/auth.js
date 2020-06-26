/**
 * auth.js专门处理token的读写和删除
 */
const USER_TOKEN = 'user-toutiao'
// 设置用户的token信息
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 获取用户的token
export function getUser () {
  // 将字符串转化为对象再返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}
// 删除用户token
export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
