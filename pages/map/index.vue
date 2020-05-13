<template>
	<view class="wrap">
		<!-- <cu-custom :isBack="true">
			<block slot="content">跑步吧</block>
		</cu-custom> -->
		<view class="map-box">
			<map style="width: 100%; height: 100%;" :polyline="polyline" :circles="circles" :show-location="true" :latitude="latitude"
			 :longitude="longitude" subkey="3WUBZ-VQF6J-RIYFS-FXCZC-5FFSO-S2FFO"></map>
		</view>

		<cover-view class="cover_header">
			<cover-view class="speed"> 速度:{{speed}}m/s </cover-view>
			<cover-view class="speed"> 公里:{{horizontalAccuracy}} </cover-view>
		</cover-view>

		<cover-image class="runing_btn" src="https://i.loli.net/2020/05/12/otgSwrXH8LPGEbc.png" mode="" v-show="!isRuning"
		 @tap="startRuning"></cover-image>
		<cover-image class="runing_btn" src="https://i.loli.net/2020/05/12/pY95mXg6wjsxISH.png" mode="" v-show="isRuning"
		 @tap="pauseRuning"></cover-image>
		<cover-view @tap="getPosition" class="control">
			<cover-image class="geolocation_control" src="@/static/image/geolocation_control.png"></cover-image>
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
	// import moment from "@/utils/moment.js"
	// console.log(moment.format())
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
				num: 3, //
				timer: null, //开始倒计时
				beforeStart: true, //开始倒计时标志
				animation: 'animate__rotateOut',
				n_sec: 0, //秒
				n_min: 0, //分
				n_hour: 0, //时
				cutDownTimer: null, //表秒
				time: "00: 00: 00" //计时
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
			self = this
			/* 判断是否正在运动 */
			// this.beforeStart = !this.$store.getters.runState;
			// const startData = this.$store.getters.runStart
			// console.log("当前位置===>", startData)
			// if (!this.beforeStart) {
			// 	if (startData["latitude"]) {
			// 		this.startLatitude = startData.latitude;
			// 		this.startLongitude = startData.Longitude
			// 	}
			// 	console.log("当前位置===>", this.startLatitude)
			// 	this.animation = 'hidden';
			// 	this.num = 0;
			// 	this.isStart = false;
			// 	this.getPosition()
			// 	this.monitor()
			// }

			/*判断版本是否支持实时监测功能 */
			const version = wx.getSystemInfoSync().SDKVersion
			if (this.compareVersion(version, '1.1.0') >= 0) {
				wx.openBluetoothAdapter()
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				// #ifdef MP-WEIXIN
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
				// #endif
			}

		},

		destroyed() {
			// #ifdef MP-WEIXIN
			clearInterval(this.timer)
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
						this.coutDown()
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
			/* 跑步开始 */
			startRuning() {
				console.log(this.isRuning)
				this.isRuning = !this.isRuning;
				this.monitor()
				this.coutDown()
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
							self.polyline[0].points.push({ latitude, longitude })
							// _self.horizontalAccuracy = horizontalAccuracy / 500;
							self.speed = speed
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
				/* 暂停时清除秒表*/
				clearInterval(this.cutDownTimer)

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
				var radLat1 = lat1 * Math.PI / 180.0;
				var radLat2 = lat2 * Math.PI / 180.0;
				var a = radLat1 - radLat2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137; // EARTH_RADIUS;
				s = Math.round(s * 10000) / 10000;
				return s;
			},
			/* 秒表 */
			coutDown() {
				this.cutDownTimer = setInterval(function() {
					console.log("self",self.n_sec)
					let str_sec = self.n_sec;
					let str_min = self.n_min;
					let str_hour = self.n_hour;
					if (self.n_sec < 10) {
						str_sec = "0" + self.n_sec;
					}
					if (self.n_min < 10) {
						str_min = "0" + self.n_min;
					}

					if (self.n_hour < 10) {
						str_hour = "0" + self.n_hour;
					}

					let time = str_hour + ":" + str_min + ":" + str_sec;
					self.time = time
					self.n_sec++;
					if (self.n_sec > 59) {
						self.n_sec = 0;
						self.n_min++;
					}
					if (self.n_min > 59) {
						self.n_sec = 0;
						self.n_hour++;
					}
					console.log(time)
				}, 1000);
			}
		}

	}
</script>

<style lang="scss" scoped>
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		color: #fff;
		background-color: $running-theme-color;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: display 1s ease;

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

	.hidden {
		display: none;
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
			background-color: rgba($color: #000000, $alpha: 0.5);
		}



		.speed {
			flex: 1;
			text-align: center;
			color: #fff;
			font-size: 48rpx;
			font-weight: bolder;
		}

		.runing_btn {
			position: fixed;
			bottom: 0;
			right: 0;
			left: 0;
			transform: translate(-50% -50%);
			width: 120rpx;
			height: 120rpx;
			margin: 0 auto 4vh;
			overflow: hidden;
		}

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
