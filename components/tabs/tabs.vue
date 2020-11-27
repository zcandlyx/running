<template>
	<view>
		<scroll-view scroll-with-animation :throttle="false" :scroll-left="scrollToLeft" scroll-x @scroll="handleScroll">
			<view class="nav">
				<view class="nav-item" :key="index" v-for="(item, index) in navs" :class="swiperIndex == index ? 'nav-item-act' : ''" @click="taggleNav(index)">{{ item }}</view>
				<view class="nav-line" :style="style"></view>
			</view>
		</scroll-view>
		<view class="swiper">
			<swiper :current="swiperIndex" :duration="300" class="swiper-1" easing-function="linear" @change="swiperChange">
				<swiper-item v-for="(item, index) in navs" :key="item + 'asdf'">
					<view class="swiper-item uni-bg-red">{{ item }}</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			swiperIndex: 0,
			navItemWidth: '',
			navItemLeft: 0,
			scrollLeft: 0,
			scrollToLeft: 0,
			navs: ['首页', '动态', '我的', '喜欢', '生活', '收合余烬', '居心不净', '收视返听']
		};
	},
	computed: {
		style() {
			return `width:${this.navItemWidth}px; left:${this.navItemLeft}px`;
		}
	},
	mounted() {
		this.getDomInfo();
	},
	methods: {
		taggleNav(val) {
			this.swiperIndex = val;
			this.scrollToLeft = (val - 1) * this.navItemWidth;
			console.log(this.scrollToLeft, this.swiperIndex);
		},
		getDomInfo() {
			this.$nextTick(function() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.nav-item-act')
					.boundingClientRect(data => {
						this.navItemWidth = data.width;
						this.navItemLeft = data.left + this.scrollLeft;
					})
					.exec();
			});
		},
		swiperChange(e) {
			this.swiperIndex = e.detail.current;
			this.scrollToLeft = (this.swiperIndex - 1) * this.navItemWidth;
			this.getDomInfo();
		},
		handleScroll(e) {
			this.scrollLeft = e.detail.scrollLeft;
			this.getDomInfo();
		}
	}
};
</script>

<style lang="scss" scoped>
.nav {
	margin: 0 auto;
}

.nav-item {
	display: inline-block;
	margin: 0 16upx;
	text-align: center;
	transition: color 0.3s ease;
}

.nav {
	position: relative;
	height: 50rpx;
}

.nav-item-act {
	color: $theme-pink;
	font-weight: bolder;
}

.nav-line {
	position: absolute;
	bottom: 0;
	height: 5px;
	border-radius: 5rpx;
	background-color: $theme-pink;
	transition: left 0.3s ease;
}
swiper {
	margin: 30rpx;
}
swiper-item {
	background-color: skyblue;
	color: #fff;
}
</style>
