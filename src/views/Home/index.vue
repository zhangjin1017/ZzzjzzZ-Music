<template>
  <div class="Home">
    <Carrousel />
    <RecommendSongLIst />
    <NewMusic />
    <RecommendMv />
    <el-divider></el-divider>
    <a style="margin-left: 30%;" href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2022013152号-1</a>  
  </div>
</template>

<script>
import Carrousel from './components/Carrousel'
import RecommendSongLIst from './components/RecommendSongLIst'
import NewMusic from './components/NewMusic'
import RecommendMv from './components/RecommendMv'

export default {
  name: 'Home',
  components: {
    Carrousel,
    RecommendSongLIst,
    NewMusic,
    RecommendMv
  },
  data() {
    return {
    }
  },
  methods: {},
};
</script>

<style scoped lang="scss">
</style>