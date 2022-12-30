import { get, post } from '@/plugins/axios'

export default {
  // 获取Artist详情
  getArtistDetail: p => post('/artist/detail', p),
  //获取歌手描述
  getArtistDesc: p => post('/artist/desc', p),
}