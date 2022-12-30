<template>
  <div class="artist">
    
    <el-card :body-style="{ padding: '0px' }">
      <img :src="cover" class="image">
      <div style="padding: 14px;">
        <el-divider content-position="left">姓名</el-divider>
        <span>{{name}}</span>
        <!-- 空格 -->
        &nbsp;&nbsp;&nbsp;
        <span v-if="alias.length!=0">{{alias}}</span>
        <div class="bottom">

          <el-collapse>
          
          <!-- <el-divider content-position="left">简介</el-divider> -->
          <el-collapse-item title="查看简介">
            <div><p>{{briefDesc}}</p></div>
            
          </el-collapse-item>
         
      
          <el-divider content-position="left">信息</el-divider>
          <p>专辑数：{{albumSize}}</p>
          
          <p><span v-if="identities.length!=0">身份：{{identities}}</span></p>
          <p>歌曲数：{{musicSize}}</p>
          <p>mv数：{{mvSize}}</p>
       

       
          <div class="introduction" v-if="introduction.length!=0">
            <el-divider content-position="left">描述</el-divider>
            <div v-for="(item,i) in introduction" :key="i">
              
              <!-- <p>{{introduction[i].ti}}</p> -->
           
              <!-- 换行 -->
              <!-- <br> -->
              <el-collapse-item :title="'查看'+introduction[i].ti">
              <p>{{introduction[i].txt}}</p>
              </el-collapse-item>

            </div>
          </div>
        </el-collapse>

        </div>
      </div>
      
    </el-card>

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
export default {
  name: 'Artist',
  data() {
    return {
      activeNames: ['1'],
        //姓名
        name:"",
        //别名
        alias:[],
        //封面
        cover:"",
        //主要描述
        briefDesc:"",
        //专辑数
        albumSize:0,
        //身份
        identities:"",
        //歌曲数
        musicSize:"",
        //mv数
        mvSize:"",
        //介绍
        introduction:[]


    };
  },
 
  activated() {
    this.getArtistDescAndDetail()
  },
  methods: {
    
    // 获取歌手描述
    getArtistDescAndDetail() {
      // 获取歌手id
      // this.$route.params.id
      const id = this.$route.params.id;
      console.log(id)
     
      this.$api.artist.getArtistDetail({
        id
      }).then(res => {
        
     
    
      this.name=res.data.artist.name;
      this.alias=res.data.artist.alias;
      this.cover=res.data.artist.cover;
      this.briefDesc=res.data.artist.briefDesc;
      this.albumSize=res.data.artist.albumSize;
      this.identities=res.data.artist.identities;
      this.musicSize=res.data.artist.musicSize;
      this.mvSize=res.data.artist.mvSize;
      
 

    })
    this.$api.artist.getArtistDesc({
        id
      }).then(res => {
        
      
        this.introduction=res.introduction;
    
    })
    },
    
  },
};
</script>

<style scoped lang="scss">
.artist {
}

  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }


  .image {
    width: 100%;
    display: block;
  }



</style>