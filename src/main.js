import Vue from 'vue'
import App from './App.vue'
import router from './router'

//  导入全局样式控制文件
import '@/assets/css/global.css'
// import '@/assets/css/resetui.css'

//  注册element-ui依赖包
import ElementUI from 'element-ui'

//  引入axios
import '@/utils/ax.js'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
