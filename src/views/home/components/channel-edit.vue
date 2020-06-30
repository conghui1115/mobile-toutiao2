<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 我的频道循环 -->
      <van-grid class="van-hairline--left">
        <van-grid-item  v-for="(item,index) in channels" :key="item.id">
          <span :class="{red: index=== activeIndex}" @click="$emit('selectChannel',item.id)" class="f12">{{item.name}}</span>
          <van-icon  @click="$emit('delChannel',item.id)" v-if="index!==0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  props: {
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  computed: {
  // 可选频道 = 全部频道--自己的频道 数组相减
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    // 调用全部接口,记得加this
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
