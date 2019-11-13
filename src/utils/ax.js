import Vue from 'vue'

//  引入axios
import axios from 'axios'

//  引入路由组件
import router from '@/router'

//  配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
//  请求拦截器
axios.interceptors.request.use(function (config) {
  // 拿到存储好的userinfo
  let userinfo = window.sessionStorage.getItem('userinfo')
  //  判断userinfo是否为真
  if (userinfo) {
    //  如果userinfo中携带着token，就把token赋予axios请求
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(error)
})

Vue.prototype.$http = axios
