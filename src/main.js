import Vue from 'vue'
import App from './App.vue'
import router from './router'

//  导入全局样式控制文件
import '@/assets/css/global.css'

//  注册element-ui依赖包
import ElementUI from 'element-ui'
//  引入axios
import axios from 'axios'
//  配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
