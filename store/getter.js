export default {
	userInfo(state) {
		//先查看vuex
		var userObj = state.user.userInfo;
		// 注意 在vuex中 {} 是不会被判断为false的 
		if (userObj.nickName) {
			// console.log('userObj',userObj);
			return userObj;
		} else {
			return {}
		}
		// vuex不存在 从storage中查找

	},
	/* 运动状态 */
	runState(state) {
		/*0:代表正在运动中 1:代表暂停中 2:代表未开始*/
		var run_state = state.running.run_state;
		if (run_state === 0) {
			return 0;
		} else if (run_state === 1) {
			return 1
		} else {
			return 2
		}

	},
	/* 开始数据 */
	runStart(state) {
		var start = state.running.start;
		if (start["latitude"]) {
			return start;
		} else {
			return {}

		}
	},
	getSessionKey(state) {
		let sessionKey = uni.getStorageSync('sessionKey');
		console.log(Boolean(sessionKey))
		if (sessionKey) {
			console.log("sessionKey", sessionKey)
			return sessionKey;
		}
		return ""
	},
	openId(state, getters) {
		let openId = state.user.openId;
		console.log("store-openid", state.user.userInfo)
		// 注意 在vuex中 {} 是不会被判断为false的 
		if (openId) {
			// console.log('userObj',userObj);
			return openId;
		}
		// vuex不存在 从storage中查找

	},
	home_bg(state) {
		let bg = state.bg.home;
		if (bg) {
			return bg
		}
	},
	appTheme(state) {
		return state.setting.appTheme
	}
}
