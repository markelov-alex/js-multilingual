// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// Here store meets router
router.beforeEach(beforeRouteEnter)

function beforeRouteEnter (to, from, next) {
  // Clear Global error on route change
  store.commit('clearGlobalError')
  next()
}
