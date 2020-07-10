<template>
	<view class="wrap" v-cloak>
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content" class="text-white">首页</block>
		</cu-custom>
		<view class="module-box" :style="'background:url('+bg+')no-repeat left top /100% 100%'">
			<view class="module">
				<view class="title">
					我的运动步数
					<button open-type="share" v-if="isGetStep">
						好友PK
					</button>
				</view>
				<view class="avatar-box">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="show-box">
					<view class="show-box-sub">
						<text>
							{{step}}
						</text>
						<text>今日步数</text>
					</view>
					<view class="show-box-sub">
						<text>
							{{total}}
						</text>

						<text>
							30天总步数
						</text>
					</view>
					<view class="show-box-sub">
						<text>
							{{ranking!=-1?ranking:"获取失败"}}
						</text>
						<text>
							当天排名
						</text>
					</view>


				</view>
				<button type="default" class="share" @tap="goStepRanking" v-if="isGetStep">查看总排行</button>
			</view>
			<button type="default" @tap="getStep" v-if="!isGetStep">点击获取</button>

		</view>
		<!-- <image class="bg" :style="[{top:CustomBar + 'px'}]" :src="bg" mode=""></image> -->

		<!-- <navigator url="../map/index">去跑步</navigator> -->
		<!-- <button open-type="openSetting" @tap="openSetting" v-show="isPositon" class="position_btn">位置授权(请允许前后台授权)</button> -->
		<neil-modal :show="show" @close="closeModal" align="center" title="提示" content="您还未登录,请先登录" @cancel="bindBtn(0)"
		 @confirm="bindBtn(1)">
		</neil-modal>
	</view>
</template>

<script>
	let self;
	import { isLogin } from "@/utils/common.js"
	import { mapState, mapGetters } from "vuex"
	import { getStep, getRanking, deposit_step } from "@/api/mine.js"
	export default {
		data() {
			return {
				isPositon: false, //是否已经位置授权
				modalName: null,
				step: 0,
				ranking: 0,
				total: 0,
				CustomBar: this.CustomBar,
				show: false,
				isGetStep: false
			};
		},
		computed: {
			...mapGetters({ bg: "home_bg" }),
			...mapState("user", { openId: state => state.openId }),
			...mapState("user", { userInfo: state => state.userInfo }),
		},
		onShow() {
			self = this;
			// wx.updateShareMenu({
			// 	withShareTicket: true,
			// 	success(res) {
			// 		console.log("更新成功", res)
			// 	}
			// })
			uni.getSystemInfo({
				fail(error) {
					console.log(error)
				},
				success({ system }) {
					wx.showShareMenu({
						withShareTicket: true,
						menus: ['shareAppMessage', 'shareTimeline'],
						success(res) {
							console.log(res)
						},
						fail(error) {
							console.log(error)
						}
					})
					// console.log(system, /iOS/.test(system))
					// if (!/iOS/.test(system)) {
					// 	wx.showShareMenu({
					// 		withShareTicket: true,
					// 		menus: ['shareAppMessage', 'shareTimeline']
					// 		success(res) {
					// 			console.log(res)
					// 		},
					// 		fail(error) {
					// 			console.log(error)
					// 		}
					// 	})
					// }
				}
			})
		},
		
		onLanuch({shareTicket}){
			
		},
		
		mounted() {
			console.log(this.bg)
			/* 获取是否已经拥有权限 */
			uni.getSetting({
				success({ authSetting }) {
					console.log(authSetting)
					if (authSetting["scope.werun"]) {
						self.getStep()
					}
				},
				fail() {
					console.log("获取失败")
				}
			})
			console.log("userinfo", this.userInfo)
		},
		onShareAppMessage: function(res) {
			return {
				title: `我今天走了${this.step}步,快来看看自己的步数吧`,
				path: '/pages/home/index'
			}
		},
		onShareTimeLine: function(res) {
			return {
				title: `我今天走了${this.step}步,快来看看自己的步数吧`,
				// path: '/pages/home/index'
			}
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
			},


			getStep() {
				uni.showLoading({
					title: "加载中"
				})
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
													const step = await deposit_step({ ...res, openId: self.openId });
													self.step = 0;
													self.total = 0;
													self.getRank();
													uni.hideLoading();
													if (step.status === 0) {
														self.step = step.data.stepInfoList[30].step || 0;
														step.data.stepInfoList.map((item, index) => {
															self.total += item.step
														})
														self.isGetStep = true;
													} else {
														self.isGetStep = true;
														uni.showToast({
															title: "获取失败,请重新获取",
															icon: "none"
														})
													}

												},
												fail(error) {
													console.log(error)
													uni.hideLoading()

													if (error.errMsg === "getWeRunData:fail:auth deny") {
														setTimeout(() => {
															uni.showModal({
																content: '检测到您没打开此小程序的步数权限，是否去设置打开？',
																confirmText: "确认",
																cancelText: "取消",
																success: function(res) {
																	console.log(res);
																	//点击“确认”时打开设置页面
																	if (res.confirm) {
																		console.log('用户点击确认')
																		wx.openSetting({
																			success: (res) => {}
																		})
																	} else {
																		console.log('用户点击取消')
																	}
																}
															});
														}, 500)
													} else {
														// "电脑端可能无法使用该运动功能"
														uni.showToast({
															title: "电脑端不支持",
															icon: "none"
														})
													}

												}
											})
											// #endif
										} else {
											console.log('登录失败！' + res.errMsg)
											uni.hideLoading()
											uni.showToast({
												title: "获取ID失败"
											})
										}
									},
									fail() {
										uni.hideLoading()
									}
								})
							}
						}
					});
				} catch (e) {
					uni.hideLoading()
					self.isGetStep = true;
					console.log(e)
					uni.showToast({
						title: "系统异常",
						icon: "none"
					})
					//TODO handle the exception
				}
			},

			async getRank() {
				try {
					const res = await getRanking({ openId: this.openId });
					if (res.status === 0) {
						this.ranking = res.data[0].index != -1 ? res.data[0].index + 1 : res.data[0].index
					} else {
						this.ranking = -1
					}
				} catch (e) {
					uni.showToast({
						title: "系统异常",
						icon: "none"
					})
					//TODO handle the exception
				}
			},

			async goStepRanking() {
				if (isLogin()) {
					uni.navigateTo({
						url: "../stepRanking/index"
					})
				} else {
					this.show = true
				}
			},

			closeModal() {
				this.show = false
			},

			bindBtn(val) {
				console.log(val)
				if (val) {
					console.log(3)
					uni.switchTab({
						url: "../mine/index",
						fail(res) {
							console.log(res)
						}
					})
				}
			},

		}
	}
</script>

<style lang="scss">
	$color:#01BD03;

	.bg {
		width: 100%;
		height: 100vh;
		position: fixed;
		z-index: -1;
		top: 0;
	}

	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.module-box {
			flex: 1;
		}

		.module {
			width: 95%;
			border-radius: 10rpx;
			margin: 38vh auto 0;
			padding: 20rpx;
			background-color: rgba($color: #fff, $alpha: 0.8);

			.title {
				padding: 0rpx 0 10rpx;
				font-size: 40rpx;
				color: $color;
				text-align: center;
				border-bottom: 4rpx solid $color;
				position: relative;

				button {
					padding: 0;
					margin-top: 0;
					width: 120rpx;
					position: absolute;
					right: 10rpx;
					font-size: 24rpx;
					color: #fff;
					font-weight: bold;
					top: 0rpx;
					line-height: 2;
					// top: ;
				}
			}
		}

		.avatar-box {
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			overflow: hidden;
			margin: 20rpx auto;
		}

		open-data {
			display: block;
			width: 100%;
			height: 100%;

		}

		.show-box {
			display: flex;
			justify-content: space-between;
		}

		.show-box-sub {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			text:first-child {
				color: $color;
				font-size: 36rpx;
			}
		}

		.share {
			width: 40%;
			padding: 10rpx;
			background-color: $color;
			color: #fff;
			line-height: 1.5;
			text-align: center;
			font-size: bolder;
			border-radius: 10rpx;
			margin: 35rpx auto 0;
		}

		button {
			width: 50%;
			margin-top: 20rpx;
			background-color: $color;
			color: #fff;
		}
	}

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

	[v-cloak] {
		display: none;
	}
</style>
