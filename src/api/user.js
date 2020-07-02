// 文章中关注用户
import request from '@/utils/request'
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注用户
export function unfollowUser (autid) {
  return request({
    url: `user/followings/${autid}`,
    method: 'delete'
  })
}

/**
 * 获取用户自己的个人信息
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
// 获取用户个人资料
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
