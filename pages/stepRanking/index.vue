<template>
	<view>
		<view class="rank-box">
			<view class="tip">
				仅显示已经登录的用户
			</view>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="indexes" :scroll-into-view="'indexes-'+ listCurID"
			 @scrolltolower="lower" @scroll="scroll" :scroll-with-animation="true" :enable-back-to-top="true">
				<!-- <view class="rank-item"> -->
				<block v-for="(item,index) in rankList" :key="index.id">
					<view class="rank-item" :class="'indexItem-' + item.indexId" :id="'indexes-' + item.indexId" :data-index="item.name">
						<view class="left">
							<text>{{index+1}}</text>
							<image :lazy-load="true" :src="item.avatar" mode=""></image>
							<text>{{item.nickName}}</text>
						</view>
						<!-- <text>{{item.gender}}&nbsp;&nbsp;&nbsp;{{item.step}}</text> -->
						<view class="left">
							<text class="step">{{item.step}}</text>
							<!-- {{list}} -->
							<view class="love-box" @tap="handleLove" :data-index="index" :data-openId="item.openId">
								<text>{{item.count}}</text>
								<!-- {{item.loves}} -->
								<text :class="[item.loves.includes(userInfo.openId)||list.includes(item.openId) ? 'love' : '', 'iconfont','icon-heart']"></text>
							</view>
						</view>
					</view>
				</block>
				<!-- </view> -->
			</scroll-view>

		</view>
		<view class="findMe" @tap="tEnd">
			点我
		</view>
		<!-- <view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in rankList" :key="index" :id="index" @touchstart="getCur"
				 @touchend="setCur">
					{{item.name}}</view>
			</view>
		</view> -->
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { step_ranking } from "@/api/mine.js"
	import { like } from "@/api/ranking.js"
	export default {
		data() {
			return {
				rankList: [],
				scrollTop: 0,
				params: {
					limit: 30,
					page: 0
				},
				hasMore: true,
				listCurID: '',
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCur: "",
				boxTop: "",
				list: []
			};
		},
		computed: {
			...mapState("user", { userInfo: state => state.userInfo }),
		},
		onReady() {
			wx.requestSubscribeMessage()
			let that = this;
			// uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
			// 	console.log(res)
			// 	that.boxTop = res.top
			// }).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		created() {
			this.init()
			console.log(this.userInfo)
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
					res.data.forEach((item, index) => {
						let arr = [];
						console.log(item.today)
						this.rankList.push({
							avatar: item.userInfo[0].avatarUrl,
							nickName: item.userInfo[0].nickName,
							step: item.today,
							id: item._id,
							openId: item.userInfo[0].openId,
							indexId: item.userInfo[0]._id,
							count: item.loves.length,
							// isLove: item.loves.includes(this.userInfo.openId)
							// gender:item.userInfo[0].gender===1?'男':item.userInfo[0].gender===0?"女":'未知'
							// name: item._id
						})
						if (item.loves.length > 0) {
							item.loves.forEach((sub, sub_ndex) => {
			
								arr.push(sub.love)
							})
						} else {
							arr = item.loves
						}
			
						this.rankList[index].loves = arr;

					})
					this.listCur = this.rankList[0].name
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
			},

			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.rankList[e.target.id].name;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					// console.log()
					this.listCur = that.rankList[num].name
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},
			//触发结束选择
			tEnd() {
				console.log(this.userInfo)
				this.hidden = true;
				this.listCurID = this.userInfo._id
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.rankList;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = "5f040501b933b918ddbf51de";
						that.movableY = i * 20
						return false
					}
				}
			},

			scroll() {
				this.listCurID = 0
			},

			async handleLove(e) {
				const { index, openid } = e.currentTarget.dataset
				if (this.rankList[index].loves.includes(this.userInfo.openId) || this.list.includes(openid)) {
					return
				}
				const res = await like({ love: this.userInfo.openId, loved: openid })
				console.log(res.status)
				if (res.status === 0) {
					// const
					// this.$set(this.rankList[index].loves, this.rankList.length, this.userInfo.openId)
					// this.rankList[index].loves.push(this.userInfo.openId);
					this.list.push(openid)
					this.rankList[index].count++;
					console.log(this.list)
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
				console.log(res)
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

			.step {
				font-size: 36rpx;
				color: $running-theme-color;
			}

			.love-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-left: 18rpx;

				text:first-child {
					display: block;
					margin-bottom: 6rpx;
				}

				text:last-child {
					font-size: 28rpx;
				}
			}
		}

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}


	.indexBar {
		position: fixed;
		height: 100vh;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	.findMe {
		position: fixed;
		top: 35vh;
		right: 120rpx;
		width: 80rpx;
		height: 80rpx;
		border: 2rpx solid gray;
		background-color: #fff;
		text-align: center;
		line-height: 80rpx;
		border-radius: 50%;
		animation: slidein 2s ease infinite;
	}

	.love {
		color: red;
	}

	@keyframes slidein {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(0.5);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
