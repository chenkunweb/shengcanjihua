//路由文件
import Vue from 'vue'
import Router from 'vue-router'


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
Vue.use(Router)

export default new Router({
  routes: [
   
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['@/pages/index'], resolve),
      children:[
        {
          path: '/zhuangpei',
          name: 'zhuangpei',
          component: resolve => require(['@/pages/zhuangpei'], resolve),
        },
        {
          path: '/dianxian',
          name: 'dianxian',
          component: resolve => require(['@/pages/dianxian'], resolve),
          
        },
        {
          path: '/zhusu',
          name: 'zhusu',
          component: resolve => require(['@/pages/zhusu'], resolve),
          
        },
        {
          path: '/wujin',
          name: 'wujin',
          component: resolve => require(['@/pages/wujin'], resolve),
        },
        {
          path: '/jijia',
          name: 'jijia',
          component: resolve => require(['@/pages/jijia'], resolve),
        },
        {
          path: '/zhiju',
          name: 'zhiju',
          component: resolve => require(['@/pages/zhiju'], resolve),
        },
        {
          path: '/yangpin',
          name: 'yangpin',
          component: resolve => require(['@/pages/yangpin'], resolve),
        },
        {
          path: '/cangku',
          name: 'cangku',
          component: resolve => require(['@/pages/cangku'], resolve),
        },
        {
          path: '/caigou',
          name: 'caigou',
          component: resolve => require(['@/pages/caigou'], resolve),
        },
        {
          path: '/diandu',
          name: 'diandu',
          component: resolve => require(['@/pages/diandu'], resolve),
        },
        {
          path: '/zonglianji',
          name: 'zonglianji',
          component: resolve => require(['@/pages/zonglianji'], resolve),
        },
        {
          path: '/zonglianjipt',
          name: 'zonglianjipt',
          component: resolve => require(['@/pages/zonglianjipt'], resolve),
        },
        
      ]
    },
    {
      path: '/',
      redirect: to=>{
        // store.state.userid = 
        return '/index'
      }
    }
   
    
    
  ]
})
