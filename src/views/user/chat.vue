<template>
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <!-- 小智 -->
    <div class="chat-list" ref="myList">
      <!-- 判断name  是否是小智  -->
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 判断是否是小智 头像是谁 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <!-- 内容 -->
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name!=='xz'" fit="cover" round :src="photo" />
      </div>
      <!-- 我
      <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <!-- 对话板 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import io from 'socket.io-client'
import XZImg from '@/assets/photo.jpeg'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      value: '',
      loading: false,
      XZImg,
      list: []
    }
  },

  computed: {
    ...mapState(['photo', 'user']) // 映射vuex中的公共变量
  },
  created () {
    //  建立与服务端的连接
    // new WebSocket (原生)
    // io 需要传参数 接口规定的
    // 初始化websocket连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法 它会拼接到 url地址上 ?后面
      query: {
        token: this.user.token // vuex中的 token
      }
    }) // 这里用this.socket 接收 目的是 在其他方法 依然可以用 this.socket获取对象实例
    // 怎么监听连接成功  ws.onopen(原生)
    // connect 是固定的写法 意思是表示当前已经建立连接成功
    this.socket.on('connect', () => {
      //  此时执行 connect事件 表示 已经和服务器打通了电话
      // 我们模拟一条数据 让用户看到 服务器和用户说话了
      this.list.push({ msg: '秃头小王子,你怎么这么好看', name: 'xz' }) // 加name的原因是想区分 这句话是谁说的
    })
    // 监听回复消息
    this.socket.on('message', data => {
      this.list.push({ ...data, name: 'xz' })
      // 消息滚动底部
      this.scrollBottom()
    })
  },
  methods: {
    // 将内容滚到最后，底部 滚动条
    scrollBottom () {
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    },
    // 发送消息方法
    async send () {
      // 调用websocket发出一个消息
      // 发消息之前 要判断
      if (!this.value) return false // 如果字符串为空就不能再发消息了
      // 如果不为空  首先需要 将状态 打开
      this.loading = true // 打开状态的目的是 放置重复提交
      await this.$sleep(500) // 强制休眠
      // 使用websocket发送消息
      // socket.io
      // socket.emit(消息类型, 消息内容)
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 给一个当前的时间戳 表示是从当前时间发送的
      }
      // 发送消息
      this.socket.emit('message', obj) // 发送消息
      // 发送消息之后 要干什么 ?
      this.list.push(obj) // 将发出的消息加入到消息列表中
      // 发送完消息之后
      this.value = '' // 清空消息内容
      this.loading = false // 关掉状态
      this.scrollBottom()
    }

  },
  beforeDestroy () {
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
