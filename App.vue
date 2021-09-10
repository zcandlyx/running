<script>
import Vue from 'vue';
import { getOpenId, register, inquire } from '@/api/mine.js';
let self;
export default {
	onLaunch: function() {
		// this.getOpenId();
		self = this;
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log('新版本===>', res.hasUpdate);
		});

		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});

		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
		});
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
				// #ifdef MP-TOUTIAO
				let custom_TOU = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = custom_TOU.bottom + custom_TOU.top - e.statusBarHeight;
				console.log('status=====>', e);
				// #endif
			}
		});

		//
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		async inquire(data) {
			try {
				const res = await inquire(data);
				if (res.status === 0) {
					self.$store.commit('bg/SET_HOME_BG', res.data.background);
					self.$store.commit('user/SET_USER_INFO', res.data);
					console.log('store-info====>');
				}
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: '系统异常',
					icon: 'none'
				});
				//TODO handle the exception
			}
		},

		async getOpenId() {
			try {
				uni.login({
					async success({ code }) {
						if (code) {
							const res = await getOpenId({ code });
							if (res.status === 0) {
								self.$store.commit('user/SET_OPENID', res.data.openid);
								self.inquire({ openId: res.data.openid });
							}
						} else {
							console.log('登录失败！' + res.errMsg);
						}
					}
				});
				// uni.getProvider({
				// 	service: 'oauth',
				// 	success: function(res) {
				// 		console.log(res.provider)
				// 		if (~res.provider.indexOf('weixin')) {

				// 		}
				// 	}
				// });
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: '系统异常',
					icon: 'none'
				});
				//TODO handle the exception
			}
		}
	}
};
</script>

<style style="scss">
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'static/icon/iconfont.css';
@import 'colorui/animation.css';
@import 'static/style/theme.scss';
page {
	height: 100%;
	background-color: #ffffff;
	--golbal: skyblue;
}

/*每个页面公共css */
</style>
