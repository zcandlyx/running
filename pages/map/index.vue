<template>
	<view class="wrap">
		<!-- <cu-custom :isBack="true">
			<block slot="content">跑步吧</block>
		</cu-custom> -->
		<view class="map-box">
			<map style="width: 100%; height: 100%;" :polyline="polyline" :circles="circles" :show-location="true" :latitude="latitude" :longitude="longitude" subkey="3WUBZ-VQF6J-RIYFS-FXCZC-5FFSO-S2FFO"></map>
		</view>
		<cover-view class="cover_header text-grey bg-white shadow">
			<cover-view class="speed" style="white-space:pre-wrap">{{speed}}m/s\n速度</cover-view>
			<cover-view class="speed" style="white-space:pre-wrap">{{horizontalAccuracy}}\n公里</cover-view>
		</cover-view>
		<!--隐藏地图按钮 -->
		<cover-view @tap="hiddenMap" class="hiddenMap">
			<cover-image class="hiddenMapImg" src="https://i.loli.net/2020/05/12/4PStMukamUgw7pH.png"></cover-image>
		</cover-view>
		<!-- 定位按钮 -->
		<cover-view @tap="getPosition" class="control">
			<cover-image class="geolocation_control" src="@/static/image/geolocation_control.png"></cover-image>
		</cover-view>
		<!-- 数据蒙层 -->
		<cover-view class="data_mask" :class="dataMaskHidden?animation:''">
			<cover-view class="dataMaskSub">
				<cover-view>{{horizontalAccuracy}}</cover-view>
				<cover-view>公里</cover-view>
			</cover-view>
			<cover-view class="dataMaskFooter">
				<cover-image class="showMap" src="https://i.loli.net/2020/05/12/JjvgAWBXZdh9Ofa.png" @tap="hidden_data_mask"></cover-image>
				<cover-image class="runing_btn" src="https://i.loli.net/2020/05/12/otgSwrXH8LPGEbc.png" mode="" v-show="!isRuning" @tap="startRuning"></cover-image>
				<cover-image class="runing_btn" src="https://i.loli.net/2020/05/12/pY95mXg6wjsxISH.png" mode="" v-show="isRuning" @tap="pauseRuning"></cover-image>
				<cover-image class="showMap" src="https://i.loli.net/2020/05/12/2QC4XYkRG7jT8Hc.png" @tap="setting"></cover-image>
			</cover-view>

		</cover-view>

		<!-- 是否开始的蒙层 -->
		<cover-view class="mask animate__animated" :class="num>0?'':animation">
			<cover-view v-if="beforeStart" @tap="start_before">开始</cover-view>
			<cover-view v-else>{{num}}</cover-view>
		</cover-view>
		<!-- <cover-view class="controls-title">
		</cover-view> -->

	</view>
</template>

<script>
	let slef;
	export default {
		data() {
			return {
				isStart: true, //用来辨别是否首次开始
				startLatitude: "", //开始点
				startLongitude: "",
				latitude: 23.099994,
				longitude: 113.324520, //初始位置
				polyline: [{
					points: [],
					color: "#01BD03",
					width: 2
				}],

				circles: [{ latitude: "", longitude: "", color: "#99CCFF", radius: 20 }], //圆点
				speed: "0",
				horizontalAccuracy: "0.00", //跑步长度
				isRuning: true,
				num: 3,
				timer: null,
				beforeStart: true, //用来辨别倒计时
				animation: 'hidden',
				runState: 3,
				dataMaskHidden: false
			};
		},
		onShow() {
			self = this
			this.start_before()
			/* 判断是否正在运动 */
			// this.runState = this.$store.getters.runState
			// this.beforeStart = this.runState === 0 ? true : this.runState === 1 ? true : false;
			// const startData = this.$store.getters.runStart
			// console.log("当前运动状态===>", this.beforeStart)
			// if (!this.beforeStart) {
			// 	/* 获取之前的数据之后划线和起点 */
			// 	if (startData["latitude"]) {
			// 		this.circles[0].longitude = this.startLatitude = startData.latitude;
			// 		this.circles[0].latitude = this.startLongitude = startData.longitude
			// 	}
			// 	console.log("当前位置===>", this.circles[0])
			// 	this.num = -1;
			// 	this.isStart = false;
			// 	this.getPosition()
			// 	this.monitor()

			// }
			/* 判断是否支持实时监测 */
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
			/* 倒计时 */
			start_before() {
				this.beforeStart = false; //开始定位并且倒计时开始
				this.timer = setInterval(() => {
					this.num--;
					if (this.num === 0) {
						console.log("倒计时结束")
						clearInterval(this.timer)
						this.monitor();
						this.$store.commit("running/SET_RUN_STATE", 0)
					}
				}, 1000)
				this.getPosition()
				/* 微信中实时监测位置信息 */

				// // #ifdef MP-WEIXIN
				// wx.startLocationUpdateBackground({
				// 	success() {
				// 		console.log("实时监测开启")
				// 		wx.onLocationChange((res) => {
				// 			console.log("实时监测位置信息", res)
				// 			const { latitude, longitude, horizontalAccuracy, speed } = res;
				// 			self.polyline[0].points.push({ latitude, longitude }) //运动轨迹
				// 			self.speed = speed.toFixed(2) //跑步速度
				// 			self.horizontalAccuracy = Number(self.GetDistance(self.startLatitude, self.startLongitude, latitude,
				// 				longitude)).toFixed(2); //运动距离
				// 		})
				// 	},
				// 	fail() {
				// 		console.log("实时监测开启失败")
				// 	}
				// })
				// // #endif
			},
			setting() {
				uni.showToast({
					title: "此功能暂未开放",
					icon: "none"
				})
			},
			/* 隐藏跑步数据蒙层 */
			hidden_data_mask() {
				console.log(222)
				this.dataMaskHidden = true
			},
			/* 跑步开始 */
			startRuning() {
				console.log(this.isRuning)
				this.isRuning = !this.isRuning;
				this.monitor()
			},
			/* 隐藏地图 */
			hiddenMap() {
				this.dataMaskHidden = false
			},
			/* 获取当前位置 */
			getPosition() {

				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: function(res) {
						/* 首次开始拿到起始点和位置 */
						if (self.isStart) {
							self.startLongitude = self.circles[0].longitude = res.longitude
							self.startLatitude = self.circles[0].latitude = res.latitude
							/* 将开始的位置存起来 */
							self.$store.commit("running/SET_RUN_START", { longitude: res.longitude, latitude: res.latitude })
							/* 画线的起点 */
							self.polyline[0].points.push({ latitude: res.latitude, longitude: res.longitude })
						}
						/* 之后的每次点击定位都要回到当前位置,但不添加到画线过程中去 */
						self.longitude = res.longitude
						self.latitude = res.latitude
						self.isStart = false
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);

					},
					fail(res) {
						console.log(res)
					}
				});
			},
			/* 监测 */
			monitor() {
				// #ifdef MP-WEIXIN
				wx.startLocationUpdateBackground({
					success() {
						console.log("实时监测开启")
						wx.onLocationChange((res) => {
							console.log("实时监测位置信息", res)
							const { latitude, longitude, horizontalAccuracy, speed } = res;
							self.polyline[0].points.push({ latitude, longitude }) //运动轨迹
							self.speed = speed.toFixed(2) //跑步速度
							self.horizontalAccuracy = Number(self.GetDistance(self.startLatitude, self.startLongitude, latitude,
								longitude)).toFixed(2); //运动距离
							console.log("horizontalAccuracy", self.horizontalAccuracy)
						})
					},
					fail() {
						console.log("实时监测开启失败")
					}
				})
				// #endif
			},
			/* 暂停跑步 */
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
			},
			/* 计算运动距离,单位为公里 */
			GetDistance(lat1, lng1, lat2, lng2) {
				console.log(lat1, lng1, lat2, lng2)
				var radLat1 = lat1 * Math.PI / 180.0;
				var radLat2 = lat2 * Math.PI / 180.0;
				var a = radLat1 - radLat2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137; // EARTH_RADIUS;
				s = Math.round(s * 10000) / 10000;
				return s;
			}
		}

	}
</script>

<style lang="scss" scoped>
	@mixin mask {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		transition: transform 0.5s ease;
	}

	.mask {
		@include mask;
		color: #fff;
		background-color: $running-theme-color;
		display: flex;
		justify-content: center;
		align-items: center;
		

		cover-view {
			width: 150rpx;
			height: 150rpx;
			line-height: 150rpx;
			font-size: 36rpx;
			text-align: center;
			background-color: #fff;
			color: $running-theme-color;
			border-radius: 50%;
		}
	}

	.data_mask {
		@include mask;
		color: #fff;
		background-color: #191970;
	}

	.hidden {
		transform: translate(-100%, -100%);
	}

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

		}



		.speed {
			flex: 1;
			text-align: center;
			font-size: 48rpx;
		}

		// .hiddenMap {
		// 	position: fixed;
		// 	bottom: 0;
		// 	right: 0;
		// 	left: 0;
		// 	transform: translate(-50% -50%);

		// 	margin: 0 auto 4vh;
		// 	overflow: hidden;
		// }

		.control {
			position: fixed;
			display: flex;
			justify-content: center;
			align-items: center;
			bottom: 10rpx;
			right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 50%;
		}

		.geolocation_control {
			width: 50rpx;
			height: 50rpx;
		}



		.hiddenMap {
			background-color: rgba($color: #000000, $alpha:0.8);
			border-radius: 50%;
			width: 120rpx;
			height: 120rpx;
			position: fixed;
			bottom: 0;
			right: 0;
			left: 0;
			transform: translate(-50% -50%);
			margin: 0 auto 4vh;
			overflow: hidden;

			.hiddenMapImg {

				width: 40rpx;
				height: 40rpx;
				margin:40rpx auto;
			}
		}

		.dataMaskSub {
			color: #fff;
			text-align: center;
			margin-top: 14vh;

			cover-view:first-child {
				font-size: 100rpx;
			}

			cover-view:last-child {
				font-size: 32rpx;
			}
		}

		.dataMaskFooter {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 56vh;

			.runing_btn {
				width: 120rpx;
				height: 120rpx;
			}

			.showMap {

				width: 80rpx;
				height: 80rpx;



			}
		}

		// .runing_btn {
		// 	position: fixed;
		// 	bottom: 10vh;
		// 	left: 1vw;
		// }
	}

	.animate__animated.animate__rotateOut {
		--animate-duration: 1s;
	}
</style>
