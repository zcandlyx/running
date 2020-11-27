import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import store from '@/store/index.js'
Vue.prototype.$store = store
Vue.component('cu-custom', cuCustom)
Vue.mixin({
	methods: {
		toggleAppTheme(color = 'blue') {
			this.$store.commit('setting/TOGGLE_APP_THEME', color);
		}
	}
})
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App

})

app.$mount()
