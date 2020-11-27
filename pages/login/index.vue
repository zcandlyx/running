<template>
	<view>
		<view>
			<text :data-theme="appTheme" style="height:90rpx;" @tap="toggleAppTheme('pink')">切换主题色</text>
			<text class="iconfont icon-home icon"></text>
			<navigator open-type="switchTab" url="../home/index">去首页吧</navigator>
			<button type="default">获取</button>
			<!-- #ifdef APP-PLUS -->
			<button type="default" @tap="appGetUserInfo('weixin')">微信授权</button>
			<button type="default" @tap="appAlert">原生alert</button>
			<button type="default" @tap="appShare">app分享</button>
			<input type="text" value="" style="border: 2upx solid #000000" @focus="getKeyHeight" />
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="default" @getuserinfo="wxGetUserInfo" open-type="getUserInfo">小程序授权</button>
			<!-- #endif -->
		</view>
		<view class="test border" :data-theme="appTheme" v-for="(item, index) in count" :key="index">hello word</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
// #ifdef APP-PLUS
const dcRichAlert = uni.requireNativePlugin('DCloud-RichAlert');
console.log(dcRichAlert);
// #endif
// const md5 = require('crypto-js/md5');
export default {
	data() {
		return {
			flag: false,
			qq: false,
			aweixin: null,
			aqq: null,
			aweibo: null,
			refresh: false,
			count: 20
		};
	},
	computed: {
		...mapGetters(['appTheme'])
	},
	onLoad() {
		// #ifdef APP-PLUS
		this.flag = plus.runtime.isApplicationExist({ pname: 'com.tencent.mm', action: 'weixin://' });
		this.qq = plus.runtime.isApplicationExist({ pname: 'com.tencent.mobileqq', action: 'mqq://' });
		// #endif
		uni.getSystemInfo({
			success: res => {
				console.log(res);
			}
		});
		uni.onKeyboardHeightChange(res => {
			console.log(res.height);
		});
	},
	onShow() {
		console.log(this.appTheme);
	},
	onPullDownRefresh() {
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		console.log('触底==>');
		this.count += 10;
		console.log(this.count);
	},
	methods: {
		// toggleAppTheme() {
		// 	// this.$store.commit('setting/TOGGLE_APP_THEME', 'blue');
		// },
		takePhoto() {
			uni.chooseImage({
				success(res) {
					plus.nativeUI.alert(JSON.stringify(res));
				},
				fail(e) {
					plus.nativeUI.alert(JSON.stringify(e));
				}
			});
			// let cmr = plus.camera.getCamera();
			// cmr.captureImage(
			// 	e => {
			// 		console.log(JSON.stringify(e));
			// 	},
			// 	error => {
			// 		console.log(JSON.stringify(error));
			// 	}
			// );
		},
		// #ifdef APP-PLUS
		getKeyHeight() {},
		appAlert() {
			console.log('sdfaf');
			dcRichAlert.show(
				{
					position: 'bottom',
					title: '提示信息',
					titleColor: '#FF0000',
					content:
						"<a href='https://uniapp.dcloud.io/' value='Hello uni-app'>uni-app</a> 是一个使用 Vue.js 开发跨平台应用的前端框架!\n免费的\n免费的\n免费的\n重要的事情说三遍",
					contentAlign: 'left',
					checkBox: {
						title: '不再提示',
						isSelected: true
					},
					buttons: [
						{
							title: '取消'
						},
						{
							title: '否'
						},
						{
							title: '确认',
							titleColor: '#3F51B5'
						}
					]
				},
				result => {
					switch (result.type) {
						case 'button':
							console.log('callback---button--' + result.index);
							break;
						case 'checkBox':
							console.log('callback---checkBox--' + result.isSelected);
							break;
						case 'a':
							console.log('callback---a--' + JSON.stringify(result));
							break;
						case 'backCancel':
							console.log('callback---backCancel--');
							break;
					}
				}
			);
		},
		appShare() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 1,
				summary: '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！',
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		// #endif
		handleRefresh() {
			console.log(this.refresh);
			this.refresh = true;
			setTimeout(() => {
				this.refresh = false;
			}, 1000);
		},
		// 创建Barcode扫码控件
		createBarcode() {
			var barcode = null;
			if (!barcode) {
				barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
					top: '100px',
					left: '0px',
					width: '100%',
					height: '500px',
					position: 'static'
				});
				// barcode.onmarked = onmarked;
				plus.webview.currentWebview().append(barcode);
			}
			barcode.start();
		},
		// #ifdef APP-PLUS
		appGetUserInfo(provider) {
			uni.login({
				provider: provider,
				success: res => {
					console.log(res);

					uni.getUserInfo({
						provider: provider,
						success: res => {
							plus.nativeUI.alert(JSON.stringify(res));
						},
						fail(err) {
							console.log(err);
							uni.showToast({
								title: '获取用户信息失败',
								icon: 'none'
							});
						}
					});
				},
				fail(err) {
					console.log(err);
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					});
				}
			});
		},
		// #endif
		// #ifdef MP-WEIXIN
		wxGetUserInfo(e) {
			console.log(e);
		},
		// #endif
		getAuth() {
			uni.showToast({
				title: '测试',
				icon: 'none'
			});
			// #ifdef APP-PLUS
			if (!this.aweixin) {
				plus.nativeUI.alert('当前环境不支持微信登录');
				return;
			}
			if (!this.aweixin.authResult) {
				this.aweixin.login(
					e => {
						plus.nativeUI.alert('授权成功：' + JSON.stringify(e));
					},
					e => {
						plus.nativeUI.alert('当前环境不支持微信登录');
					}
				);
			} else {
				plus.nativeUI.alert('已经登录认证!' + JSON.stringify(this.aweixin.authResult));
			}
			// #endif
		},
		qqAuth() {
			// #ifdef APP-PLUS
			if (!this.aqq) {
				plus.nativeUI.alert('当前环境不支持QQ登录');
				return;
			}
			this.aqq.login(
				e => {
					console.log(e);
					plus.nativeUI.alert('授权成功：' + JSON.stringify(e));
				},
				e => {
					console.log(e);
					plus.nativeUI.alert('当前环境不支持QQ登录');
				}
			);
			// #endif
		},
		weixinLoginOut() {
			// #ifdef APP-PLUS
			if (!this.aweixin) {
				plus.nativeUI.alert('当前环境不支持微信解绑');
				return;
			}
			this.aweixin.logout(
				e => {
					plus.nativeUI.alert('解绑成功：' + JSON.stringify(e));
				},
				e => {
					plus.nativeUI.alert('当前环境不支持微信解绑');
				}
			);
			// #endif
		},
		qqLoginOut() {
			// #ifdef APP-PLUS
			if (!this.aqq) {
				plus.nativeUI.alert('当前环境不支持微信解绑');
				return;
			}
			this.aqq.logout(
				e => {
					plus.nativeUI.alert('解绑成功：' + JSON.stringify(e));
				},
				e => {
					plus.nativeUI.alert('当前环境不支持微信解绑');
				}
			);
			// #endif
		},
		getCode() {
			// #ifdef APP-PLUS
			if (!this.aweixin) {
				plus.nativeUI.alert('当前环境不支持code获取');
				return;
			}
			this.aweixin.authorize(
				e => {
					plus.nativeUI.alert('code：' + JSON.stringify(e));
				},
				e => {
					plus.nativeUI.alert('当前环境不支持code' + JSON.stringify(e));
				}
			);
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
scroll-view {
	height: 100vh;
	position: fixed;
	top: 0;
}

.test {
	font-size: 120upx;
}

.icon {
	font-size: 60upx;
}
</style>
