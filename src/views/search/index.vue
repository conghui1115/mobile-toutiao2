<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 搜索框  @search方法 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
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
        <!-- 全部清空历史 -->
        <van-icon name="delete" @click="delAll"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把这个位置变成动态的  事件冒泡-->
        <van-cell @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 注册点击叉号 冒泡了 两个父子级都有点击事件-->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
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
    },
    // 跳转搜索结果页
    toSearchResult (text) {
      // this.$router 路由实例对象
      // this.$route 路由页面信息对象 当前地址信息参数 params  query 参数
      // this.$router.push('/search/result?q=' + text)
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 清空历史记录
    async  delAll () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定删除所有历史记录吗'
        })
        this.historyList = ''
        // 本地删除历史记录
        localStorage.setItem(key, '[]')
      } catch (error) {
        // 失败不需要清理
      }
    },
    // 搜索结果
    onSearch () {
      // 搜索内容不为空
      if (!this.q) return
      // 跳转之前，把搜索结果添加到历史记录里
      this.historyList.push(this.q)
      // 历史搜索去重 new set()  Arrray.from 是伪数组转为数组
      this.historyList = Array.from(new Set(this.historyList))
      // 设置本地缓存 localStorage/sessionStorage默认只能存储字符串
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  },
  created () {
    // ['黑马','马云','猫咪'] historyList是一个数组
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
