<template>
	<view>
		<button type="default" @tap="uploadImg">上传人脸图片(检测案例)</button>
		<navigator url="../web-view/index/index"><button type="default">去看游戏</button></navigator>
		<!-- <button type="default" @tap="handleIndentity">上传身份证照片</button> -->
		<view class="" style="display: flex; align-items: center; margin-top: 20px;">
			<button type="default" @tap="changeSex">变身魔法上传图片</button>
			<radio-group @change="checkboxChange">
				<label>
					<radio value="0" checked="true" />
					女生
				</label>
				<label>
					<radio value="1" />
					男生
				</label>
			</radio-group>
		</view>
		<image :src="imgsrc" mode="widthFix" style="display: block; margin: 20px auto;"></image>
		<image :src="mineImg" mode="widthFix" style="display: block; margin: 20px auto;"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sex: 0,
			mineImg: 'https://i.loli.net/2020/11/02/btO2irKsyeH3BTl.jpg',
			imgsrc: 'https://wxmarketurl-1254418846.cos.ap-guangzhou.myqcloud.com/1254418846/oiwzY5cJohacTMxluyJKZGMzDvg0/E7GtoUssg7b4L'
		};
	},
	onShareAppMessage() {},
	methods: {
		checkboxChange(e) {
			this.sex = Number(e.detail.value);
		},
		uploadImg() {
			wx.chooseImage({
				count: 1,
				success: async function(res) {
					try {
						uni.showLoading({
							title: '加载中'
						});
						const { data } = await wx.serviceMarket.invokeService({
							service: 'wx2d1fd8562c42cebb',
							api: 'detectFace',
							data: {
								// 用 CDN 方法标记要上传并转换成 HTTP URL 的文件
								Action: 'DetectFace',
								Url: new wx.serviceMarket.CDN({
									type: 'filePath',
									filePath: res.tempFilePaths[0]
								})
							}
						});
						if (data.Error) {
							uni.showToast({
								title: data.Error.Message,
								icon: 'none'
							});
						} else {
							wx.showModal({
								title: 'success',
								content: JSON.stringify(data)
							});
						}
					} catch (err) {
						console.error('invokeService fail', err);
						wx.showModal({
							title: 'fail',
							content: err
						});
					} finally {
						uni.hideLoading();
					}
				},
				fail: function(res) {},
				complete: function(res) {}
			});
		},
		handleIndentity() {
			// 选择图片
			wx.chooseImage({
				count: 1,
				success: async function(res) {
					uni.showLoading({
						title: '加载中'
					});
					try {
						const invokeRes = await wx.serviceMarket.invokeService({
							service: 'wx2d1fd8562c42cebb',
							api: 'OcrAllInOne',
							data: {
								// 用 CDN 方法标记要上传并转换成 HTTP URL 的文件
								img_url: new wx.serviceMarket.CDN({
									type: 'filePath',
									filePath: res.tempFilePaths[0]
								}),
								data_type: 3,
								ocr_type: 1
							}
						});

						console.log('invokeService success', invokeRes);
						wx.showModal({
							title: 'success',
							content: JSON.stringify(invokeRes)
						});
					} catch (err) {
						console.error('invokeService fail', err);
						wx.showModal({
							title: 'fail',
							content: err
						});
					} finally {
						uni.hideLoading();
					}
				},
				fail: function(res) {},
				complete: function(res) {}
			});
		},
		changeSex() {
			// 选择图片
			wx.chooseImage({
				count: 1,
				success: async res => {
					uni.showLoading({
						title: '加载中'
					});
					this.mineImg = res.tempFilePaths[0];
					try {
						const { data } = await wx.serviceMarket.invokeService({
							service: 'wx2d1fd8562c42cebb',
							api: 'swapGenderPic',
							data: {
								Action: 'SwapGenderPic',
								Url: new wx.serviceMarket.CDN({
									type: 'filePath',
									filePath: res.tempFilePaths[0]
								}),
								GenderInfos: [{ Gender: this.sex }]
							}
						});
						if (data.ResultUrl) {
							this.imgsrc = data.ResultUrl;
						} else {
							wx.showModal({
								title: 'success',
								content: JSON.stringify(data)
							});
						}
					} catch (err) {
						console.error('invokeService fail', err);
						wx.showModal({
							title: 'fail',
							content: err
						});
					} finally {
						uni.hideLoading();
					}
				},
				fail: function(res) {},
				complete: function(res) {}
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
