<template>
  <div class="scroll-wrapper">
    <!-- 文章列表  -->
    <!-- van-list 可以帮助我们实现上拉加载 需要一些变量 -->
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh" :success-text="successText">
        <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="我是有底线的">
          <!-- 循环内容 -->
          <van-cell-group>
            <van-cell v-for="item in articles" :key="item" title="哈哈成功" :value="'排队'+item"></van-cell>
          </van-cell-group>
        </van-list>
    </van-pull-refresh>
   </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [],
      isRefresh: false,
      successText: ''
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      console.log('加载数据')
      if (this.articles.length > 50) {
        this.finished = true // 关闭加载
      } else {
        const arr = Array.from(Array(15), (value, index) =>
          this.articles.length + index + 1
        )
        // 上拉加载，是把数据追加到数组结尾
        this.articles.push(...arr)
        this.upLoading = false
      }

      // setTimeout(() => {
      //   // 这里用this， 用ES6函数
      //   this.finished = true
      // }, 1000)
    },
    // 下拉刷新
    onRefresh () {
      const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
      this.articles.unshift(...arr)
      // 手动关闭加载
      this.isRefresh = false
      this.successText = `更新了${arr.length}条数据`
    }
  }
}
</script>

<style>

</style>
