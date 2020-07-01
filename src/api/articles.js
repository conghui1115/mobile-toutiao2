/****
 * 处理文章模块的请求数据
 *
 * ***/
import request from '@/utils/request'

/****
 * 获取文章推荐数据
 *  需要传入 timestamp 时间戳  channel_id (频道id)
 * ****/
export function getArticles (params) {
  return request({
    // 这里必须用完整地址 因为 之前设置的baseURL是 v1_0
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并 数据
  })
}

// 不感兴趣文章接口
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
// 举报接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
// 获取联想搜索建议
export function getSuggestion (params) {
  return request({
    url: 'suggestion', // 搜搜建议地址
    params
  })
}
// 搜索文章方法
export function searchArticle (params) {
  return request({
    url: '/search',
    params // query的参数 关键词分页信息
  })
}
// 获取文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}` // 获取文章详情地址
  })
}
