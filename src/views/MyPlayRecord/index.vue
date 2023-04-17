<template>
<div>
  <h3 id="title">{{ title }}</h3>
  <div class="playlist" v-resize="onResize">
    
    <div class="paly-list-box">
      <Songs ref="songs" :dataList="songs" v-show="!listLoading" />
      <div v-show="listLoading || listError">
        <div class="loding-box" v-show="listLoading">
          <v-progress-circular
            :size="30"
            :width="3"
            :color="$store.getters.mainColor"
            indeterminate
          ></v-progress-circular>
          <span class="text">加载中...</span>
        </div>
        <div class="loding-box" v-show="listError && !loading">
          歌曲加载失败，请<span class="text-highlight" style="font-weight: bold; cursor: pointer;" @click="getList">重试</span>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="dialog"
      width="300"
    >
      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text style="font-size: 1rem;">
          "播放全部" 将会替换当前的播放列表，是否继续?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            text
            @click="playListAll"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import Songs from '@/components/Songs'
import axios from 'axios';
import { userInfo } from 'os';
export default {
  name: 'MyPlayRecord',
  components: {
    Songs
  },
  data() {
    return {
      title:'播放记录',
      loading: false,
      listLoading: false,
      listError: false,
      unfold: false,
      pageName: '',
      id: 0,
      name: '',
      description: '',
      descriptionOverflow: false,
      coverImgUrl: '',
      artists: '',
      publishTime: '',
      trackIds: '',
      songs: [],
      dialog: false
    };
  },
  methods: {
    ...mapActions('song', [
      'playAll'
    ]),
    onResize() {
      if(this.pageName !== 'Playlist') return

      this.isDescriptionOverflow()
    },
    isDescriptionOverflow() {
      if(!this.$refs.description) return

      if(this.unfold) {
        this.unfold = false
      } else {
        this.descriptionOverflow = this.$refs.description.scrollHeight - this.$refs.description.clientHeight > 10
      }
    },
    getData() {
      this.loading = true
      this.listLoading = true
      this.unfold = false
      this.listError = false
      
      axios.get("http://43.140.252.215:8080/music/playrecord/getPlayRecordById/"+JSON.parse(localStorage.getItem("userInfo")).userId).then(res => {
        
        for (let i = 0; i < res.data.data.length; i++) {
          this.trackIds += res.data.data[i].musicId + ",";
        }
        //删除最后一个逗号
        this.trackIds = this.trackIds.substring(0, this.trackIds.length - 1);  
        this.getList();
      })
    },
    getList() {
      if(!this.trackIds) return

      this.listError = false
      this.listLoading = true

      // 防止自定义歌单过长（临时解决方案）
      if (this.trackIds.split(',').length > 1000) {
        const trackIds = this.trackIds.split(',')
        trackIds.length = 1000
        this.trackIds = trackIds.join(',')
        this.$message({
          color: 'warning',
          content: '内容过多，更多内容请使用网易云查看'
        })
      }

      this.$api.song.detail({
        ids: this.trackIds
      }).then(res => {
        res.songs.map((item, index) => {
          item.privilege = res.privileges[index]
        })
        
        this.songs = res.songs
        this.listLoading = false
      }).catch(() => {
        this.listError = true
        this.songs = []
      }).finally(() => {
        this.listLoading = false
        this.$refs.songs.updatePageModeFront()
      })
    },
    renderAlbum(data) {
      this.loading = false
      this.listLoading = false

      this.name = data.album.name
      this.coverImgUrl = data.album.picUrl

      this.artists = data.album.artists.map(item => item.name).join(' / ')
      this.publishTime = data.album.publishTime

      this.songs = data.songs
    },
    handlePlayListAll() {
      if(this.listLoading) {
        this.$message({
          content: '请等待列表加载完成',
          color: 'warning'
        })
        return
      }

      this.dialog = true
    },
    playListAll() {
      if(!this.songs.length) {
        this.$message({
          content: '列表为空！',
          color: 'error'
        })
        return
      }

      this.playAll({
        playlist: this.songs,
        bottomPlayer: this.$bottomPlayer
      })
      this.dialog = false
    }
  },
  computed: {
    imgSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 145
        case 'sm': return 160
        case 'md': return 175
        case 'lg': return 190
        case 'xl': return 205
      }
    },
    lineClamp() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 2
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 3
        case 'xl': return 3
      }
    },
    getDetail() {
      const getDataMap = {
        Playlist: this.$api.playlist.playlistDetail,
        Album: this.$api.playlist.album
      }
      return getDataMap[this.pageName]
    },
    pageType() {
      return {
        Playlist: '歌单',
        Album: '专辑'
      }[this.pageName]
    }
  },
  watch: {
    '$route.params.id'(val) {
      if(!['Playlist'].includes(this.$route.name)) return

      if(val && this.id != val) {
        this.id = val
      }
    },
    '$route.name'(val) {
      const pageName = val
      if(['Playlist'].includes(pageName)) {
        this.pageName = pageName
      }
    },
    id() {
      this.data = this.$options.data()
      this.getData()
    },
    unfold() {
      this.$refs.songs.updatePageModeFront()
    }
  },
  created() {
    this.pageName = this.$route.name
    this.id = this.$route.params.id
  }
};
</script>

<style scoped lang="scss">
  #title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }
    .play-all {
      margin: 0;
      font-size: .8rem;
      color: var(--mainColor);
      border: var(--mainColor) solid 1px;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
      transition: var(--animationTime);
      &:hover {
        background-color: var(--mainColor);
        color: #fff;
      }
    }
  }
.playlist {

  

  .playlist-header {
    display: flex;
    & > * {
      transition: var(--animationTime);
    }
    .cover {
      background-color: #dbdbdb;
    }
    .text-box {
      padding-left: 20px;
      box-sizing: border-box;
      .name {
        font-size: 1.5rem;
        height: 4.5rem;
        word-break: break-all;
        .type {
          font-size: .8em;
          display: inline-block;
          padding: 0 .5rem;
          border-radius: 5px;
          margin-right: 5px;
          vertical-align: middle;
          color: var(--mainColor);
          border: var(--mainColor) solid 1px;
          vertical-align: text-top;
        }
      }
      .play-all {
        margin: 3px 0 10px 0;
        color: var(--textColor);
      }
      .description {
        padding-right: 30px;
        word-break: break-all;
        position: relative;
        .arrows {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }

  .paly-list-box {
    margin-top: 12px;
    .loding-box {
      padding-top: 20px;
      text-align: center;
      .text {
        font-size: 1rem;
        margin-left: .8rem;
      }
    }
  }

  ::v-deep {
    .v-skeleton-loader__heading {
      width: 100%;
      max-width: 300px;
      height: 1.3rem;
      margin: 0.7rem 0;
      &:first-child {
        max-width: 800px;
      }
    }
    .v-skeleton-loader__button {
      margin: 3px 0 10px 0;
      width: 110px;
      height: 28px;
    }
    .v-skeleton-loader__text {
      width: 100%;
      max-width: 800px;
      height: 0.75rem;
      margin: 0.75rem 0;
    }
  }
}
</style>
