const state = {
	home: "https://cdn.azhen.work/bg.jpg"
};
const mutations = {
	SET_HOME_BG(state, data) {
		
		// 1.存入vuex
		state.home = data;

	},
	REMOVE_USER_INFO(state) {
		state.userInfo = {};
		uni.removeStorageSync("userInfo");
	},

}
const getters = {}
const actions = {};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
