<template>
  <div class="new-music">
    <SongGroup :title="title" :line="line" :dataListLength="dataListLength" :dataList="dataList" :loading="loading" class="song-group" />
  </div>
</template>

<script>
import SongGroup from '@/components/SongGroup'
import axios from 'axios'

export default {
  name: 'NewMusic',
  components: {
    SongGroup
  },
  data() {
    return {
      title: '最新音乐',
      loading: true,
      dataList: undefined,
      line: 4,
      dataListLength: 12
    }
  },
  methods: {
    async getData() {
      this.loading = true
      await this.$api.personalized
        .newSong({
          limit: this.dataListLength
        })
        .then(async res => {
          if (res.code == 200) {
            this.dataList = res.result.map(item => item.song)
            this.loading = false
            // console.log(res)

            //获取今天的日期年月日
            var lastSaveTime=new Date().toLocaleDateString();
            console.log(JSON.parse(localStorage.getItem("userInfo")).name+":上次一save时间:"+localStorage.getItem("lastSaveTime")) 
            if(localStorage.getItem("lastSaveTime")!==lastSaveTime
            &&JSON.parse(localStorage.getItem("userInfo")).name=="admin"){
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
            for (let i = 0; i < this.dataList.length; i++) {
              Param.musicId = this.dataList[i].id
              Param.name = this.dataList[i].name
              Param.description = '热度:' + this.dataList[i].popularity
              if (this.dataList[i].fee == 0) {
                Param.description += '   免费或无版权'
              }
              if (this.dataList[i].fee == 1) {
                Param.description += '   VIP 歌曲'
              }
              if (this.dataList[i].fee == 4) {
                Param.description += '   购买专辑'
              }
              if (this.dataList[i].fee == 8) {
                Param.description += '   非会员可免费播放低音质，会员可播放高音质及下载'
              }
              Param.coverImg = this.dataList[i].album.blurPicUrl

              Param.artists = this.dataList[i].artists[0].name
              Param.artistsId = this.dataList[i].artists[0].id

              await this.savaNewArtist(this.dataList[i].artists[0].id)

              if (this.dataList[i].artists[1]) {
                Param.artists += '、' + this.dataList[i].artists[1].name
                Param.artistsId += '、' + this.dataList[i].artists[1].id
                this.savaNewArtist(this.dataList[i].artists[1].id)
              }

              Param.publicTime = this.formatDate(this.dataList[i].album.publishTime)
              //依次保存到数据库
              await axios
                .post('http://43.140.252.215:8080/music/music/saveNewMusic', Param)
                .then(res => {
                  //  console.log(res)
                })
                .catch(err => {
                  console.log(err)
                })
            }
              localStorage.setItem("lastSaveTime",lastSaveTime);
            }
           
           
            
          }
        })
    },
    // 时间戳转换为年月日
    formatDate(date) {
      var date = new Date(date)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      return Y + M + D
    },
    async savaNewArtist(id) {
      var Param = {
        /** 歌手id */
        artistId: 0,
        /** 歌手名 */
        name: '',
        /** 封面 */
        coverImg: '',
        /** 专辑数 */
        albumSize: 0,
        /** mv数 */
        mvSize: 0,
        /** 歌曲数 */
        musicSize: 0,
        /** 介绍 */
        introduction: '',
        /** 身份 */
        identities: '',
        /** 主要描述 */
        briefDesc: '',
        /** 别名 */
        alias: ''
      }
      const res1 = await this.$api.artist.getArtistDetail({ id })
      if (res1.code !== 200) {
        throw new Error('Failed to get artist detail information')
      }
      // console.log(res1)
      Param.artistId = res1.data.artist.id
      Param.name = res1.data.artist.name
      Param.alias = JSON.stringify(res1.data.artist.alias)
      Param.coverImg = res1.data.artist.cover
      Param.albumSize = res1.data.artist.albumSize
      Param.mvSize = res1.data.artist.mvSize
      Param.musicSize = res1.data.artist.musicSize
      Param.identities = JSON.stringify(res1.data.artist.identities)
      Param.briefDesc = res1.data.artist.briefDesc
      const res2 = await this.$api.artist.getArtistDesc({ id })
      Param.introduction = JSON.stringify(res2.introduction)
      // console.log(res2)
      // console.log(Param)
      //保存到数据库
      axios
        .post('http://43.140.252.215:8080/music/artist/saveNewArtist', Param)
        .then(res => {
          //  console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped lang="scss">
.new-music {
  margin-top: 20px;
  overflow: hidden;
}
.song-group {
  width: 100%;
}
</style>
