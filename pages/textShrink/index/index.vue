<template>
	<view class="content">
		<button type="default" @click="lineAdd">点我多显示一行(默认为两行)</button>
		<view style="color:red;text-align: center;">此处只动态显示行数,下方按钮不会动态判断,一般行数显示都是初始化时提前设置的,如果需要一个页面多次使用组件,需要给组件传不同类名,单次使用不需要</view>
		<TextShrink
			className="shrink3"
			:line="line"
			content="明文，是指没有加密的文字（或者字符串），一般人都能看懂的意思，属于密码学术语。 [1]  在通信系统中它可能是比特流，如文本、位图、数字化的语音或者数字化的视频图像等。一般可以简单地认为明文是有意义的字符或比特集，或通过某种公开的编码标准就能获得的消息。经过某个加密算法进行作用，将作用后的文字称为密文。对密文来说，若想得到明文，就应通过与加密算法对应的解密算法进行解密，恢复出明文。"
		/>
		<view style="color:red;text-align: center;">不会显示按钮</view>
		<TextShrink className="shrink5" :line="line" content="行作用，将作用后的文字称为密文。对密文来说" />
		<view style="color:red;text-align: center;">英文示例</view>
		<TextShrink
			className="shrink1"
			:line="line"
			content="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdfffffffffffffffffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaaafsdfsffff"
		/>
		<TextShrink
			:line="line"
			content="Consider… YOU. In all time before now and in all time to come, there has never been and will never be anyone just like you. You are unique in the entire history and future of the universe. Wow! Stop and think about that. You're better than one in a million, or a billion, or a gazillion"
		/>
		<view style="color:red;text-align: center;">英文示例(不会显示按钮)</view>
		<TextShrink className="shrink4" :line="line" content="aaaaaaaaaaaaaaaaaaaaaaaaaaafsdfsffff" />
	</view>
</template>

<script>
import TextShrink from '@/components/textShrink/textShrink';
export default {
	components: {
		TextShrink
	},
	data() {
		return {
			line: 2
		};
	},
	methods: {
		lineAdd() {
			this.line++;
		}
	}
};
</script>

<style lang="scss" scoped></style>
