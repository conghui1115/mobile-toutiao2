<template>
  <div class="scroll-wrapper">
    <!-- 文章列表  -->
    <!-- van-list 可以帮助我们实现上拉加载 需要一些变量 -->
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh" :success-text="successText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="我是有底线的">
        <!-- 循环内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load  class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load  class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 一张图 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load  class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <!-- filter relTime 相对时间 -->
                <span>{{item.pubdate | relTime}}</span>
                <!-- 没有登录的时候，不显示叉号  判断依据是否有token-->
                <span class="close" v-if='user.token' @click="$emit('showAction')">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
export default {
  props: {
    channel_id: {
      required: true,
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [],
      isRefresh: false,
      successText: '',
      timestamp: null
    }
  },
  methods: {
    async onLoad () {
      console.log('开始加载文章列表数据')
      // 如果你的数据已经加载完毕 你应该把finished 设置为true 表示一切结束了 不再请求
      // 此时强制的判断总条数 如果超过100条 就直接关闭
      // vant-list组件 第一次加载 需要让 list组件出现滚动条 如果没有滚动条 就没有办法 继续往下拉
      // if (this.articles.length > 50) {
      //   // 如果此时记录已经大于100
      //   this.finished = true // 关闭加载
      // } else {
      //   // 1-60
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据 需要手动的关掉 loading
      //   this.upLoading = false
      // }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // }, 1000) // 等待一秒 然后关闭加载状态
      // this.timestamp || Date.now()  如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id指的是 当前的频道id
      //  获取内容
      this.articles.push(...data.results) // 将数据追加到队尾
      this.upLoading = false // 关闭加载状态
      // 将历史时间戳 给timestamp  但是 赋值之前有个判断 需要判断一个历史时间是否为0
      // 如果历史时间戳为 0 说明 此时已经没有数据了 应该宣布 结束   finished true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 先等500秒
      await this.$sleep()
      // 下拉树新应该发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })
      // 手动关闭下拉刷新
      this.isRefresh = false
      if (data.results.length) {
        this.articles = data.results
        if (data.pre_timestamp) {
          // 重新唤醒列表
          this.finished = false
          this.timestamp = data.pre_timestamp
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来数据
        this.successText = '当前已经是最新了'
      }
    }
  }
}
</script>

<style lang='less' scoped>
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
