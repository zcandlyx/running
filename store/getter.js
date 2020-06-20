export default {
	userInfo(state) {
		//先查看vuex
		var userObj = state.user.userInfo;
		// 注意 在vuex中 {} 是不会被判断为false的 
		if (userObj.nickName) {
			// console.log('userObj',userObj);
			return userObj;
		}else{
			return{}
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
		// let sessionKey = state.user.sessionKey;
		// if (sessionKey) {
		// 	return sessionKey;
		// }
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
	/* 	// 获取微信用户信息
		wxInfo(state) {
			//先查看vuex
			var userObj = state.user.wxInfo;
			// 注意 在vuex中 {} 是不会被判断为false的 
			if (userObj.nickName) {
				// console.log('userObj',userObj);
				return userObj;
			}
			// vuex不存在 从storage中查找
			let userInfo = uni.getStorageSync('wxInfo');
			if (userInfo.nickName) {
				return userInfo;
			} else {
				return {};
			}

		},
		// userId 需要经常用到 所以实现一个getter
		userId(state, getters) {
			console.log(getters)
			let user = getters.userInfo;
			if (user) {
				return user.id
			}
			return '';
		},
		
		integral(state) {
			// vuex储存
			var integral_vuex = state.integral.integral;
			if (integral_vuex.imgSrc || integral_vuex.billMoney || integral_vuex.billNum) {
				return integral_vuex;
			}else{
				return{}
			}
			// 本地储存
			// let integral_stor = uni.getStorageSync('integral');
			// if (integral_stor.imgSrc || integral_stor.billMoney || integral_stor.billNum) {
			// 	return integral_stor;
			// } else {
			// 	return {};
			// }
		} */
}
