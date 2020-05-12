<template>
	<view>
		<view class="bg bg-gradual-green ">

		</view>
		<view class="info " v-if="info.nickName">
			<image :src="info.avatarUrl" mode=""></image>
			<view class="name">
				{{info.nickName}}
			</view>
		</view>
		<button v-else open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="scope_btn">授权登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					nickName: null
				}
			};
		},
		methods: {
			bindGetUserInfo({ detail }) {
				console.log(detail)
				this.info = { ...JSON.parse(detail.rawData) }
				this.$store.commit("user/SET_USER_INFO", this.info)
			}
		},
		onShow() {
			try {
				this.info = this.$store.getters.userInfo
			} catch (e) {
				console.log(e)
				//TODO handle the exception
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		height: 419rpx;
		border-radius: 20rpx;
	}

	.info {
		height: 150rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: #fff;

		image {
			width: 94rpx;
			height: 94rpx;
			border-radius: 50%;
		}

		.name {
			margin-left: 29rpx;

		}
	}

	.scope_btn {
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
</style>
