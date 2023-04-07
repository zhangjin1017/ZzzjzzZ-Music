<template>
  <v-app>
    <div class="register">
      <v-icon large class="back" @click="back">mdi-keyboard-backspace</v-icon>
      <div class="content" :class="$vuetify.breakpoint.mobile ? 'mobile' : ''">
        <div class="form-box">
          <p class="title">注册</p>
          <transition name="slide-y-reverse-transition" mode="out-in">
            <div class="form-item-box">
              <v-form v-model="value" ref="captchaForm" @keyup.enter.native="handleCodeLogin">
                <v-text-field v-model="account" :rules="rules.Email" ref="captchaFormPhone" label="输入邮箱" outlined required></v-text-field>
                <v-row>
                  <v-col cols="7">
                    <v-text-field v-model="captcha" :rules="rules.captcha" label="输入验证码" outlined required></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-btn x-large class="get-captcha-btn" :loading="getCaptchaLoading" :disabled="Boolean(getCaptchaTimeout)" @click="getCaptcha">{{ getCaptchaTimeout > 0 ? `${getCaptchaTimeout}秒` : '获取验证码' }}</v-btn>
                  </v-col>
                </v-row>
                <v-text-field
              name="password"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="rules.password"
              :type="showPassword ? 'text' : 'password'"
              label="输入密码"
              outlined
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              name="repassword"
              v-model="repassword"
              :append-icon="showRePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="rules.password"
              :type="showRePassword ? 'text' : 'password'"
              label="确认密码"
              outlined
              @click:append="showRePassword = !showRePassword"
            ></v-text-field>
                <v-btn style="width: 100%;" x-large color="primary" :loading="loading" @click="Register">注册</v-btn>
              </v-form>
            </div>
          </transition>
        </div>

        <el-link type="primary" @click="goToLogin">去登陆</el-link>
      </div>
    </div>

    <!-- message组件 -->
    <Message style="bottom: 70px" />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Message from '@/components/Layout/Message'
import { Dialog } from 'vant'
import { validateTel, validateEmail } from '@/utils/validate'
//axios
import axios from 'axios'
export default {
  name: 'Register',
  components: {
    Message
  },
  data() {
    return {
     
      value: false,
      showPassword: false,
      showRePassword: false,
      loading: false,
      getCaptchaLoading: false,
      getCaptchaTimeout: 0,
      getCaptchaTimer: null,
      account: '',
      phone: '',
      password: '',
      repassword: '',
      captcha: '',
      isGetCaptcha: true,
      rules: {
        Email: [v => !!v || '邮箱不能为空', v => validateEmail(v) || '邮箱格式错误'],
        // phone: [
        //   v => !!v || '手机号不能为空',
        //   v => validateTel(v) || '手机号格式错误'
        // ],
        password: [v => !!v || '密码不能为空'],
        repassword: [v => !!v || '密码不能为空'],
        captcha: [v => this.isGetCaptcha || !!v || '验证码不能为空']
      }
    }
  },

  computed: {
    ...mapState('history', ['historyArr'])
  },
  methods: {
    close() {
      this.message.isShow = false
    },
    back() {
      const historyArr = this.$store.getters.historyArr
      if (historyArr[historyArr.length - 2]) {
        this.$router.back()
      } else {
        this.$router.replace({
          name: 'Home'
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
      this.getCaptchaLoading = true
      //访问login/sendVerifyCodeForRegister/{email}接口
      axios.get('http://43.140.252.215:808080/music/login/sendVerifyCodeForRegister/'+this.account).then(res => {
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
    Register() {
      if (this.password !== this.repassword) {
        this.$message({
          content: '两次密码输入不一致',
        })
        return
      }
      //所有输入框都不为空
      if (this.account && this.password && this.repassword && this.captcha) {
        this.loading = true
        //访问login/doVerifyCodeForRegister/{email}/{code}/{password}接口
        axios.post('http://43.140.252.215:808080/music/login/doVerifyCodeForRegister/'
      +this.account+"/"+this.captcha+"/"+this.password).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            content: '注册成功',
          })
          //跳转到登录页面
          this.$router.push({
            name: 'Login'
          })
        } else {
          this.$message({
            content: res.data.msg,
          })
        }
      }).catch(err => {
        console.log(err)
      })
      } else {
        this.$message({
          content: '请填写完整信息',
        })
      }

      

      // Dialog.alert({
      //   title: '提示',
      //   message: '由于服务器未启动,登录功能暂未开放'
      // }).then(() => {
      //   // on close
      // })
    },

    goToLogin() {
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.register {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .back {
    position: fixed;
    z-index: 999;
    top: 20px;
    left: 20px;
  }
  .content {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 48px 40px 36px;
    width: 450px;
    height: 500px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    transition: var(--animationTime);
    &.mobile {
      width: 100%;
      height: 100%;
      border: 1px solid transparent;
      padding: 48px 20px 30px;
    }

    .form-box {
      width: 100%;
      .title {
        font-size: 24px;
        color: #202124;
        text-align: center;
        margin-bottom: 40px;
      }
    }
  }
}
</style>
