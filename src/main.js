//Main.js
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from "./api/store"//vuex
Vue.prototype.$store = store;
Vue.config.productionTip = false
import Print from './api/print' // 引入附件的js文件
Vue.use(Print) // 注册
// 颜色选择器
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
import headerBoms from "./api/doing"   
Vue.component("v-dialogDrag",headerBoms);
// 引入axios
// 配置axios
import Api from './api/index';
Vue.prototype.$api = Api;

import util from './api/util'
Vue.prototype.util = util;
// Vue.use(Print) // 注册
// 注册vant组件
import { Tab ,Tabs,Toast,Dialog  } from 'vant';
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Toast);
Vue.use(Dialog);
// 全局注册element-ui
import ElementUI, { Main } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
