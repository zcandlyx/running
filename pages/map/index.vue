<template>
	<view class="wrap">
		<!-- <cu-custom :isBack="true">
			<block slot="content">跑步吧</block>
		</cu-custom> -->
		<view class="map-box">
			<map style="width: 100%; height: 100%;" :polyline="polyline" :show-location="true" :latitude="latitude" :longitude="longitude" subkey="3WUBZ-VQF6J-RIYFS-FXCZC-5FFSO-S2FFO"></map>
		</view>

		<cover-view class="cover_header">
			<cover-view class="speed"> 速度:{{speed}} </cover-view>
			<cover-view class="speed"> 公里:{{horizontalAccuracy}} </cover-view>
		</cover-view>

		<cover-image class="runing_btn" src="@/static/image/pause.png" mode="" v-show="!isRuning" @tap="startRuning"></cover-image>
		<cover-image class="runing_btn" src="@/static/image/start.png" mode="" v-show="isRuning" @tap="pauseRuning"></cover-image>
		<cover-view @tap="getPosition" class="control">
			<cover-image class="geolocation_control" src="@/static/image/geolocation_control.png"></cover-image>
		</cover-view>
		<!-- <cover-view class="controls-title">
		</cover-view> -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: 23.099994,
				longitude: 113.324520, //初始位置
				polyline: [{
					points: [],
					color: "#01BD03",
					width: 2
				}],
				num: 0,
				circles: [{ latitude: "", longitude: "", color: "#99CCFF", radius: 20 }], //圆点
				speed: "0m/s",
				horizontalAccuracy: "0.00", //跑步长度
				isRuning: true
			};
		},
		created() {
			uni.getSetting({
				success(res) {
					console.log(res.authSetting)
				},
				fail(res) {
					console.log(res)
				}
			})
			// wx.startLocationUpdateBackground(Object object)
		},
		onShow() {
			const version = wx.getSystemInfoSync().SDKVersion

			if (this.compareVersion(version, '1.1.0') >= 0) {
				wx.openBluetoothAdapter()
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
			this.getPosition()
			let _self_3 = this;
			/* 微信中实时监测位置信息 */
			// #ifdef MP-WEIXIN
			wx.startLocationUpdateBackground({
				success() {
					console.log("实时监测开启")
					wx.onLocationChange((res) => {
						console.log("实时监测位置信息", res)
						const { latitude, longitude, horizontalAccuracy, speed } = res;
						_self_3.polyline[0].points.push({ latitude, longitude })
						// _self.horizontalAccuracy = horizontalAccuracy / 500;
						_self_3.speed = speed
					})
				},
				fail() {
					console.log("实时监测开启失败")
				}
			})
			// #endif
		},
		destroyed() {
			// #ifdef MP-WEIXIN
			wx.offLocationChange(() => {
				console.log("取消监听实时地理位置变化事件")
			})
			wx.stopLocationUpdate(() => {
				console.log("关闭监听实时位置变化")
			})
			// #endif
		},
		methods: {
			startRuning() {
				let _self_2 = this
				this.isRuning = !this.isRuning;
				// #ifdef MP-WEIXIN
				wx.startLocationUpdateBackground({
					success() {
						console.log("实时监测开启")
						wx.onLocationChange((res) => {
							console.log("实时监测位置信息", res)
							const { latitude, longitude, horizontalAccuracy, speed } = res;
							_self_2.polyline[0].points.push({ latitude, longitude })
							// _self.horizontalAccuracy = horizontalAccuracy / 500;
							_self_2.speed = speed
						})
					},
					fail() {
						console.log("实时监测开启失败")
					}
				})
				// #endif
			},
			getPosition() {
				let _self = this
				/* 获取当前位置 */
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: function(res) {
						_self.longitude = _self.circles[0].longitude = res.longitude
						_self.latitude = _self.circles[0].latitude = res.latitude
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);

					},
					fail(res) {
						console.log(res)
					}
				});
			},
			pauseRuning() {
				this.isRuning = !this.isRuning;

				// #ifdef MP-WEIXIN
				wx.offLocationChange(() => {
					console.log("取消监听实时地理位置变化事件")
				})
				wx.stopLocationUpdate({
					success() {
						console.log("关闭监听实时位置变化")
					},
					fail() {
						console.log("关闭监听实时位置变化失败")
					}
				})
				// #endif
			},
			/* 版本比较 */
			compareVersion(v1, v2) {
				v1 = v1.split('.')
				v2 = v2.split('.')
				const len = Math.max(v1.length, v2.length)

				while (v1.length < len) {
					v1.push('0')
				}
				while (v2.length < len) {
					v2.push('0')
				}

				for (let i = 0; i < len; i++) {
					const num1 = parseInt(v1[i])
					const num2 = parseInt(v2[i])

					if (num1 > num2) {
						return 1
					} else if (num1 < num2) {
						return -1
					}
				}

				return 0
			}

		}

	}
</script>

<style lang="scss">
	.wrap {
		height: 100%;


		.map-box {
			height: 100%;
		}

		.cover_header {
			position: fixed;
			width: 100%;
			height: 160rpx;
			top: 0;
			left: 0;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: rgba($color: #000000, $alpha: 0.5);
		}



		.speed {
			flex: 1;
			text-align: center;
			color: #01BD03;
			font-size: 32rpx;

		}

		.runing_btn {
			position: fixed;
			bottom: 0;
			right: 0;
			left: 0;
			transform: translate(-50% -50%);
			width: 150rpx;
			height: 150rpx;
			margin: 0 auto 4vh;
		}

		.control {
			position: fixed;
			bottom: 10rpx;
			right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 50%;
		}

		.geolocation_control {
			width: 40rpx;
			height: 40rpx;
			margin: 20rpx auto 0;
		}

		// .runing_btn {
		// 	position: fixed;
		// 	bottom: 10vh;
		// 	left: 1vw;
		// }
	}
</style>
