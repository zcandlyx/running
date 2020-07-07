<template>
	<view class="wrap">
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="content" class="text-white">背景切换</block>
		</cu-custom>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" @scrolltolower="lower">
			<view class="module">
				<view class="module-item" v-for="(item) in list" :key="item._id" mode="">
					<image :lazy-load="true" :src="item.src" @tap="previewImage(item.src)"></image>
					<view class="btn-box">
						<view class="btn" @tap="changeBg(item.src)">设为壁纸</view>
						<view class="btn" @tap="downLoad(item.src)">保存</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<neil-modal :show="show" @close="closeModal" align="center" title="提示" content="您还未登录,请先登录" @cancel="bindBtn(0)"
		 @confirm="bindBtn(1)">
		</neil-modal>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { getBg, changeBg } from "@/api/material.js"
	export default {
		data() {
			return {
				list: [],
				show: false,
				scrollTop: 0,
				hasMore: true,
				params: {
					limit: 10,
					page: 0
				},
			};
		},
		computed: {
			...mapState("user", { userInfo: state => state.userInfo }),
		},
		created() {
			this.init()
		},
		methods: {
			async changeBg(src) {
				if (!this.userInfo.nickName) {
					return this.show = true
				}
				try {
					const res = await changeBg({
						id: this.userInfo._id,
						src
					});
					if (res.status === 0) {
						uni.showToast({
							title: "设置成功"
						})
						this.$store.commit("bg/SET_HOME_BG", src)
						setTimeout(() => {
							uni.reLaunch({
								url: "../../home/index"
							})
						}, 1000)
					} else {
						uni.showToast({
							title: "设置失败",
							icon: "none"
						})
					}

				} catch (e) {
					uni.showToast({
						title: "系统异常",
						icon: "none"
					})
					console.log(e)
					//TODO handle the exception
				}


			},
			async init() {
				if (!this.hasMore) {
					return uni.showToast({
						title: "没有更多了",
						icon: "none"
					})
				}
				try {
					const res = await getBg(this.params);
					if (res.status === 0) {
						if (res.data.length === 0) {
							return
						}
						res.data.forEach(item => {
							this.list.push(item)
						})
						this.params.page++
						if (res.data.length < this.params.limit) {
							this.hasMore = false
						} else {
							this.hasMore = true
						}
					}
				} catch (e) {
					uni.showToast({
						title: "系统异常",
						icon: "none"
					})
					console.log(e)
					//TODO handle the exception
				}
			},
			downLoad(src) {
				try {
					// uni.showLoading({
					// 	title: "下载中"
					// })
					uni.downloadFile({
						url: src, //仅为示例，并非真实的资源
						success: (res) => {
							console.log(res)
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function() {
										console.log('save success');
									}
								});
							}
						},
						fail(res) {
							uni.showToast({
								title: "下载失败"
							})
							console.log(res)
						}
					});
					// uni.hideLoading()
				} catch (e) {
					// uni.hideLoading()
					uni.showToast({
						title: "下载失败"
					})
					console.log(e)
					//TODO handle the exception
				}
			},
			previewImage(src) {
				uni.previewImage({
					urls: [src],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},

			closeModal() {
				this.show = false
			},

			bindBtn(val) {
				if (val) {
					uni.switchTab({
						url: "../index"
					})
				}
			},


			lower() {
				this.init()
			}
		},

	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	scroll-view {
		flex: 1;
		overflow-y: auto;
	}

	.module {
		padding: 0 20rpx 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.module-item {
		position: relative;
		width: 48%;

		.btn-box {
			// position: absolute;
			width: 100%;
			display: flex;
			box-sizing: border-box;
			border-radius: 0 0 10rpx 10rpx;
			border-width: 0 2rpx 2rpx 2rpx;
			border-style: solid;
			border-color: rgba($color: #f5f5f5, $alpha: 1.0);
			box-shadow: 0px 24rpx 12rpx -24rpx rgba(0, 0, 0, 0.5);

			.btn {
				display: block;
				flex: 1;
				font-size: 28rpx;
				font-weight: bold;
				text-align: center;
				line-height: 2.5;
				color: #464646;
				background-color: rgba($color: #fff, $alpha: 1);
			}
		}
	}

	image {
		display: block;
		width: 100%;
		height: 550rpx;
		margin-top: 20rpx;
		border-radius: 10rpx 10rpx 0 0;
	}
</style>
