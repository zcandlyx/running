<template>
	<view class="wrap">
		<cu-custom :isBack="true">
			<block slot="content">跑步吧</block>
		</cu-custom>
		<view class="map-box">
			<map style="width: 100%; height: 100%;" :polyline="polyline" :show-location="true" :latitude="latitude" :longitude="longitude"
			 subkey="3WUBZ-VQF6J-RIYFS-FXCZC-5FFSO-S2FFO"></map>
		</view>
		<cover-view class="controls-title">
			<cover-view class="baseInfo">
				<cover-view class="speed"> 速度:{{speed}} </cover-view>
				<cover-view class="speed"> 公里:{{horizontalAccuracy}} </cover-view>
			</cover-view>
			<cover-image src="@/static/image/pause.png" mode="" v-show="!isRuning" @tap="startRuning"></cover-image>
			<cover-image src="@/static/image/start.png" mode="" v-show="isRuning" @tap="isRuning=!isRuning"></cover-image>
		</cover-view>

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
					width: 2,
					dottedLine: true
				}],
				num: 0,
				circles: [{ latitude: "", longitude: "", color: "#99CCFF", radius: 20 }], //圆点
				speed: "0m/s",
				horizontalAccuracy: "0.00", //跑步长度
				isRuning: false
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
			let _self = this
			/* 获取当前位置 */
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					_self.longitude = _self.circles[0].longitude = res.longitude
					_self.latitude = _self.circles[0].latitude = res.latitude
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					/* 微信中实时监测位置信息 */
					// #ifdef MP-WEIXIN
					wx.startLocationUpdateBackground({
						success() {
							console.log("实时监测开启")
							wx.onLocationChange((res) => {
								console.log("实时监测位置信息", res)
								const { latitude, longitude, horizontalAccuracy } = res;
								_self.polyline[0].points.push({ latitude, longitude })
								_self.horizontalAccuracy = horizontalAccuracy / 500;
							})
						},
						fail() {
							console.log("实时监测开启失败")
						}
					})
					// #endif
				},
				fail(res) {
					console.log(res)
				}
			});

		},
		destroyed() {
			// #ifdef MP-WEIXIN
			wx.offLocationChange(() => {
				console.log("结束监测位置")
			})
			// #endif
		},
		methods: {
			startRuning() {
				this.isRuning = !this.isRuning;
				// #ifdef MP-WEIXIN
				wx.onLocationChange((res) => {
					console.log("实时监测位置信息", res)
					const { latitude, longitude } = res;
					_self.polyline[0].points.push({ latitude, longitude })
				})
				// #endif
			},
			pauseRuning() {
				// #ifdef MP-WEIXIN
				wx.offLocationChange(() => {
					console.log("结束监测位置")
				})
				// #endif
			}
		}

	}
</script>

<style lang="scss">
	.wrap {
		height: 100%;
		display: flex;
		flex-direction: column;

		.map-box {
			flex: 1;
		}

		&>cover-view {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 8.9vh;
			left: 0;
			overflow: hidden;

			.baseInfo {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: rgba($color: #000000, $alpha: 0.5);
				height: 160rpx;
			}

			.speed {
				flex: 1;
				text-align: center;
				color: #01BD03;
				font-size: 32rpx;
			}

			cover-image {
				width: 150rpx;
				height: 150rpx;
				margin: 62vh auto 0;
			}
		}

		// .runing_btn {
		// 	position: fixed;
		// 	bottom: 10vh;
		// 	left: 1vw;
		// }
	}
</style>
