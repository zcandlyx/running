<template>
	<view class="a-nav">
		<view :class="['a-nav-item', index == act ? 'a-act' : '']" :key="index" v-for="(item, index) in list" @click="changeAct(index)">{{ item }}</view>
		<view :style="dyna ? dynaLineStyle : lineStyle" class="a-line"></view>
	</view>
</template>

<script>
export default {
	props: {
		dyna: {
			type: Boolean,
			default: false
		},
		list: {
			type: Array,
			default() {
				return ['首页', '我的', '今日动态', '开心一刻'];
			}
		}
	},
	data() {
		return {
			act: 0,
			left: 0,
			navInfos: [],
			lineWidth: 0,
			distancX: 0,
			lineLeft: 0,
			dynaLineWidth: 0
		};
	},
	mounted() {
		this.init();
	},
	computed: {
		lineStyle() {
			return `left:calc(${this.lineLeft}px + ${this.distancX}px);`;
		},
		dynaLineStyle() {
			return `left:calc(${this.lineLeft}px);${'width:' + this.dynaLineWidth + 'px'}`;
		}
	},
	methods: {
		init() {
			const query = uni.createSelectorQuery().in(this);
			query.select('.a-line').fields({ rect: true, size: true }, res => {
				this.lineWidth = res.width;
			});
			query.selectAll('.a-nav-item').fields({ rect: true, size: true }, data => {
				data.forEach((item, index) => {
					this.navInfos.push({ width: item.width, left: item.left });
				});
				this.lineLeft = this.navInfos[this.act].left;
				this.dynaLineWidth = this.navInfos[this.act].width;
				this.distancX = (this.navInfos[this.act].width - this.lineWidth) / 2;
			});
			query.exec();
		},
		changeAct(index) {
			this.act = index;
			this.lineLeft = this.navInfos[this.act].left;
			setTimeout(() => {
				this.dynaLineWidth = this.navInfos[this.act].width;
			}, 20);
			this.distancX = (this.navInfos[this.act].width - this.lineWidth) / 2;
			this.$emit('changeIndex', index);
		}
	}
};
</script>

<style lang="scss" scoped>
$theme: pink;
.title {
	font-size: 24rpx;
	font-weight: bold;
}
.a-nav {
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	padding: 30rpx 40rpx;
	position: relative;
	background-color: #eaeaea;
}
.a-act {
	color: $theme;
}

.a-nav-item {
	font-size: 32rpx;
	transition: color 0.2s linear;
}

.a-line {
	position: absolute;
	width: 50rpx;
	height: 8rpx;
	border-radius: 6rpx;
	bottom: 0;
	background-color: $theme;
	transition: left 0.2s linear;
}
</style>
