<template>
	<view>
		<view class="title">下划线宽度非固定 当前index{{ index2 }}</view>
		<tabs :list='list' :dyna="true" @changeIndex="changeIndex2" />
		<view class="title">下划线宽度固定 当前index{{ index }}</view>
		<tabs @changeIndex="changeIndex" />
	</view>
</template>
<script>
export default {
	data() {
		return {
			list:['首页', '我的dd', '动态', '分享'],
			index: 0,
			index2: 0
		};
	},
	methods: {
		changeIndex(index) {
			this.index = index;
		},
		changeIndex2(index) {
			this.index2 = index;
		}
	}
};
</script>
<style class="scss" scoped>
.title {
	font-weight: bold;
	line-height: 120rpx;
}
</style>
