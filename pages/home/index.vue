<template>
	<view>
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content" class="text-white">首页</block>
		</cu-custom>
		<navigator url="../map/index">去跑步</navigator>
		<button open-type="openSetting" @tap="openSetting" v-show="isPositon" class="position_btn">位置授权(请允许前后台授权)</button>

	</view>
</template>

<script>
	let self;
	export default {
		data() {
			return {
				isPositon: false, //是否已经位置授权
				modalName: null
			};
		},
		created() {
			self = this
			/* 获取是否已经拥有权限 */
			uni.getSetting({
				success({ authSetting }) {
					console.log(authSetting)
					if (!authSetting["scope.userLocationBackground"]) {
						console.log("没有前后台权限===>")
						self.isPositon = true
					}
				},
				fail() {
					console.log("获取失败")
				}
			})
		},
		methods: {
			openSetting() {
				/* 打开权限 */
				uni.openSetting({
					success({ authSetting }) {
						// console.log(authSetting.scope.userLocationBackground)
						if (!authSetting["scope.userLocationBackground"]) {
							uni.showToast({
								icon: "none",
								title: "请打开定位权限"
							})
						} else {
							self.isPositon = false
						}
					},
					fail(res) {
						console.log("失败", res)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.position_btn {
		width: calc(100% - 44rpx);
		height: 86rpx;
		line-height: 86rpx;
		margin: 20rpx auto 0;
		text-align: center;
		font-size: 31rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: $running-theme-color;
	}

	.position_btn::after {
		display: none;
	}
</style>
