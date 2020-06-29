<template>
<div class="container">
  <!-- 标签栏 -->
  <van-tabs v-model="activeIndex">
    <van-tab v-for="item in channels" :title="item.name" :key="item.id" >
      <!-- 内容列表组件 -->
      <ArticleList :channel_id='item.id' @showAction="openAction"></ArticleList>
    </van-tab>
  </van-tabs>
  <!-- tabs下放置图标 编辑频道的图标 -->
  <span class="bar_btn"><van-icon name='wap-nav'></van-icon></span>
  <van-popup :style="{width:'80%'}" v-model="showMoreAction">
    <more-action @dislike="dislikeArticle"></more-action>
  </van-popup>
</div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
import MoreAction from './components/moreAction'
import { dislikeArticle } from '@/api/articles'
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示与隐藏
      articleId: null,
      activeIndex: 0// 当前频道激活的页签
    }
  },
  components: {
    ArticleList,
    'more-action': MoreAction
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels // 更新data 里的channels
    },
    // 弹出层显示操作s's
    openAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    // 对文章不感兴趣
    async dislikeArticle () {
      // 调用不感兴趣的文章接口
      try {
        await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        })
        // await下方的逻辑 是 resolve(成功)之后 的
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该 触发一个事件 利用事件广播的机制 通知对应的tab 来删除 文章数据
        // 除了 传一个文章之外 你还需要告诉 监听事件的人 现在处于哪个频道 可以传递频道id
        // this.channels[this.activeIndex].id // 当前激活的频道数据
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 监听了这个事件组件 就要根据id来删除数据
        this.showMoreAction = false // 此时关闭弹层
      } catch (error) {
        // 默认是红色
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
  },
  created () {
    this.getMyChannels()
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
