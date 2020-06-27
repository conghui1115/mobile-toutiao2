<template>
  <div class="scroll-wrapper">
    <!-- 文章列表  -->
    <!-- van-list 可以帮助我们实现上拉加载 需要一些变量 -->
        <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
      </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      console.log('加载数据')
      setTimeout(() => {
        // 这里用this， 用ES6函数
        this.finished = true
      }, 1000)
    }
  }
}
</script>

<style>

</style>
