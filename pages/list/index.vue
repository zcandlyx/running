<template>
	<view>
		<!-- <button type="default" @tap="uploadVideo">上传视频</button> -->
		<view class="" v-for="item in 20" :key="item">
			<view class="content"></view>
			<view class="menu iconfont">
				<text class="transpond  icon-zhuanfafasong-3" @tap="transpond">转发</text>
				<text class="transpond  icon-pinglun"></text>
				<text class="transpond  icon-zan1 ">赞</text>
			</view>
		</view>
		<share ref="share"></share>
	</view>
</template>

<script>
import { getDomInfo } from '@/utils/common.js';
export default {
	data() {
		return {
			windowHeight: 0,
			scrollTop: 0,
			nodeTranspondHeight: 0,
			offsetTop: 0,
			isTop: true,
			isShow: false
		};
	},
	onLoad() {
		uni.getSystemInfo({
			success: info => {
				this.windowHeight = info.windowHeight;
			}
		});
	},
	mounted() {
		getDomInfo('.transpond', this).then(res => {
			this.nodeTranspondHeight = res.height;
		});
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		// 转发
		transpond(e) {
			this.$refs.share.handleShow(this.windowHeight, this.nodeTranspondHeight, this.scrollTop, e.target.offsetTop);
		},
		tabsIndex(index) {
			console.log(index);
		},
		uploadVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: function(res) {
					self.src = res.tempFilePath;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	background-color: #007aff;
	height: 200rpx;
}
.transpond {
	display: inline-block;
	height: 80rpx;
	line-height: 80rpx;
}
.menu {
	padding: 30upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
	background-color:#fff;
}
</style>
