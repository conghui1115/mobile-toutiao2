<template>
  <div class="comment">
    <van-list @load="onLoad"  v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate| relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部回复评论输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit()" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论 弹出面板 -->
 <!-- 回复 -->
    <van-action-sheet  @close="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.aut_content}}</p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import * as Article from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 所有评论
      offset: null, // 分页依据
      showReply: false,
      reply: {
        loading: false,
        finished: false,
        offset: null,
        list: [], // 评论的评论
        commentId: null // 存放当前点击的评论id
      }
    }
  },
  methods: {
    // 文章回复评论
    async  onLoad () {
      const { artId } = this.$route.query
      const data = await Article.getComments({
        type: 'a',
        source: artId,
        offset: this.offset
      })
      this.comments.push(...data.results)
      this.loading = false
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        this.offset = data.last_id
      }
    },
    // 点击回复打开弹出层，把之前弹出层的内容置空，重新拉取一次数据
    openReply (commentId) {
      // 打开弹出层
      this.showReply = true
      this.reply.commentId = commentId // 得到当前文章回复id,方法传入的
      // 弹出窗口之前，把之前的评论清空
      this.reply.list = []
      this.reply.offset = null
      this.reply.finished = false
      this.reply.loading = true // 主动打开加载状态 之前关闭了
      this.getReply()
    },
    // 获取评论的评论
    async getReply () {
      const data = await Article.getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false
      this.reply.finished = data.last_id === data.end_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    // 提交评论
    // 提交评论
    async  submit () {
    //  点击的时候要做什么 ?
    //  因为此时并没有判断用户是否登录了 先判断用户是否登录 如果没有登录 不让评论 如果登录了才可以继续
      // token
      if (this.$store.state.user.token) {
        //  此时才认为你登录了
        // 首先应该判断是否输入了 评论内容
        // 如果没有评论内容 直接返回
        if (!this.value) return false // 如果没内容 直接返回
        // 如果有内容
        this.submiting = true // 先把提交状态打开 表示在提交中 避免重复提交 只有当 提交完毕之后 才关掉状态
        // 休眠函数 来控制 执行的速度
        await this.$sleep(800) // 强制休眠800毫秒
        try {
          // 提交评论核心内容
          const data = await Article.commentOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是文章id  要么是评论id  需要根据你当前是对谁进行评论
            // 参数
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 如果是对评论进行评论 需要传该评论属于哪个文章 如果是对文章进行评论 不要传这个参数
          }) // 直接提交方法
          // 希望调用完成之后 , 添加的评论数据 直接添加到我们的评论列表
          // data.new_obj 此obj数据是添加成功的一条数据 这一条数据 我们需要 加入到列表中
          // 两种场景  文章评论  评论评论
          if (this.reply.commentId) {
            // 如果此id存在 表示对 评论进行评论
            // 将数据添加到 评论的评论
            this.reply.list.unshift(data.new_obj)
            // 如果是对评论进行评论  需要找到 对应的评论id 将评论id的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            // 寻找文章评论中 等于 当前评论id的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
          } else {
            // 表示对文章评论
            this.comments.unshift(data.new_obj) // 一般评论数据加到头部
          }
          this.value = '' // .清空评论内容
        } catch (error) {
          // 评论失败  后台设置不让评论

          this.$gnotify({ message: '评论失败' })
          this.value = ''
        }
        this.submiting = false // 状态关闭
      } else {
        try {
          // 认为你没登录
        // 告知用户 如果你想评论 你需要去登录 如果放弃评论 那就放弃
          await this.$dialog.confirm({
            message: '如果想要评论,你需要去登录'
          })
          // 如果点击了确定 需要跳到登录
          // fullPath是完整地址
          // path 是  /articles   /articles?artId=123
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath // 此地址是用户登录成功之后需要回到的页面
            }
          }) // 跳到登录页
        } catch (error) {
          console.log('点击了取消')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
