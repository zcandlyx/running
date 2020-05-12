import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import store from '@/store/index.js'
import animated from 'animate.css' 
Vue.prototype.$store = store
Vue.component('cu-custom', cuCustom)
Vue.use(animated)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
