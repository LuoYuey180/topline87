import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  //  @别名：代表src目录的绝对路径名地址（vuecli准备好的，直接用即可）
  //  index.vue文件是默认索引文件，不用设置，自动寻找
  component: () => import('@/views/login')
},
{
  path: '/home',
  name: 'home',
  redirect: '/welcome',
  component: () => import('@/views/home'),
  children: [{
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/views/welcome')
  }]
}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
