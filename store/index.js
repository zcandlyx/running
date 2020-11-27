import Vuex from "vuex"
import Vue from "vue"
import user from "./module/user.js"
import bg from "./module/bg.js"
import running from "./module/running.js"
import getters from "./getter.js"
import setting from './module/setting.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	getters,
	modules: {
		user,
		running,
		bg,
		setting
	}
})

export default store;
