import { get, post } from '@/plugins/axios'

export default {
  // 获取Mv详情
  getMvDetail: p => post('/mv/detail', p),
  //获取Mv播放地址
  getMvUrl: p => post('/mv/url', p),
}