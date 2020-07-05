import Vue from 'vue'
import VueRouter from 'vue-router'
// import { compile, component } from 'vue/types/umd'

Vue.use(VueRouter)
const Layout = () => import('@/views/layout') // 按需引入layout
const home = () => import('@/views/home') // 按需引入home 二级路由
const question = () => import('@/views/question') // 按需引入question 二级路由
const video = () => import('@/views/video') // 按需引入video  二级路由
const user = () => import('@/views/user') // 按需引入user 二级路由
// 其他的一级路由
const chat = () => import('@/views/user/chat') // 小智同学
const login = () => import('@/views/login') // 登录模式
const profile = () => import('@/views/user/profile') // 编辑资料
const search = () => import('@/views/search') // 搜索中心
const searchresult = () => import('@/views/search/result') // 搜索结果
const article = () => import('@/views/article') // 文章中心
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: home,
        meta: {
          isAlive: true
        }
      }, {
        path: '/question',
        component: question
      },
      {
        path: '/video',
        component: video
      },
      {
        path: '/user',
        component: user
      }
    ]
  },
  {
    path: '/user/chat',
    component: chat
  },
  {
    path: '/user/profile',
    component: profile
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/search',
    component: search
  },
  {
    path: '/search/result',
    component: searchresult
  },
  {
    path: '/article',
    component: article
  }

]

const router = new VueRouter({
  routes
})

export default router
