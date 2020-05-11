<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view @tap="scan" class="cu-bar fixed bg-white" :style="style" :class="[bgImage!=''?'none-bg text-black bg-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content text-black" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				// console.log("Stats=========>",statusbar)
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style =
						`${style}background-image:url(${bgImage}) ;background-image: url(${bgImage});background-position: 40rpx ${(CustomBar-16+StatusBar)/2}px ;background-size:32rpx 32rpx;background-repeat:no-repeat;`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				console.log("返回")
				uni.navigateBack({
					delta: 1
				});
			},
			scan() {
				if (this.bgImage) {
					this.$emit("scan")
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-bar {}
</style>
