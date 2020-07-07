import store from '@/store/index.js'
// 实现判断登陆的共有方法,为了避免缓存问题,使用vuex,不在使用缓存
export function isLogin() {
	var userObj = store.state.user.userInfo || {};
	console.log(userObj)
	if (userObj.nickName) {
		return true;
	}
	return false;
}
// 检查是否登陆  同步提示  可以直接跳转
export function checkLogin(fn) {
	//没有登陆 直接提示
	if (!isLogin()) {
		uni.showModal({
			title: '未登录',
			content: '您未登录，需要登录后才能继续',
			/**
			 * 如果需要强制登录，不显示取消按钮
			 */
			success: (res) => {
				if (res.confirm) {
					uni.redirectTo({
						url: '/pages/mine/login/login'
					})
				}
			}
		})
	} else {
		fn();
	}
}
