import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  //  登录页面路由
  path: '/login',
  name: 'login',
  //  @别名：代表src目录的绝对路径名地址（vuecli准备好的，直接用即可）
  //  index.vue文件是默认索引文件，不用设置，自动寻找
  component: () => import('@/views/login')
},
{
  //  首页页面路由
  path: '/home',
  name: 'home',
  redirect: '/welcome',
  component: () => import('@/views/home'),
  //  首页的子路由
  children: [{
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/views/welcome')
  },
  {
    //  文章列表
    path: '/article',
    name: 'article',
    component: () => import('@/views/article')
  },
  {
    //  发布文章
    path: '/articleadd',
    name: 'articleadd',
    component: () => import('@/views/articleadd')
  },
  {
    //  修改文章
    path: '/articleedit:aid',
    name: 'articleedit',
    component: () => import('@/views/articleedit/articleedit.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account/account.vue')
  }
  ]
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
