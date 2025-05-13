// @ts-nocheck
/* eslint-disable */
import Vue from 'vue'


import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
// import plugins from './plugins' // plugins

import './permission' // permission control

// 分页组件
import request from '@/utils/request'
import http from '@/utils/http'
import { routerSSOPage } from '@/utils/sso'

import VueCompositionAPI from "@vue/composition-api";
// 全局方法挂载

Vue.prototype.request = request
Vue.prototype.http = http
Vue.prototype.routerSSOPage = routerSSOPage


Vue.use(VueCompositionAPI);


Vue.use(Element)



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
