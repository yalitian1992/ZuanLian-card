import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import VueResource from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import publicMethod from './components/common/public'
import wx from 'weixin-js-sdk'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)
Vue.use(publicMethod)
const router = new VueRouter({
  routes
})

new Vue({
  router
}).$mount('#app')   //手动挂载
