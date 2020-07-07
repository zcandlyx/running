<template>
	<view>
		<view class="rank-box">
			<view class="tip">
				仅显示已经登录的用户
			</view>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="lower">
				<view class="rank-item" v-for="(item,index) in rankList" :key="item.id">
					<view class="left">
						<text>{{index+1}}</text>
						<image :lazy-load="true" :src="item.avatar" mode=""></image>
						<text>{{item.nickName}}</text>
					</view>
					<text>{{item.step}}</text>
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import { step_ranking } from "@/api/mine.js"
	export default {
		data() {
			return {
				rankList: [],
				scrollTop: 0,
				params: {
					limit: 30,
					page: 0
				},
				hasMore: true
			};
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				if (!this.hasMore) {
					return uni.showToast({
						title: "没有更多了",
						icon: "none"
					})
				}
				const res = await step_ranking(this.params);
				if (res.status === 0) {
					res.data.forEach(item => {
						console.log(item.today)
						this.rankList.push({
							avatar: item.userInfo[0].avatarUrl,
							nickName: item.userInfo[0].nickName,
							step: item.today,
							id: item._id
						})
					})
					this.params.page++
					if (res.data.length < this.params.limit) {
						this.hasMore = false
					} else {
						this.hasMore = true
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			},

			lower() {
				this.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
	}

	.tip {
		position: fixed;
		right: 0;
		line-height: 1.5;
		padding: 10rpx;
		font-size: 24rpx;
		color: gray;
		background-color: rgba($color: #e5e5e5, $alpha: 1);
		opacity: 0.4;
		border-radius: 40rpx 0 0 40rpx;
	}

	scroll-view {
		height: 100vh;
	}

	.rank-item {
		padding: 20rpx;
		border-bottom: 2rpx solid rgba($color: #f5f5f5, $alpha: 1.0);
		@include flex;

		.left {
			@include flex;

			image {
				margin: 0 20rpx;
			}
		}

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}
</style>
