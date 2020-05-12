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

			<navigator url="../map/index" class="running_btn" open-type="navigate" hover-class="none">
				<image src="https://i.loli.net/2020/05/12/GkPOK6VImWtqrFD.png" mode=""></image>
				<text>跑步</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	let self;
	import defaulImg from "@/static/icon/100.png"
	// import Decode from "@/utils/decode.js"
	import { nowWeather } from "@/api/weather.js"
	export default {
		data() {
			return {
				weather: "36.5℃  晴",
				weatherImg: defaulImg
			};
		},
		created() {
			this.getWeather()
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
				// #ifdef MP-WEIXIN
				wx.login({
					success(res) {
						wx.getWeRunData({
							success(res) {
								// 拿 encryptedData 到开发者后台解密开放数据
								const encryptedData = res.encryptedData
								// 或拿 cloudID 通过云调用直接获取开放数据
								const iv = res.iv
								// console.log(Decode.decryptData(encryptedData, iv))
							}
						})

					}
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
		background: url("https://i.loli.net/2020/05/12/BFdacPpOGu4Atl7.jpg")no-repeat center /100% 100%;

		.wrap_sub {
			flex: 1;
		}

		.weather {
			position: fixed;
			padding: 10rpx 20rpx;
			display: flex;
			align-items: center;
			border-radius: 60rpx;
			background-color: #fff;
			margin: 20rpx 20rpx 0;

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
