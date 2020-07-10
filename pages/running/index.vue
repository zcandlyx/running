<template>
	<view class="wrap">
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content" class="text-white">跑步吧</block>
		</cu-custom>
		<view class="wrap_sub">
			<view class="weather" v-if="weatherAuth">
				<image :src="weatherImg" mode=""></image>
				<text>{{weather}}</text>
			</view>
			<text class="weather" v-else @tap="getWeather">点击获取位置信息</text>
			<view class="step" v-if="stepAuth">
				今日步数:{{currentStep}}
			</view>
			<view class="step" v-else @tap="getStep">
				点击获取运动步数
			</view>
			<navigator url="../map/index" class="running_btn" open-type="navigate" hover-class="none">
				<image src="https://i.loli.net/2020/05/12/GkPOK6VImWtqrFD.png" mode=""></image>
				<text>跑步</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	let self;
	import Decode from "@/utils/decode.js"
	import defaulImg from "@/static/icon/100.png"
	// import Decode from "@/utils/decode.js"
	import { nowWeather } from "@/api/weather.js"
	import { getStep } from "@/api/mine.js"
	export default {
		data() {
			return {
				weather: "获取中...",
				weatherImg: defaulImg,
				currentStep: 0,
				weatherAuth: false,
				stepAuth: false
			};
		},
		
		created() {
			self = this;
			uni.getSetting({
				success({ authSetting }) {
					console.log(authSetting)
					if (authSetting["scope.userLocation"]) {
						self.weatherAuth = true
						self.getWeather();
					}
					if (authSetting["scope.werun"]) {
						self.stepAuth = true
						self.getStep()
					}

				},
				fail() {
					console.log("获取失败")
				}
			})
			// this.getStep()
		},
		methods: {

			getWeather() {


				/* 获取当前位置 */
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: function(res) {
						self.weatherAuth = true
						nowWeather({ location: `${res.longitude},${res.latitude}`, key: 'e94ce65c8da94aa69947f2dc1d268596' }).then(res => {
							let data = res.HeWeather6[0].now;
							self.weather = data.tmp + "℃  " + data.cond_txt;
							self.weatherImg = `https://cdn.azhen.work/${data.cond_code}.png`
						})
					},
					fail(res) {
						uni.showToast({
							title: "获取地理位置失败",
							icon: "none"
						})
						console.log(res)
					}
				});

			},

			getStep() {
				let code;
				try {
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							console.log(res.provider)
							if (~res.provider.indexOf('weixin')) {
								uni.login({
									success(res) {
										if (res.code) {
											code = res.code;
											// #ifdef MP-WEIXIN
											wx.getWeRunData({
												async success(res) {
													self.stepAuth = true
													res.code = code;
													const step = await getStep(res);
													if (step.status === 0) {
														self.currentStep = step.data.stepInfoList[step.data.stepInfoList.length - 1].step
													} else {
														throw new Error("解密失败")
													}
												},
												fail() {
													uni.showToast({
														title: "获取步数失败",
														icon: "none"
													})
												}
											})
											// #endif
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

<style lang="scss">
	.wrap {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: url("https://cdn.azhen.work/wx-bg.jpg")no-repeat center /100% 100%;

		.wrap_sub {
			flex: 1;
		}

		.step {
			position: fixed;
			right: -30rpx;
			padding: 20rpx 40rpx 20rpx 20rpx;
			margin-top: 120rpx;
			text-align: left;
			border-radius: 60rpx;
			background-color: #fff;
		}

		.weather {
			position: fixed;
			display: flex;
			align-items: center;
			padding: 10rpx 20rpx;
			border-radius: 60rpx;
			background-color: #fff;
			margin-top: 20rpx;
			left: 20rpx;

			image {
				width: 50rpx;
				height: 50rpx;

			}

			text {
				font-size: 24rpx;
			}
		}

		.running_btn {
			width: 150rpx;
			height: 150rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 72vh auto 0;
			color: #fff;
			border-radius: 50%;
			background-color: $running-theme-color;

			image {
				width: 46rpx;
				height: 46rpx;
			}
		}
	}
</style>
