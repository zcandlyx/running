<template>
	<view>
		<button @tap="goTabs_swiper('/pages/tabs-swiper/tabs-swiper')" type="default">tabs-swiper(可滚动)</button>
		<button type="default" @tap="goTabs_swiper('/pages/tabs/index')">tabs(非滚动型)</button>
		<button type="default" @tap="goTabs_swiper('/pages/textShrink/index/index')">textShrink(文本收缩)</button>
		<button type="default" @tap="gotabBar('/pages/home/index')">查看主题色切换</button>
		
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		goTabs_swiper(url) {
			console.log('url==>', url);
			uni.navigateTo({
				url
			});
		},
		gotabBar(url){
			uni.switchTab({
				url
			})
		},
		openMap() {
			// #ifdef H5
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					function(position) {
						alert(position.coords.latitude + '===' + position.coords.longitude);
					},
					error => {
						alert('ERROR(' + error.code + '): ' + error.message);
					},
					{
						enableHighAccuracy: true
					}
				);
				/* 地理位置服务可用 */
			} else {
				alert('不可用');
				/* 地理位置服务不可用 */
			}
			// #endif
			// #ifdef MP-WEIXIN
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				success: function(res) {
					const latitude = res.latitude;
					const longitude = res.longitude;
					console.log(latitude, longitude);
					uni.openLocation({
						latitude: latitude,
						longitude: longitude,
						success: function() {
							console.log('success');
						}
					});
				},
				fail: err => {
					console.log(err);
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss"></style>
