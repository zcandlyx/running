import { getOpenId, register, inquire } from "@/api/mine.js"
const state = {
	userInfo: {},
	/* wxInfo: {},*/
	openId: ""
};
const mutations = {
	SET_USER_INFO(state, data) {
		// 1.存入vuex
		state.userInfo = data;
		// 2.存入localstorage

	},
	REMOVE_USER_INFO(state) {
		state.userInfo = {};
		uni.removeStorageSync("userInfo");
	},
	SET_SESSION_KEY(state, data) {
		state.sessionKey = data;
		// 2.存入localstorage
		uni.setStorageSync("sessionKey", data);
		console.log((state.sessionKey))
	},
	SET_OPENID(state, data) {
		state.openId = data
	},



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
const actions = {
	async getOpenId({ commit, dispatch }) {
		try {
			uni.login({
				async success({ code }) {
					if (code) {
						const res = await getOpenId({ code })
						if (res.status === 0) {
							commit("SET_OPENID", res.data.openid)
							dispatch("inquire", { openId: res.data.openid })
						}
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
			// uni.getProvider({
			// 	service: 'oauth',
			// 	success: function(res) {
			// 		console.log(res.provider)
			// 		if (~res.provider.indexOf('weixin')) {

			// 		}
			// 	}
			// });
		} catch (e) {
			console.log(e)
			uni.showToast({
				title: "系统异常",
				icon: "none"
			})
			//TODO handle the exception
		}
	},
	async inquire({ commit }, data) {
		try {
			const res = await inquire(data);
			if (res.status === 0) {
				console.log(res.data)
				commit("SET_USER_INFO", res.data)
			}
		} catch (e) {
			console.log(e)
			uni.showToast({
				title: "系统异常",
				icon: "none"
			})
			//TODO handle the exception
		}
	},

};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
