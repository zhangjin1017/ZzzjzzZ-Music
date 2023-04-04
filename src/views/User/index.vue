<template>
  <div class="personal-center">
    <v-row>
      <v-col cols="12" md="4">
        <v-card
          class="mx-auto"
          max-width="344"
        >
        <v-img v-if="$store.getters.userInfo.img" height="200px" :src="$store.getters.userInfo.img" />
        <v-img v-else height="200px" src="/src/assets/images/defaultAvatar.svg" />
          <v-card-title>
            {{ $store.getters.userInfo.name }}
          </v-card-title>
          


          <v-card-subtitle>
            {{ $store.getters.userInfo.email }}
          </v-card-subtitle>

          <v-card-text>
            {{ $store.getters.userInfo.introduction }}
          </v-card-text>
        
          <v-card-actions>
            
        <v-btn
          color="red lighten-2"
          dark
          @click="dialog = true"
        >
          退出登录
        </v-btn>
      
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>













    <v-dialog
      v-model="dialog"
      persistent
      width="300"
    >
      

      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text style="font-size: 1rem;">
          确定要退出登录吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="!loading && (dialog = false)"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="loading"
            text
            @click="logout"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>




    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'My',
  data() {
    return {
      dialog: false,
      loading: false
    };
  },
  methods: {
    logout() {
      this.loading = true
      this.$api.login.logout().then(res => {
        if(res.code == 200) {
          this.dialog = false
          this.$store.commit('user/setUserInfo', {})
          this.$router.replace({
            name: 'Home'
          })
          location.reload()
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style scoped lang="scss">
.personal-center {
  
}
</style>