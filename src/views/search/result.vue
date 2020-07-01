<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 -->
    <van-list v-model="upLoading" @load = "onload" :finished="finished">
      <van-cell-group>
        <!-- 文章列表结构 -->
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/articles'

export default {
  data () {
    return {
      upLoading: false, // 上拉加载
      finished: false, // 表示当前页是否加载全部完成 如果完成 应该finished设置为true
      articles: [], // 放置搜索的文章
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的条数
      }

    }
  },
  methods: {
    async onload () {
      const { q } = this.$route.query // 获取参数
      const data = await Articles.searchArticle({ ...this.page, q })
      this.articles.push(...data.results)
      this.upLoading = false
      // 如果你返回的查询记录是 0 我此时认为 没有下一页的数据了
      if (data.results.length) {
        this.page.page++ // 下一页
      } else {
        this.finished = true // 没有数据了
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
