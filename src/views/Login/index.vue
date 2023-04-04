<template>
  <v-app>
    <div class="login">
      <v-icon
        large
        class="back"
        @click="back"
      >mdi-keyboard-backspace</v-icon>
      <div class="content" :class="$vuetify.breakpoint.mobile ? 'mobile' : ''">
        <div class="form-box">
          <p class="title">登录</p>
          <transition name="slide-y-reverse-transition" mode="out-in">
            <keep-alive>
              <component :is="model" @login="handleLogin"></component>
            </keep-alive>
          </transition>
        </div>
      
        <el-link type="primary" @click="goToRegister">立即注册</el-link>
      </div>
    </div>
    
    <!-- message组件 -->
    <Message style="bottom: 70px" />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Message from '@/components/Layout/Message'
import account from './components/AccountLogin'

export default {
  name: 'Login',
  components: {
    Message,
    account
  },
  data() {
    return {
      model: 'account',
     
    }
  },

  computed: {
    ...mapState('history', ['historyArr']),
    ...mapState('user', ['userInfo'])
  },
  methods: {
    ...mapMutations('user', ['setUserInfo']),
    close() {
      this.message.isShow = false
    },
    back() {
      const historyArr = this.$store.getters.historyArr
      if(historyArr[historyArr.length - 2]) {
        this.$router.back()
      } else {
        this.$router.replace({
          name: 'Home'
        })
      }
    },
    
    handleLogin(data) {
      const userInfo = data.userInfo

      this.setUserInfo(userInfo)

      const replaceParam =  this.historyArr.length > 1 ? this.historyArr[this.historyArr.length - 2] : { name: 'Home' }

      this.$nextTick(() => {
        this.$router.replace(replaceParam)
      })
    },
    goToRegister() {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
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