<template>
	<view class="content">
		<!-- #ifndef H5 -->
		<view class="textNormal">{{ content }}</view>
		<view class="textShrink" :class="[{ textOpen: !isOpen }, className]" :style="'-webkit-line-clamp:' + line">{{ content }}</view>
		<view v-if="btnVisible" class="btn-toggle" @click="toggleHandle">
			<image :class="{ translate: !isOpen }" src="@/static/arrow.png" mode=""></image>
			{{ isOpen ? '展示' : '收起' }}
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="textShrink" :class="[{ textOpen: !isOpen }, className]" :style="'-webkit-line-clamp:' + line">{{ content }}</view>
		<view v-if="btnVisible" class="btn-toggle" @click="toggleHandle">
			<image :class="{ translate: !isOpen }" src="@/static/arrow.png" mode=""></image>
			{{ isOpen ? '展示' : '收起' }}
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	props: {
		// 文字内容
		content: {
			type: String,
			default:
				'視劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩，兩人育有兩女'
		},
		// 需要显示的行数
		line: {
			type: Number,
			default: 2
		},
		className: {
			type: String,
			default: 'azhen-Shrink'
		}
	},
	data() {
		return {
			shrinkNode: [], //被收缩的节点信息
			normalNode: [], //正常的节点信息
			isOpen: true, //是否需要打开
			btnVisible: true //按钮是否需要显示
		};
	},
	mounted() {
		// h5端获取节点信息
		// #ifndef H5
		const query = uni.createSelectorQuery().in(this);
		query.selectAll('.textShrink').fields({ size: true }, res => {
			res.forEach(item => {
				this.shrinkNode.push(item.height);
			});
		});
		query
			.selectAll('.textNormal')
			.fields({ size: true }, res => {
				console.log(res);
				res.forEach(item => {
					this.normalNode.push(item.height);
				});
				this.btnVisible = this.isOpen = this.normalNode[0] > this.shrinkNode[0];
			})
			.exec();
		// #endif

		// 非h5端获取节点信息
		// #ifdef H5
		const textShrink = document.getElementsByClassName(this.className);
		console.log(textShrink.length, textShrink);
		if (textShrink) {
			if (textShrink.length >= 2) {
				throw '节点类名不能设置为一样的,抛出错误的地方在文本收缩插件内';
			}
			const index = textShrink.length - 1;
			this.shrinkNode.push(textShrink[index].offsetHeight);
			this.normalNode.push(textShrink[index].scrollHeight);
			console.log(this.shrinkNode, this.normalNode);
			this.btnVisible = this.isOpen = this.normalNode[0] > this.shrinkNode[0];
		}
		// #endif
	},
	methods: {
		// 展开 收起事件
		toggleHandle() {
			this.isOpen = !this.isOpen;
		}
	}
};
</script>

<style lang="scss" scoped>
.textShrink {
	height: auto;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	word-break: break-word;
}

.textNormal {
	position: fixed;
	top: 0;
	opacity: 0;
	z-index: -1;
	word-break: break-word;
}
.textOpen {
	display: block;
}

.btn-toggle {
	display: flex;
	justify-content: center;
	align-items: center;
	color: #dbdbdb;
	image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	.translate {
		transform: rotate(180deg);
	}
}
</style>
