<template>
	<view class="wrap">
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content" class="text-white">跑步吧</block>
		</cu-custom>
		<view class="wrap_sub">
			<view class="weather">
				<image :src="weatherImg" mode=""></image>
				<text>{{weather}}</text>
			</view>
			<view class="step">
				今日步数:{{currentStep}}
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
				weather: "36.5℃  晴",
				weatherImg: defaulImg,
				currentStep: 0
			};
		},

		created() {
			this.getWeather();
			this.getStep()

		},
		methods: {

			getWeather() {

				self = this;
				/* 获取当前位置 */
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: function(res) {
						nowWeather({ location: `${res.longitude},${res.latitude}`, key: 'e94ce65c8da94aa69947f2dc1d268596' }).then(res => {
							let data = res.HeWeather6[0].now;
							self.weather = data.tmp + "℃  " + data.cond_txt;
							self.weatherImg = `http://qa7dp7qmh.bkt.clouddn.com/${data.cond_code}.png`
						})
					},
					fail(res) {
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
													res.code = code;
													const step = await getStep(res);
													if (step.status === 0) {
														self.currentStep = step.data.stepInfoList[step.data.stepInfoList.length - 1].step
													} else {
														throw new Error("解密失败")
													}
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
		background: url("https://i.loli.net/2020/05/12/BFdacPpOGu4Atl7.jpg")no-repeat center /100% 100%;

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
