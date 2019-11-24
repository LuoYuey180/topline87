import Vue from 'vue'
import App from './App.vue'
import router from './router'

//  导入全局样式控制文件
import '@/assets/css/global.css'
// import '@/assets/css/resetui.css'

//  引入element.js文件
import '@/utils/element.js'

//  引入axios
import '@/utils/ax.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
