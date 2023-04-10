<template>
  <div class="mv">
    
    <video
      ref="veo"
      class="{ cursor: true }"
      
      :src="mvUrl"
      :poster="cover"
      :width="width"
      :height="height"
      autoplay="true"
      controls="true"
     
     
      >
      您的设备不支持video标签。
    </video>
    <span class="mvname">{{this.name}}</span>
    <el-divider content-position="left">作者</el-divider>
    <div v-for="(item,i) in artists" :key="i">
      <router-link :to="'/artist/'+artists[i].id">
        <span>{{artists[i].name}}</span>
      </router-link>
    </div>
    
    <el-divider content-position="left">描述</el-divider>
    <el-collapse>
    <el-collapse-item title="查看描述">
    <div><p>{{desc}}</p></div>     
    </el-collapse-item>
    </el-collapse>
    <el-divider content-position="left">视频信息</el-divider>
    <div>
      <p>分辨率：{{mvR}}</p>
      <p>播放数：{{playCount}}</p>
     
      <p>转发数：{{shareCount}}</p>
      <p>发布时间：{{publishTime}}</p>
    </div>



    <el-backtop :bottom="100">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      ↑
    </div>
  </el-backtop>
  </div>
</template>

<script>
import { Dialog } from 'vant';
import BottomPlayer from "@/components/Layout/BottomPlayer"
import axios from 'axios';
export default {
  name: 'Mv',
  data() {
    return {
      activeNames: ['1'],
      width: "100%",
      height: "50%",
      // mv地址
      mvUrl:"",
      //当前分辨率
      mvR:"",
      //大小
      mvSize:"",
      //名字
      name:"",
      //作者id
      artistId: "",
      //作者名字
      artistName: "",
      //作者组
      artists:[],
      //分辨率组
      brs:[],
      //描述
      desc:"",
      //封面
      cover:"",
      //时长
      duration:"",
      //播放数
      playCount:"",
      //发布时间
      publishTime:"",
      //转发数
      shareCount:""
    };
  },
  activated() {
    this.getMvData();
  },
  methods: {
    // 获取 mv 数据
    async getMvData() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      const id = this.$route.params.id;
      const mvid=id;
      console.log(id)
      await this.$api.mv.getMvDetail({
        mvid
      }).then(res => {
        if(res.code == 200) {
          
       
          this.name = res.data.name;
          this.artistId = res.data.artistId;
          this.artistName = res.data.artistName;
          this.artists = res.data.artists;
          this.brs = res.data.brs;
          this.desc = res.data.desc;
          this.cover = res.data.cover;
          this.duration = res.data.duration;
          this.playCount = res.data.playCount;
          this.publishTime = res.data.publishTime;
          this.shareCount = res.data.shareCount;
          //关闭BottomPlayer组件中的音乐播放
          // BottomPlayer.methods.musicPause();

        
          loading.close();

          this.$eventBus.$emit('musicPause');
          
          


        }else{
          Dialog.alert({
            title: '提示',
            message: '获取Mv详情失败,请稍后再试',
          }).then(() => {
            // on close
            //返回上一页
            this.$router.go(-1);
            loading.close();
          });
        }
      });
      await this.$api.mv.getMvUrl({
        id
      }).then(res => {
        if(res.code == 200) {
         
          this.mvUrl = res.data.url;
          this.mvR = res.data.r;

        }else{
          Dialog.alert({
            title: '提示',
            message: '获取Mv地址失败,请稍后再试',
          }).then(() => {
            // on close
          });
        }
      
      });

      var Param={
            mvId:id,
            name:this.name,
            artistId:this.artistId,
            artistName:this.artistName,
            brs : this.mvR,
            description:this.desc,
            duration:this.duration,
            playCount:this.playCount,
            publishTime:this.publishTime,
            shareCount:this.shareCount,
          }
          if(this.artists[1]){
            Param.artistId += '、' + this.artists[1].id;
            Param.artistName += '、' + this.artists[1].name;
          }
          //保存到数据库
          await axios.post('http://localhost:8080/music/mv/saveNewMv',Param).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          });



    },
  },
  destroyed(){
    // this.$eventBus.$emit('musicPlay');
  }
};
</script>

<style scoped lang="scss">
.mv {
}
.mvname{
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}
</style>