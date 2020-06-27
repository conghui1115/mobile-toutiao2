<template>
<div class="container">
   <van-nav-bar left-arrow title='登录' @click-left="$router.back()"></van-nav-bar>
   <!-- 登录布局 -->
  <van-cell-group>
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim='loginForm.mobile' label='手机号' placeholder="请输入手机号"></van-field>
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
  </van-cell-group>
  <!-- 登录按钮 -->
  <div class="login-box">
    <van-button @click="login" type="info" round size='small' block="">登录</van-button>
  </div>
</div>

</template>

<script>
import { login } from '@/api/login'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errorMessage: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 验证手机号
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 验证通过
      this.errorMessage.mobile = ''
      return true
    },
    // 验证短信验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码为6位数字'
        return false
      }
      // 验证通过
      this.errorMessage.code = ''
      return true
    },
    ...mapMutations(['updateUser']),
    // 登录按钮
    async login () {
      // 同时校验
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        try {
          const result = await login(this.loginForm)
          this.updateUser({
            user: result
          })
          const { redirectUrl } = this.$route.query
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          this.$notify({ message: '用户名或者验证码错误', duration: 800 })
        }

        // 调接口 跳转
      }
    }
  }
}
</script>

<style>
.login-box{
  padding:20px
}
</style>
