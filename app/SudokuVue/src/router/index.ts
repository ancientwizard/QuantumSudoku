// Router config
import Vue       from 'vue'
import VueRouter from 'vue-router'
import HomeView  from '../views/HomeView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    { path: '',   redirect: '/home', },
    { path: '/',  redirect: '/home', },
    { path: '//', redirect: '/home', },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
//  {
//    path: '/about',
//    name: 'about',
//    // route level code-splitting
//    // this generates a separate chunk (About.[hash].js) for this route
//    // which is lazy-loaded when the route is visited.
//    component: () => import('../views/AboutSudoku.vue')
//  },
    {
      path: '/about/cell',
      name: 'cell',
      component: () => import('../views/AboutCell.vue')
    },
    {
      path: '/about/unit',
      name: 'unit',
      component: () => import('../views/AboutUnit.vue')
    },
    {
      path: '/about/line',
      name: 'line',
      component: () => import('../views/AboutLine.vue')
    },
    {
      path: '/about/block',
      name: 'block',
      component: () => import('../views/AboutBlock.vue')
    },
    {
      path: '/about/board',
      name: 'board',
      component: () => import('../views/AboutBoard.vue')
    }
  ]
})

export default router

// vim: expandtab tabstop=2 number
// END
