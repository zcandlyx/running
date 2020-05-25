<script>
	import Vue from 'vue'
	import { getOpenID } from "@/api/mine.js"
	let self;
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
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
					console.log("status=====>", e)
					// #endif
				}
			})

			// 
		},
		onShow: function() {
			console.log('App Show')
			self = this
			const sessionKey = this.$store.getters.getSessionKey;
			if (!sessionKey) {
				this.init()
				return
			}
			uni.checkSession({
				success() {
					console.log("未过期")
					//session_key 未过期，并且在本生命周期一直有效
				},
				fail() {
					console.log("已经过期")
					self.init()
					// session_key 已经失效，需要重新执行登录流程
					//重新登录
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			init() {
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider)
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								success(res) {
									if (res.code) {
										//发起网络请求
										getOpenID({ code: res.code }).then(res => {
											console.log("mine===>", res)
											self.$store.commit("user/SET_SESSION_KEY", res.session_key)
										}).catch(res => {
											console.log(res)
										})
									} else {
										console.log('登录失败！' + res.errMsg)
									}
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	@import "colorui/animation.css";

	page {
		height: 100%;
		background-color: #FFFFFF;
	}

	/*每个页面公共css */
</style>
