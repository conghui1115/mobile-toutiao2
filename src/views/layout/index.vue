<template>
<div class="container">
  <van-nav-bar title="头条" right-text="搜索" fixed @click-right="$router.push('/search')" v-if='showNavBar'></van-nav-bar>
  <div class="my-wrapper" :class="{noTop:!showNavBar}">
    <router-view></router-view>
  </div>
  <!-- 标签页 -->
  <van-tabbar route>
  <van-tabbar-item to="/" icon="home-o" >首页</van-tabbar-item>
  <van-tabbar-item to="/question" icon="search">问答</van-tabbar-item>
  <van-tabbar-item to="/video" icon="friends-o">视频</van-tabbar-item>
  <van-tabbar-item to="/user" icon="setting-o">我的</van-tabbar-item>
</van-tabbar>
</div>
</template>

<script>
export default {
  computed: {
    // 是否显示navBar  如果是路由user，不显示navbar
    showNavBar () {
      return this.$route.path !== '/user'
    }
  }
}
</script>

<style lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
