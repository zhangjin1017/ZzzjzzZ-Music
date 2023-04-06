<template>
  <div class="account">
    <div class="main">
      <div class="form-container" :class="loginMode">
        <div class="form-item-box">
          <v-form v-model="value" ref="accountForm" @keyup.enter.native="handleAccountLogin">
            <v-text-field v-model="account" :rules="rules.Email" label="输入邮箱" outlined required></v-text-field>
            <v-text-field name="password" v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.password" :type="showPassword ? 'text' : 'password'" label="输入密码" outlined @click:append="showPassword = !showPassword"></v-text-field>
            <v-btn style="width: 100%;" x-large color="primary" :loading="loading" @click="handleAccountLogin">密码登录</v-btn>
          </v-form>
        </div>
        <div class="form-item-box">
          <v-form v-model="value" ref="captchaForm" @keyup.enter.native="handleCodeLogin">
            <v-text-field v-model="account" :rules="rules.Email" ref="captchaFormPhone" label="输入邮箱" outlined required></v-text-field>
            <v-row>
              <v-col cols="7">
                <v-text-field v-model="captcha" :rules="rules.captcha" label="输入验证码" outlined></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-btn x-large class="get-captcha-btn" :loading="getCaptchaLoading" :disabled="Boolean(getCaptchaTimeout)" @click="getCaptcha">{{ getCaptchaTimeout > 0 ? `${getCaptchaTimeout}秒` : '获取验证码' }}</v-btn>
              </v-col>
            </v-row>
            <v-btn style="width: 100%;" x-large color="primary" :loading="loading" @click="handleCodeLogin">验证码登录</v-btn>
          </v-form>
        </div>
      </div>
      <v-btn rounded class="switch" :class="loginMode" @click="switchLoginMode">
        {{ loginModeEnum[loginMode].left }}
        {{ loginModeEnum[loginMode].text }}
        {{ loginModeEnum[loginMode].right }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { validateTel, validateEmail } from '@/utils/validate'
import { Dialog } from 'vant'
import axios from 'axios'
import store from '@/store'
export default {
  name: 'Account',
  data() {
    return {
      loginMode: 'password', // password(密码登录) 或 code(验证码登录)
      loginModeEnum: {
        password: {
          text: '切换验证码登录',
          left: '',
          right: '→'
        },
        code: {
          text: '切换密码登录',
          left: '←',
          right: ''
        }
      },
      value: false,
      showPassword: false,
      loading: false,
      getCaptchaLoading: false,
      getCaptchaTimeout: 0,
      getCaptchaTimer: null,
      account: '1216916137@qq.com',
      phone: '',
      password: '123456',
      captcha: '',
      isGetCaptcha: true,
      rules: {
        Email: [v => !!v || '邮箱不能为空', v => validateEmail(v) || '邮箱格式错误'],
        // phone: [
        //   v => !!v || '手机号不能为空',
        //   v => validateTel(v) || '手机号格式错误'
        // ],
        password: [v => !!v || '密码不能为空'],
        captcha: [v => this.isGetCaptcha || !!v || '验证码不能为空']
      }
    }
  },
  methods: {
    handleAccountLogin() {
      //所有输入框都不为空
      if (this.account && this.password) {
        this.loading = true
        //邮箱 密码登录
        axios
          .post('http://43.140.252.215:80/music/login/loginByPassword/' + this.account + '/' + this.password)
          .then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.$message({
                content: '登录成功'
              })
              this.loading = false
              
              var data={
                userInfo:res.data.data
              }
              this.$emit('login', data)
              //跳转到首页
              this.$router.push({ path: '/' })

              
             
            } else {
              this.$message({
                content: res.data.msg
              })
              this.loading = false
            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      } else {
        this.$message({
          content: '请填写完整信息'
        })
      }
    },
    getCaptcha() {
       //如果邮箱为空
       if (!this.account) {
        this.$message({
          content: '邮箱不能为空',
        })
        return
      }else{
        //邮箱格式错误
        if (!validateEmail(this.account)) {
          this.$message({
            content: '邮箱格式错误',
          })
          return
        }
      

      this.getCaptchaLoading = true
      //访问login/sendVerifyCodeForLogin/{email}接口
      axios.get('http://43.140.252.215:80/music/login/sendVerifyCodeForLogin/'+this.account).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            content: '验证码已发送',
          })
          this.getCaptchaLoading = false
          this.getCaptchaTimeout = 60
          this.getCaptchaTimer = setInterval(() => {
            this.getCaptchaTimeout--
            if (this.getCaptchaTimeout <= 0) {
              clearInterval(this.getCaptchaTimer)
              this.getCaptchaLoading = false
            }
          }, 1000)
        } else {
          this.$message({
            content: res.data.msg,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
    },
    handleCodeLogin() {
      //所有输入框都不为空
      if (this.account && this.captcha) {
        this.loading = true
        //邮箱 验证码登录
        axios
          .post('http://43.140.252.215:80/music/login/doVerifyCodeForLogin/' + this.account + '/' + this.captcha)
          .then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.$message({
                content: '登录成功'
              })
              this.loading = false
              //存储用户信息
              this.$emit('login', data)
              //跳转到首页
              this.$router.push({ path: '/' })
            } else {
              this.$message({
                content: res.data.msg
              })
              this.loading = false
            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      } else {
        this.$message({
          content: '请填写完整信息'
        })
      }
    },
    switchLoginMode() {
      this.loginMode === 'password' ? (this.loginMode = 'code') : (this.loginMode = 'password')
      this.$refs.accountForm.resetValidation()
      this.$refs.captchaForm.resetValidation()
    }
  }
}
</script>

<style scoped lang="scss">
.account {
  position: relative;
  .main {
    width: 100%;
    padding: 10px;
    overflow: hidden;
    .form-container {
      display: flex;
      width: calc(200% + 30px);
      left: 0;
      transition: 0.3s;
      &.code {
        transform: translateX(calc(-50% - 15px));
      }
      .form-item-box {
        width: calc(50% - 15px);
        &:first-child {
          margin-right: 30px;
        }
      }
    }
    .switch {
      width: 150px;
      margin-top: 30px;
      transition: 0.3s;
      position: absolute;
      left: 10px;
      &.password {
        left: calc(100% - 160px);
      }
    }
  }
  .get-captcha-btn {
    width: 100%;
    height: 56px;
  }
  ::v-deep {
    .col {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
