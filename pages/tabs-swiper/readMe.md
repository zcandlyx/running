这次主要的改变是,取消 scroll-view 的使用, 因为scroll - view 在元素较多的情况下性能不好, 使用页面的 下拉, 上拉功能, 如下所示

```js
onReachBottom() {
			// 下拉加载功能
			uni.showToast({
				icon: 'none',
				title: `此时为${this.list[this.swiperIndex].title}触底`
			});
			setTimeout(() => {
				this.getData();
			}, 500);
		},
		// 下拉刷新功能
		onPullDownRefresh() {
			uni.showToast({
				icon: 'none',
				title: `此时为${this.list[this.swiperIndex].title}下拉刷新`
			});
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
```

由于 swiper 的限制, 无法使高度自适应,  所以使用了 uni 内置的 `uni.createSelectorQuery().in(this)` api 来获取 当前展示的 swiper 高度

具体逻辑如下; 可以到代码内部自己看下



```js
const query = uni.createSelectorQuery().in(this);
				query.select('.swiper-item-module').fields({ rect: true, size: true }, res => {
					console.log('res==>', res.height);
					this.swiperHeight = res.height + 'px'

				});
				query.exec();
```

**需要注意的是**

一般联动的功能都是 APP 端使用, 本次改变将会导致 小程序端如果开启下拉刷新功能 tabl 栏 会和页面一起移动,体验效果较差, APP 没有此隐患

demo 只是用来展示, 所以没用注意细节逻辑的实现, 还需要各位根据需求来实现功能, 源码奉上



