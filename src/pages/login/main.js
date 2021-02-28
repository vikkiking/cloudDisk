import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from '@/pages/login/App'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
require('../../public')
require('../../mock')
Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


