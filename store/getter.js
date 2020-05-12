export default {
	userInfo(state) {
		//先查看vuex
		var userObj = state.user.userInfo;
		// 注意 在vuex中 {} 是不会被判断为false的 
		if (userObj.nickName) {
			// console.log('userObj',userObj);
			return userObj;
		}
		// vuex不存在 从storage中查找
		let userInfo = uni.getStorageSync('userInfo');
		if (userInfo.nickName) {
			return userInfo;
		} else {
			return {};
		}

	},
	/* 运动状态 */
	runState(state) {
		var run_state = state.running.run_state;
		if (run_state) {
			return true;
		} else {
			return false
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
	}
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
		openId(state, getters) {
			let openId = state.user.openId;
			console.log("store-openid", state.user.userInfo)
			// 注意 在vuex中 {} 是不会被判断为false的 
			if (openId) {
				// console.log('userObj',userObj);
				return openId;
			}
			// vuex不存在 从storage中查找
			openId = uni.getStorageSync('openId');
			if (openId) {
				return openId;
			} else {
				return "";
			}
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
