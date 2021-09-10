<template>
	<view class="wrapper">
		<view class="nav-box">
			<scroll-view class="nav-scroll" :enable-flex="true" scroll-with-animation :throttle="false"
				:scroll-left="scrollToLeft" scroll-x @scroll="handleScroll">
				<view class="nav uni-nav">
					<view class="nav-item" :class="swiperIndex == index ? 'nav-item-act' : ''" :key="index"
						v-for="(item, index) in list" @click="taggleNav(index)">
						{{ item.title }}
					</view>
					<view class="nav-line" :style="style"></view>
				</view>
			</scroll-view>
		</view>
		<view class="fill-fixed"></view>


		<view class="swiper">
			<swiper :style="{height:swiperHeight}" :current="swiperIndex" :duration="300" class="swiper-1"
				easing-function="linear" @change="swiperChange">
				<swiper-item v-for="(item, index) in list" :key="index">

					<view :class="swiperIndex===index?'swiper-item-module':''">
						<view class="swiper-item-list" v-for="sub_item in item.content" :key="sub_item">
							{{ sub_item }}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperIndex: 0, //当前的swiperindex
				navItemWidth: '', //选中下划线的宽度
				navItemLeft: 0, //选中下划线的显示位置
				scrollToLeft: 0, //scrollview需要滚动的距离
				navInfos: [], //所有navitem的节点信息
				parentLeft: 0, //nav盒子的节点信息
				componentWidth: 0, //nav盒子的宽度
				list: [
					{ title: '首页', content: ['首页-1', '首页-2', '首页-3', '首页-4'] },
					{ title: '测试', content: ['测试-1', '测试-2', '测试-3', '测试-4', '测试-5'] },
					{ title: '我的', content: [] },
					{ title: 'hello', content: ['hello-1', 'hello-2', 'hello-3', 'hello-4', 'hello-5'] },
					{ title: '测试-1', content: ['测试-1-1', '测试-1-2', '测试-1-3', '测试-1-4', '测试-1-5'] },
					{ title: '测试-2', content: ['测试-2-1', '测试-2-2', '测试-2-3', '测试-2-4', '测试-2-5'] },
					{ title: '测试-3', content: ['测试-3-1', '测试-3-2', '测试-3-3', '测试-3-4', '测试-3-5'] },
					{ title: '测试-4', content: ['测试-4-1', '测试-4-2', '测试-4-3', '测试-4-4', '测试-4-5'] },
					{ title: '测试-5', content: ['测试-5-1', '测试-5-2', '测试-5-3', '测试-5-4', '测试-5-5'] }
				],
				refreStatus: false,
				swiperHeight: '0px'
			};
		},
		computed: {
			style() {
				return `width:${this.navItemWidth}px; left:${this.navItemLeft}px`;
			}
		},
		mounted() {
			this.init();
		},
		// 上拉加载功能
		onReachBottom() {
			uni.showToast({
				icon: 'none',
				title: `此时为${this.list[this.swiperIndex].title}触底`
			});
			setTimeout(() => {
				this.getData();
			}, 500);
		},
		// 下拉刷新功能(只做提示)
		onPullDownRefresh() {
			uni.showToast({
				icon: 'none',
				title: `此时为${this.list[this.swiperIndex].title}下拉刷新`
			});
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			// 获取dom信息
			init() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.uni-nav').fields({ rect: true, size: true }, res => {
					this.parentLeft = res.left;
					this.componentWidth = res.width;
					console.log('res==>', res);
				});
				query.selectAll('.nav-item').fields({ rect: true, size: true }, data => {
					data.forEach((item, index) => {
						if (index == 0) {
							this.navItemWidth = item.width;
							this.navItemLeft = item.left;
						}
						this.navInfos.push({ width: item.width, left: item.left });
					});
				});
				query.exec();
			},


			// swiper的index变动
			swiperChange(e) {
				this.swiperIndex = e.detail.current;
				this.scrollDom();
				this.$emit('currentIndex', this.swiperIndex);
				this.getSwiperHeight()
				// 切换swiper时需要重新获取 当前展示 swiper 的高度
				uni.pageScrollTo({
					scrollTop: 0
				})
			},

			// 点击导航切换swiper
			taggleNav(val) {
				this.swiperIndex = val;
			},

			// 滚动tabs以及移动下划线
			scrollDom() {
				let info = this.navInfos[this.swiperIndex];
				let offsetLeft = info.left - this.parentLeft;
				let scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2;
				this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft;
				this.navItemLeft = this.navInfos[this.swiperIndex].left;
				setTimeout(() => {
					this.navItemWidth = info.width;
				}, 50);
			},

			// tabs-scrollview触底
			handleScroll(e) {
				this.scrollDom();
			},

			// 生成列表数据
			getData() {
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(() => {
					for (let index = 0; index < 10; index++) {
						let arr = this.list[this.swiperIndex].content;
						this.$set(arr, arr.length, Math.random() + '-' + index + this.list[this.swiperIndex]
							.title);
					}
					uni.hideLoading();

					//放在这里面是因为 dom 渲染完成后才能获取到正确高度
					this.$nextTick(() => {
						this.getSwiperHeight()
					})
				}, 1000);

			},

			// 每次获取数据后需要获取swiper正常的高度, swiper默认高度无法使用
			getSwiperHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.swiper-item-module').fields({ rect: true, size: true }, res => {
					console.log('res==>', res.height);
					this.swiperHeight = res.height + 'px'

				});
				query.exec();

			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		overflow-y: scroll;
	}

	.loading-pull {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 0;

		svg {
			animation: myRotate linear infinite .5s;
			transform-origin: 50% 50%;
		}


		text {
			margin: 0 8px;
		}
	}

	@keyframes myRotate {
		0% {
			-webkit-transform: rotate(0deg);
		}

		50% {
			-webkit-transform: rotate(180deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}


	.nav-item {
		display: inline-block;
		margin: 0 16upx;
		text-align: center;
		transition: color 0.3s ease;
	}

	.fill-fixed {
		height: 40px;
	}

	.nav-box {
		position: fixed;
		width: 100%;
		background-color: #fff;
		z-index: 9;
	}

	.nav {

		white-space: nowrap;
		position: relative;
		height: 80upx;
		padding: 20upx 0;
	}

	/* #ifndef APP-NVUE */
	::-webkit-scrollbar {
		display: none;
	}

	/* #endif */

	/* #ifdef H5 */
	// 通过样式穿透，隐藏H5下，scroll-view下的滚动条
	scroll-view ::v-deep ::-webkit-scrollbar {
		display: none;
	}

	/* #endif */

	.nav-item-act {
		color: pink;
		font-weight: bolder;
	}

	.nav-line {
		position: absolute;
		bottom: 0;
		height: 10upx;
		border-radius: 10upx;
		background-color: pink;
		transition: left 0.3s ease;
	}

	swiper {
		min-height: 100vh;
		overflow-y: auto;
	}

	swiper-item {
		text-align: center;
		color: #000;
		position: relative;
		background-color: skyblue;
		color: #fff;
		height: auto !important;
	}

	.swiper-item {
		overflow-y: scroll;
	}

	.swiper-item-list {
		height: 400upx;
		border-bottom: 2upx solid pink;
		line-height: 400upx;
		background-color: red;
	}

	// .swiper-scroll {
	// 	height: 100%;
	// }
</style>
