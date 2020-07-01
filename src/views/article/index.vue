<template>
  <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo"/>
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button @click="follw" round size="small" type="info">{{article.is_followed? '已关注':'+关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" plain icon="delete" class="active:article.attitude === 0">不喜欢</van-button>
      </div>
    </div>
   <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading" >
      <!-- 加载进度条 -->
      <div class='loading-container'>
         <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
export default {
  data () {
    return {
      article: {}, // 接收文章数据
      loading: false
    }
  },
  methods: {
    async getArticleInfo () {
      this.loading = true
      const { artId } = this.$route.query // id值
      this.article = await getArticleInfo(artId)
      this.loading = false
    },
    // 关注或者取消关注
    async follw () {
      try {
        if (this.article.is_followed) {
          // 已经关注点击则取消关注
          await unfollowUser(this.article.aut_id) // 传入作者
        } else {
          // 如果没关注 点击关注
          await followUser({ target: this.article.aut_id })
        }
        // 关注状态 是反的
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$gnotify({ message: '操作失败' })
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
