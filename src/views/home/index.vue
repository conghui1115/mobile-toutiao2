<template>
<div class="container">
  <!-- 标签栏 -->
  <van-tabs v-model="activeIndex" swipeable @change="changeTab">
    <van-tab v-for="item in channels" :title="item.name" :key="item.id" >
      <!-- 内容列表组件 -->
      <ArticleList :channel_id='item.id' @showAction="openAction"></ArticleList>
    </van-tab>
  </van-tabs>
  <!-- tabs下放置图标 编辑频道的图标 -->
  <span class="bar_btn" @click="showChannelEdit =true"><van-icon name='wap-nav'></van-icon></span>
  <!-- 文章不感兴趣弹出层 -->
  <van-popup :style="{width:'80%'}" v-model="showMoreAction">
    <more-action @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"></more-action>
  </van-popup>
  <!-- 放编辑频道的弹出层 -->
<van-action-sheet :round="false"  v-model="showChannelEdit" title="编辑频道">
    <channel-edit @addChannel = "addChannel" @delChannel= 'delChannel' :activeIndex='activeIndex' :channels="channels" @selectChannel='selectChannel'></channel-edit>
</van-action-sheet>

</div>
</template>

<script>
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import MoreAction from './components/moreAction'
import { dislikeArticle, reportArticle } from '@/api/articles'
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示与隐藏
      articleId: null,
      activeIndex: 0, // 当前频道激活的页签
      showChannelEdit: false // 编辑频道面板显示隐藏
    }
  },
  components: {
    ArticleList,
    'more-action': MoreAction,
    'channel-edit': ChannelEdit
  },
  methods: {
    // 切换页签事件
    changeTab () {
      // 切换页签时 我要广播一个消息  让对应的页签中的文章列表  去滚动 滚动条
      // 广播中传出一个参数 传当前谁被激活了 传出当前激活索引的 id
      eventBus.$emit('changeTab', this.channels[this.activeIndex].id)
    },
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
    // operateType 是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣的文章接口
      try {
        // 需要根据一个参数来判断 是举报还是不喜欢
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) //  这里的type怎么办 ?????? 通过$event传出来
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
    },
    // 切换到对应的频道
    selectChannel (id) {
      const index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭弹层
    },
    // 删除频道的方法
    async delChannel (id) {
      // 此时应该先调用api
      try {
        await delChannel(id) // 调用api方法  此时只是删除了 缓存中的数据
        // 如果此时成功的resolve了 我们 应该去移除 当前data中的数据
        const index = this.channels.findIndex(item => item.id === id) // 找到对应的索引
        // 找到对应的索引之后
        // 要根据当前删除的索引 和 当前激活的索引的 关系 来 决定 当前激活索引是否需要改变
        if (index <= this.activeIndex) {
          //  如果你删除的索引 是在当前激活索引之前的 或者等于当前激活索引的
          // 此时就要把激活索引 给往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1) // 删除对应的索引频道
      } catch (error) {
        this.$gnotify({ message: '删除频道失败' })
      }
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)
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
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
