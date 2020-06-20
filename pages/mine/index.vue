<template>
	<!-- <view>
		<view class="bg bg-gradual-green ">

		</view>
		<view class="info " v-if="info.nickName">
			<image :src="info.avatarUrl" mode=""></image>
			<view class="name">
				{{info.nickName}}
			</view>
		</view>
		<button v-else open-type="getUserInfo" @getuserinfo="@GetUserInfo" class="scope_btn">授权登录</button>
	</view> -->
	<view class="container">
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content" class="text-white">我的</block>
		</cu-custom>
		<view class="page-body-infosec">
			<!-- <image class="initusericon" src="https://i.loli.net/2020/05/13/igX1EbsCpqIcFta.png" v-show="isgetuserinfo==false"></image>
			<open-data class="initusericon" type="userAvatarUrl" v-show="isgetuserinfo==true"></open-data>
			<button @getuserinfo="getuserinfo" class="userAvatar" openType="getUserInfo">
			</button>
			<view class="userNickName">
				<text v-show="isgetuserinfo==false">点击使用微信头像</text>
				<open-data type="userNickName" v-show="isgetuserinfo==true"></open-data>
			</view> -->
			<view class="info " v-if="info.nickName">
				<image :src="info.avatarUrl" mode=""></image>
				<view class="name">
					{{info.nickName}}
				</view>
			</view>
			<button v-else open-type="getUserInfo" @getuserinfo="GetUserInfo" class="scope_btn">授权登录</button>
			<!-- 个人账号没有此项功能 -->
			<!-- 	<view class="userNickName" v-show="{{islogin==0}}">
				<button @getphonenumber="getPhoneNumber" class="loginbtn" openType="getPhoneNumber">登 录</button>
			</view> -->
		</view>
		<view class="setting-menu">
			<view class="setting-line" v-show="islogin==2"></view>
			<view @tap="toSportGoal" class="setting-item">
				<view class="medal-title">微信运动数据统计</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line" v-show="islogin==2"></view>
			<view @tap="toChangePwd" class="setting-item" v-show="islogin==2">
				<view class="medal-title">密码设置</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
			<view @tap="openset" class="setting-item">
				<view class="medal-title">权限设置</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
			<view @tap="Tousetips" class="setting-item">
				<view class="medal-title">常见问题及使用技巧</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
			<view @tap="apploadnote" class="setting-item">
				<view class="medal-title">当前体力</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
			<view @tap="apploadnote" class="setting-item">
				<view class="medal-title">最大摄氧量</view>
				<image class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
			<view @tap="apploadnote" class="setting-item">
				<view class="medal-title">乳酸阈值</view>
				<image @tap="toFeedBack" class="medal-icon" src="https://i.loli.net/2020/05/13/Fatxd1ASjkYXc2y.png"></image>
			</view>
			<view class="setting-line"></view>
		</view>
		<view class="vernote">跑步吧小程序</view>
	</view>

</template>

<script>
	let self;
	import { register, inquire } from "@/api/mine.js"
	export default {
		data() {
			return {
				info: {
					nickName: "",
					islogin: 0,
					isgetuserinfo: !1,
					loginnote: 0,
					getcodetimes: 0,
					gettokentimes: 0,

				},
				openId: ""
			};
		},
		methods: {

			async GetUserInfo({ detail }) {
				console.log(detail)
				this.info = { ...JSON.parse(detail.rawData) }
				const res = await register({ ...this.info, openId: this.openId });
				console.log({ ...this.info, openId: this.openId })
				if (res.status === 0) {
					uni.showToast({
						title: "注册成功",
						icon: "none"
					})
				}
				this.$store.commit("user/SET_USER_INFO", this.info);
			},
			/* 运动步数统计 */
			toSportGoal() {
				// uni.showToast({
				// 	icon: "none",
				// 	title: "该功能暂未开放"
				// })
				uni.navigateTo({
					url: "./step/index"
				})
			},
			/* 密码设置 */
			toChangePwd() {
				uni.showToast({
					icon: "none",
					title: "该功能暂未开放"
				})
			},
			/* 常见问题 */
			Tousetips() {
				uni.navigateTo({
					url: './useTip/index'
				});

			},
			/* 权限设置 */
			openset() {
				uni.openSetting({
					success(res) {
						console.log(res.authSetting)
					}
				});
			},
			/* 需要智能设备 */
			apploadnote() {
				uni.showToast({
					icon: "none",
					title: "该功能暂未开放"
				})
			},




		},
		onShow() {
			this.openId = this.$store.getters.openId;
			this.info = this.$store.getters.userInfo || {
				nickName: "",
				islogin: 0,
				isgetuserinfo: !1,
				loginnote: 0,
				getcodetimes: 0,
				gettokentimes: 0,
			};
			console.log(this.openId)
			// console.log("你好")
			self = this;

		}
	}
</script>

<style lang="scss" scoped>
	.initusericon {
		width: 100%;
		height: 100%;
		border: 1rpx solid $running-theme-color;
		border-radius: 50%;
		padding: 0;
		margin: 0;
	}

	.loginbtn {
		width: 40%;
		height: 74rpx;
		margin-left: 30%;
		line-height: 74rpx;
		border: 1rpx solid #fff;
		border-radius: 10rpx;
		background: transparent;
		color: #ffffff;
	}

	.vernote {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		color: #f0f0f0;
		text-align: center;
		bottom: 15rpx;
		left: 0rpx;
		font-size: 25rpx;
		float: left;
	}

	.container {
		background: $running-theme-color;
		display: block;
		min-height: 100vh;
	}

	.userNickName {
		width: 100%;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.userAvatar {
		width: 152rpx;
		height: 152rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 50rpx calc(50% - 75rpx) 10rpx calc(50% - 75rpx);
		background: transparent;
		padding: 0;
	}

	.equip_name {
		color: #fff;
		text-align: center;
		width: 100%;
		height: 40rpx;
		font-size: 40rpx;
		line-height: 40rpx;
		margin: 40rpx auto;
	}

	.equip_section {
		width: 100%;
		border-bottom: 20rpx #0D0E10 solid;
	}

	.equip_img {
		width: 300rpx;
		height: 300rpx;
		transform: translate(-50%);
		margin-top: 100rpx;
		margin-left: 50%;
	}

	.equip_title {
		color: #fff;
		text-align: center;
		width: 100%;
		height: 40rpx;
		font-size: 40rpx;
		line-height: 40rpx;
		margin: 40rpx auto;
	}

	.page-body-infosec {
		// padding-bottom: 10rpx;
		background: $running-theme-color;
		width: 100%;
		float: left;
	}

	.userinfo-avatar {
		transform: translate(-50%);
		margin-left: 50%;
		border-radius: 150rpx;
		width: 150rpx;
		height: 150rpx;
	}

	.userinfo-nickname {
		margin-top: 20rpx;
		font-size: 38rpx;
		line-height: 40rpx;
		text-align: center;
	}

	.medal_section {
		width: 100%;
		border-bottom: 20rpx #0D0E10 solid;
	}

	.medal-title-section {
		display: flex;
	}

	.medal-title {
		color: #fff;
		font-size: 32rpx;
		width: 47%;
		margin-left: 3%;
		height: 100rpx;
		align-items: center;
		display: flex;
		float: left;
	}

	.medal-count {
		color: #fff;
		font-size: 32rpx;
		width: 11%;
		line-height: 40rpx;
		// margin: 20rpx auto;
	}

	.medal-icon {
		width: 37rpx;
		height: 37rpx;

	}

	.medal-icon-count {
		width: 20%;
		margin-top: 14%;
		margin-right: 11%;
	}

	.medal-count-icon-block {
		display: flex;
		width: 30%;
	}

	.medal-list {
		display: flex;
		padding: 1%;
	}

	.medal-item {
		width: 100%;
		height: 100%;
	}

	.medal-list-item {
		width: 25%;
		margin-left: 2%;
		margin-right: 2%;
	}


	.medal-text-bottom {
		display: flex;
		align-items: center;
	}

	.setting-menu {
		// margin-top: 20rpx;
		width: 100%;
		float: left;
		padding: 0 30rpx;
	}

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: $running-theme-color;
		height: 100rpx;
		border-bottom: 3rpx #F5F5F5 solid;
	}


	.version {
		font-size: 30rpx;
		color: #758197;
		background-color: $running-theme-color;
		width: 100%;
		text-align: center;
	}

	// .bg {
	// 	height: 419rpx;
	// 	border-radius: 20rpx;
	// }

	.info {
		height: 150rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: $running-theme-color;
		color: #fff;

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
		border: 1rpx solid #fff;
	}

	.scope_btn::after {
		display: none;
	}
</style>
