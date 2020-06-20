<template>
	<view>
		<view class="startRun" @tap="run">
			开始
		</view>
		<map id="map" style="width: 100%; height: 300px;" :polyline="polyline" subkey="3WUBZ-VQF6J-RIYFS-FXCZC-5FFSO-S2FFO"
		 :latitude="latitude" :longitude="longitude" :markers="covers">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: 'https://i.loli.net/2020/06/08/lwNVLPa6CsKmHin.png',
					width: 20,
					height: 20,
					circles: true,
					id: 0, // 使用 marker点击事件 需要填写id
				}],
				mapContext: {},
				polyline: [{
					points: [{	
						longitude: 116.39742,
						latitude: 39.909
					}, {
						longitude: 120.39742,
						latitude: 41.909
					}, {
						longitude: 100.39742,
						latitude: 36
					}],
					color: "#FF0000DD",
					width: 2,
					dottedLine: true
				}],
				index: 0

			}
		},
		created() {
			this.mapContext = uni.createMapContext("map", this)

		},
		mounted() {

		},
		methods: {
			run() {
				this.translate()
			},
			translate() {
				++this.index;
				if (!this.polyline[0].points[this.index]) return
				console.log(this.index)
				const _this = this;
				this.mapContext.translateMarker({
					markerId: 0,
					destination: this.polyline[0].points[this.index],
					autoRotate: true,
					rotate: 0,
					duration: 10000,
					fail() {
						console.log("运动出错了")
					},
					animationEnd() {
						_this.translate()
						console.log("运动结束")
					}
				});

			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
