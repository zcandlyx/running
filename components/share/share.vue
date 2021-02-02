<template>
	<view class="wrapper" @tap="isShow = false" :class="{ 'wrapper-show': isShow }" @touchmove.stop.prevent="moveHandle">
		<view class="transpond" :class="[{ show: isShow }, { 'transpond-top': isTop }]" :style="style">
			<view class="">快转</view>
			<view class="">转发</view>
			<view class="">分享</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			offsetTop: 0,
			isTop: true,
			isShow: false
		};
	},
	onPageScroll(){
		console.log('滚动')
	},
	computed: {
		translateY() {
			if (this.isTop) {
				return -100;
			} else {
				return 0;
			}
		},
		originY() {
			if (this.isTop) {
				return 'bottom';
			} else {
				return 'top';
			}
		},
		style() {
			return `transform-origin: 5% ${this.originY};top:${this.offsetTop}px;transform: translateY(${this.translateY}%) scale(${this.scale})`;
		},

		scale() {
			if (this.isShow) {
				return 1;
			} else {
				return 0;
			}
		}
	},
	methods: {
		handleShow(windowHeight, nodeTranspondHeight, scrollTop, offsetTop) {
			let y = offsetTop - scrollTop;
			let postion = windowHeight / y || 2;
			if (postion > 2 || y <= 0) {
				this.offsetTop = y + nodeTranspondHeight;
				this.isTop = false;
			} else {
				this.offsetTop = y;
				this.isTop = true;
			}
			this.isShow = true;
		},
		moveHandle() {}
	}
};
</script>

<style lang="scss" scoped>
.wrapper {
	position: fixed;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	pointer-events: none;
	top: 0;
	background-color: rgba(0, 0, 0, 0.3);
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 9;
}

.wrapper-show {
	opacity: 1;
	pointer-events: auto;
}

li {
	height: 40px;
	border-bottom: 1px solid #eee;
}

.mask {
	position: fixed;
	top: 0;
	height: 100vh;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);
}

.transpond {
	position: fixed;
	transform: scale(0);
	transition: transform 0.1s ease;
	width: 100%;
	padding: 0 60upx;
	border: 2upx solid #eee;
	border-radius: 6upx;
	background-color: #fff;

	&::after {
		position: absolute;
		top: 0;
		transform: translateY(-100%);
		content: '';
		border-width: 20upx;
		border-color: transparent transparent green transparent;
		border-style: solid;
	}
	view {
		line-height: 80upx;
	}
	view:nth-child(2) {
		border-top: 2upx solid #c8c8c8;
		border-bottom: 2upx solid #c8c8c8;
	}
}

.transpond-top::after {
	position: absolute;
	bottom: 0;
	transform: translateY(100%);
	content: '';
	border-width: 20upx;
	border-color: green transparent transparent transparent;
	border-style: solid;
}

* {
	margin: 0;
	padding: 0;
}
</style>
