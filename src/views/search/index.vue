<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <!-- 历史记录存在才显示 -->
      <div class="head" v-if="historyList.length">
        <span >历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把这个位置变成动态的 -->
        <van-cell v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 注册点击叉号 -->
          <van-icon @click="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hm-94-toutiao-history'// 历史记录本地缓存
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: []
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      // 删除要先在data中删除数据 然后把data中的数据同步到 本地缓存中
      this.historyList.splice(index, 1) // 直接删除对应的历史记录数据
      // 将数据同步到 本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    }
  },
  created () {
    // ['黑马','马云','猫咪']
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
