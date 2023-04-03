<template>
  <div class="bottom-player">
    <audio
      ref="player"
      id="audio"
      preload
      :src="musicUrl"
      :key="key"
      @play="setPlayStatus"
      @pause="setPlayStatus"
      @ended="ended"
      @timeupdate="timeupdate"
      @canplay="canplay"
      @error="error"
    ></audio>
    <!-- 进度条 -->
    <ProgressBar
      class="bottom-player-progress-bar"
      :currentTime.sync="currentTime"
      :endTime="endTime"
      @setCurrentTime="setCurrentTime"
      @noUpdateCurrentTime="noUpdateCurrentTime = true"
    />
    <!-- 迷你播放器 -->
    <MiniPlayer
      class="bottom-player-box"
      :currentSongInfo="currentSongInfo"
      :currentTime="currentTime"
      :endTime="endTime"
      :playStatus="playStatus"
      :loading="loading"
      @play="musicPlay"
      @pause="musicPause"
      @handleNext="handleNextPrev('next')"
      @handlePrev="handleNextPrev('prev')"
    />
    
    <v-dialog
      v-model="showFullPlayer"
      persistent
      no-click-animation
      eager
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- 完整播放器 -->
      <FullPlayer
        :show="showFullPlayer"
        :currentSongInfo="currentSongInfo"
        :currentTime.sync="currentTime"
        :currentTimeMillisecond="currentTimeMillisecond"
        :endTime="endTime"
        :playStatus="playStatus"
        :loading="loading"
        @play="musicPlay"
        @pause="musicPause"
        @close="closeFullPlayer"
        @setCurrentTime="setCurrentTime"
        @handleNext="handleNextPrev('next')"
        @handlePrev="handleNextPrev('prev')"
      />
    </v-dialog>
  </div>
</template>

<script>
import { random } from '@/utils/random'
import { mapState, mapMutations, mapActions } from 'vuex'
import ProgressBar from './components/ProgressBar'
import FullPlayer from './components/FullPlayer'
import MiniPlayer from './components/MiniPlayer'
import Mv from "@/views/Mv"
import { detail} from '@/api/song'
import axios from 'axios'
export default {
  name: 'BottomPlayer',
  components: {
    MiniPlayer,
    FullPlayer,
    ProgressBar
  },
  data() {
    return {
      key: 0,
      updateKeyTimer: true,
      currentTime: 0,
      currentTimeMillisecond: 0,
      playStatus: false,
      currentTimeTimer: null,
      noUpdateCurrentTime: false,
      loading: false,
      showFullPlayer: false,
    
    };
  },
  methods: {
    ...mapMutations('song', [
      'setCurrentPlayTime'
    ]),
    ...mapActions('song', [
      'getCurrentSongUrl'
    ]),
    // 播放音乐
    musicPlay() {
      
      if(!this.currentSongInfo.id) return

      if(this.player?.play && this.player.networkState && this.player.networkState !== 3) {
        this.player.play()
      
      } else {
        this.player.load()
        this.updateKey(this.player.play)
       
      }
      console.log('播放音乐')

    console.log(this.currentSongInfo.id)
    //获取这首歌的信息
    this.$api.song.detail({ids:this.currentSongInfo.id+""}).then(res=>{
      console.log(res)
      var Param = {
            /** 歌曲id */
              musicId: 0,
            /** 歌名 */
              name: '',
            /** 描述 */
              description: '',
            /** 封面 */
              coverImg: '',
            /** 作者 */
              artists: '',
            /** 作者id */
              artistsId: 0,
            /** 发布时间 */
              publicTime: ''
          }
         
            Param.musicId = res.songs[0].id;
            Param.name = res.songs[0].name;
            Param.description = "热度:"+res.songs[0].pop;
           
            if(res.songs[0].fee==0){
              Param.description+="   免费或无版权";
             }
             if(res.songs[0].fee==1){
              Param.description+="   VIP 歌曲";
             }
              if(res.songs[0].fee==4){
                Param.description+="   购买专辑";
              }
              if(res.songs[0].fee==8){
                Param.description+="   非会员可免费播放低音质，会员可播放高音质及下载";
              }
            Param.coverImg = res.songs[0].al.picUrl;
           Param.publicTime = this.formatDate(res.songs[0].publishTime);
            Param.artists = res.songs[0].ar[0].name;
            Param.artistsId = res.songs[0].ar[0].id;
            if(res.songs[0].ar[1]){
              Param.artists += '、' + res.songs[0].ar[1].name;
              Param.artistsId += ',' + res.songs[0].ar[1].id;
         
          }

          console.log(Param)
           //保存到数据库
            axios.post('http://localhost:8080/music/music/saveNewMusic',Param).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
           
      
    })

    },
    // 时间戳转换为年月日
    formatDate(date) {
      var date = new Date(date);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() + ' ';
      return Y+M+D;
    },

    // 暂停音乐
    musicPause() {
      console.log('暂停音乐')
      if(this.player?.pause) {
        this.player.pause()
   
      } else {
        this.player.load()
        this.updateKey(this.player.pause)
  
      }
    },
    // 播放下一首
    playNext() {
      console.log('播放下一首')
      const index = this.waitingPlayList.findIndex(item => item.id == this.currentSongInfo.id)
      if(this.waitingPlayList[index + 1]) {
        this.$playMusic(this.waitingPlayList[index + 1].id)
      } else {
        this.$playMusic(this.waitingPlayList[0].id)
      }
    },
    // 播放上一首
    playPrev() {
      console.log('播放上一首')
      const index = this.waitingPlayList.findIndex(item => item.id == this.currentSongInfo.id)
      if(index > 0) {
        this.$playMusic(this.waitingPlayList[index - 1].id)
      } else {
        this.$playMusic(this.waitingPlayList[this.waitingPlayList.length - 1].id)
      }
    },
    // 随机播放
    shufflePlay() {
      console.log('随机播放')
      const { currentSongInfo, waitingPlayList } = this
      function getRandomId() {
        let id = waitingPlayList[Math.floor(Math.random() * waitingPlayList.length)].id
        if(id == currentSongInfo.id) {
          return getRandomId()
        } else {
          return id
        }
      }
      this.$playMusic(getRandomId())
    },
    // 点击下一首按钮
    handleNextPrev(type = 'next', isEnded = false) {
      if(this.waitingPlayList.length == 1) {
        this.$playMusic(this.currentSongInfo.id)
        return
      }
      switch(this.$store.getters.playType) {
        case 'orderPlay':
          // 顺序播放
          type == 'next'
              ? this.playNext()
              : this.playPrev()
          break
        case 'singleCycle':
          // 单曲循环
          if(isEnded) {
            this.$playMusic(this.currentSongInfo.id)
          } else {
            type == 'next'
              ? this.playNext()
              : this.playPrev()
          }
          break
        case 'shufflePlay':
          // 随机播放
          this.shufflePlay()
          break
      }
    },
    // 播放完成
    ended() {
      this.handleNextPrev('next', true)
    },
    // 设置播放状态
    setPlayStatus() {
      this.playStatus = !this.player.paused
    },
    // 跳转到指定时间
    setCurrentTime(currentTime) {
      this.player.currentTime = currentTime
      this.noUpdateCurrentTime = false
    },
    timeupdate(e) {
      this.currentTimeMillisecond = e.target.currentTime
      this.setCurrentPlayTime(this.currentTime)
    },
    canplay() {
      if(this.playStatus) {
        this.musicPlay()
      }
    },
    error() {
      if(!this.loading && !this.musicUrl) return

      this.updateKey()
    },

    // 更新key值
    updateKey(fn) {
      if(this.updateKeyTimer) {
        this.updateKeyTimer = false
        setTimeout(() => {
          this.updateKeyTimer = true
          this.key = random()
          if(fn) {
            this.$nextTick(() => {
              fn()
            })
          }
        }, 3000)
      }
    },
    // 关闭完整播放器
    closeFullPlayer() {
      if(this.showFullPlayer = true) {
        if(this.$store.getters.historyArr.length > 1) {
          this.$router.back()
        } else {
          const { showFullPlayer, ...query } = this.$route.query
          this.$router.replace({
            query
          })
        }
      }
    },
    bindMediaObject() {
      if ("mediaSession" in navigator && Object.keys(this.currentSongInfo).length) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentSongInfo.name,
          artist: this.currentSongInfo.ar.map(item => item.name).join('/'),
          album: this.currentSongInfo.al.name,
          artwork: [
            { src: this.currentSongInfo.al.picUrl + '?param=512y512',   sizes: '512x512',   type: 'image/png' }
          ]
        })
      }
    }
  },
  computed: {
    ...mapState('song', [
      'currentSongInfo',
      'waitingPlayList',
      'musicUrl'
    ]),
    endTime() {
      return this.currentSongInfo.dt / 1000
    },
    player() {
      return this.$refs.player
    }
  },
  watch: {
    '$route.query.showFullPlayer'(val) {
      this.showFullPlayer = Boolean(val)
    },
    currentSongInfo() {
      this.bindMediaObject()
    },
   
  },
  created() {
    // 设置进度条位置
    this.currentTime = this.$store.getters.currentPlayTime

    // 获取当前音乐播放链接
    if(this.currentSongInfo.id) {
      this.getCurrentSongUrl()
    }
    
    // 如果完整播放器展开，关闭完整播放器
    if(Boolean(this.$route.query.showFullPlayer)) {
      const { showFullPlayer, ...query } = this.$route.query
      this.$router.replace({
        query
      })
    }
  },
  mounted() {
    // 设置播放器当前时间
    this.setCurrentTime(this.$store.getters.currentPlayTime)

    // 开启进度条计时器
    this.currentTimeTimer = setInterval(() => {
      if(!this.noUpdateCurrentTime) {
        this.currentTime = parseInt(this.player.currentTime)
      }
    }, 250)
    
    // 绑定媒体对象
    this.bindMediaObject()
    // 绑定媒体对象的上一曲、下一曲
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', this.playNext)
      navigator.mediaSession.setActionHandler('previoustrack', this.playPrev)
    }

    //监听Mv.data().isMvOpen
  //  'Mv.data().isMvOpen'(val){
  //   if(val){
  //     console.log('Mv页面已经打开了，我要暂停')
  //     this.player.pause()
  //   }else{
  //     console.log('Mv页面已经关闭了，我要播放')
  //     this.player.play()
  //   }
  //  }
    this.$eventBus.$on('musicPause', (val) => {
      console.log('Mv页面已经打开了，我要暂停')
      this.musicPause();
    })
    // this.$eventBus.$on('musicPlay', (val) => {
    //   console.log('Mv页面已经关闭了，我是否要播放')
    //   //如果是,说明我本来就是播放状态,我就切换回播放状态
    //   if(this.isPlay){
    //     this.musicPlay();
    //   }else{
    //     console.log('我本来就是暂停状态,我就不播放了')
    //   }
    // })



  },
  destroyed() {
    clearInterval(this.currentTimeTimer)
  }
};
</script>

<style scoped lang="scss">
.bottom-player {
  width: 100%;
  height: 100%;
  display: flex;
  &-progress-bar {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
  }
  &-box {
    width: 100%;
  }
}
</style>