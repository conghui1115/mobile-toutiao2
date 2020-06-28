/**
 * 站门处理频道的请求
 */
import request from '@/utils/request'
// 获取频道
export function getMyChannels () {
  // 返回一个Promise
  return request({
    url: '/user/channels'
  })
}
