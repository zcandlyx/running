<script>
	import Vue from 'vue'
	import { getOpenId, register, inquire } from "@/api/mine.js"
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
			self = this;
			this.getOpenId()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {

			async inquire(data) {
				try {
					const res = await inquire(data);
					if (res.status === 0) {
						console.log(res.data)
						this.$store.commit("user/SET_USER_INFO", res.data)
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

			getOpenId() {
				try {
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							console.log(res.provider)
							if (~res.provider.indexOf('weixin')) {
								uni.login({
									async success({ code }) {
										if (code) {
											//发起网络请求
											const res = await getOpenId({ code })
											if (res.status === 0) {
												self.$store.commit("user/SET_OPENID",res.data.openid)
												self.inquire({ openId: res.data.openid });
											}
										} else {
											console.log('登录失败！' + res.errMsg)
										}
									}
								})
							}
						}
					});
				} catch (e) {
					console.log(e)
					uni.showToast({
						title: "系统异常",
						icon: "none"
					})
					//TODO handle the exception
				}
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
