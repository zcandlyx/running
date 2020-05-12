const state = {
	userInfo: {}
	/* wxInfo: {},
	openId: "" */
};
const mutations = {
	SET_USER_INFO(state, data) {
		// 1.存入vuex
		state.userInfo = data;
		// 2.存入localstorage
		uni.setStorageSync("userInfo", data);
		console.log((state.userInfo))
	},
	REMOVE_USER_INFO(state) {
		state.userInfo = {};
		uni.removeStorageSync("userInfo");
	}
	/* SET_WEIXIN_INFO(state, data) {
		// 1.存入vuex
		state.wxInfo = data;
		// 2.存入localstorage
		uni.setStorageSync("wxInfo", data);
	},
	SET_OPENID(state, data) {
		state.openId = data
		console.log("user",data)
		uni.setStorageSync("openId", data);
	},
	REMOVE_WEIXIN_INFO(state) {
		delete state.wxInfo;
		uni.removeStorageSync("wxInfo");
	} */
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
