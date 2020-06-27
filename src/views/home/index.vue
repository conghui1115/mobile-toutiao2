<template>
<div class="container">
  <!-- 标签栏 -->
  <van-tabs>
    <van-tab v-for="item in 8" :title="'标签'+item" :key="item">
      <!-- 内容列表组件 -->
      <ArticleList></ArticleList>
    </van-tab>
  </van-tabs>
  <!-- tabs下放置图标 编辑频道的图标 -->
  <span class="bar_btn"><van-icon name='wap-nav'></van-icon></span>
</div>
</template>

<script>
import ArticleList from './components/article-list'
export default {
  components: {
    ArticleList
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
