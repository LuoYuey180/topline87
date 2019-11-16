import Vue from 'vue'

//  引入axios
import axios from 'axios'

//  引入路由组件
import router from '@/router'

//  引入json-bigint模块(大数字信息做处理)依赖包
import JSONbig from 'json-bigint'

//  配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

//  请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 拿到存储好的userinfo
    let userinfo = window.sessionStorage.getItem('userinfo')
    //  判断userinfo是否为真
    if (userinfo) {
      //  如果userinfo中携带着token，就把token赋予axios请求
      config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

//  响应拦截器
axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

//  数据转换器（接收服务器端返回的第一手的‘字符串’类型的响应数据）

axios.defaults.transformResponse = function (data) {
  //  data就是返回来的数据
  // console.log(typeof data)
  //  服务端返回的数据信息是字符串，有两种格式：
  //  1、'{x,c,s,a}'非空的字符串。
  //  2、'' 空字符串。
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}
Vue.prototype.$http = axios
