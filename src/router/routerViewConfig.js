// 不缓存的页面
export const noCachedPages = [
  // 'SearchResults'
]

import Home from '@/views/Home'
export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  {
    path: 'search/:keyword',
    name: 'Search',
    component: () => import('../views/Search'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: 'playlist/:id',
    name: 'Playlist',
    component: () => import('../views/Playlist'),
    meta: {
      title: '歌单'
    }
  },
  {
    path: 'album/:id',
    name: 'Album',
    component: () => import('../views/Album'),
    meta: {
      title: '专辑'
    }
  },
  {
    path: 'artist/:id',
    name: 'Artist',
    component: () => import('../views/Artist'),
    meta: {
      title: '歌手'
    }
  },
  {
    path: 'mv/:id',
    name: 'Mv',
    component: () => import('../views/Mv'),
    meta: {
      title: 'MV'
    }
  },
  {
    path: 'user',
    name: 'User',
    component: () => import('@/views/User'),
    meta: {
      title: '个人中心'
    }
  },
  {
    path: 'myPlayList',
    name: 'MyPlayList',
    component: () => import('@/views/MyPlayList'),
    meta: {
      title: '我的歌单'
    }
  },
  {
    path: 'myInfo',
    name: 'MyInfo',
    component: () => import('@/views/MyInfo'),
    meta: {
      title: '我的信息'
    }
  },
  {
    path: 'myPlayRecord',
    name: 'MyPlayRecord',
    component: () => import('@/views/MyPlayRecord'),
    meta: {
      title: '播放记录'
    }
  },
  {
    path: 'about',
    name: 'About',
    component: () => import('@/views/About'),
    meta: {
      title: '关于'
    }
  },
  {
    path: 'setting',
    name: 'Setting',
    component: () => import('@/views/Setting'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/ErrorPage/404'),
    meta: {
      title: '404'
    }
  }
]