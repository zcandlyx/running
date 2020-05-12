import Vuex from "vuex"
import Vue from "vue"
import user from "./module/user.js"
import running from "./module/running.js"
import getters from "./getter.js"
Vue.use(Vuex)
const store = new Vuex.Store({
	getters,
	modules: {
		user,
		running

	}
})

export default store;
