<template>
  <div class="scroll-wrapper">
    <!-- 文章列表  -->
    <!-- van-list 可以帮助我们实现上拉加载 需要一些变量 -->
        <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="我是有底线的">
          <!-- 循环内容 -->
          <van-cell-group>
            <van-cell v-for="item in articles" :key="item" title="哈哈成功" :value="'排队'+item"></van-cell>
          </van-cell-group>
        </van-list>
      </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: []
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>

</style>
