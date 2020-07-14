<template>
	<div class="wrapper">
		<div><textarea class="content input" name="" id="" v-model="textValue" @paste="onPaste" @keyup.ctrl.83="onSave"></textarea></div>
		<div ref="outputText" class="content output" @paste="onPaste"></div>
	</div>
</template>

<script>
import marked from 'marked';
import { ipcRenderer } from 'electron';
export default {
	name: 'home',
	data() {
		return {
			textValue: '',
			imgData: ''
		};
	},
	mounted() {
		ipcRenderer.on('new', (e, action) => {
			//监听新建文件事件
			this.textValue = '';
			document.title = action;
		});
		ipcRenderer.on('open', (e, action) => {
			//监听打开文件事件
			this.textValue = action.content.toString();
			document.title = action.path;
		});
		ipcRenderer.on('menuItemSave', (e, action) => {
			//监听菜单栏保存按键事件
			this.onSave();
		});
		ipcRenderer.on('quit', (e, action) => {
			this.onSave();
		});
	},
	methods: {

		onPaste(e) {
			//图片复制的相关操作，
			let _this = this;
			if (!(e.clipboardData && e.clipboardData.items)) {
				return;
			}
			for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
				var item = e.clipboardData.items[i];

				if (item.kind === 'file') {
					var pasteFile = item.getAsFile();
					var reader = new FileReader();
					reader.readAsDataURL(pasteFile);
					reader.onload = function(e) {
						_this.imgData = this.result;
						ipcRenderer.send('paste', this.result);
						ipcRenderer.once('render-img', (e, path) => {
							path = path.toString();
							_this.textValue += `![文本](${path})`;
							// console.log(action)
							// _this.$refs.outputText.innerHTML += `<img src="${action}" alt="">`;
						});
						// _this.onChange();
						// console.log(this.result);
					};
				}
			}
		},
		onSave() {
			//快捷键 ctrl+s保存事件
			// console.log(this.textValue)
			ipcRenderer.send('save', this.textValue);
		}
	},
	watch: {
		// data(newValue, oldValue) {

		// }
		textValue() {
			this.$refs.outputText.innerHTML = marked(this.textValue).replace(/%5C/g, '\\');
		}
	}
};
</script>

<style>
.wrapper {
}
.wrapper .content {
	position: absolute;
	background-color: #faf6e6;
	top: 0;
	bottom: 0;
	width: calc(50% - 16px);
	overflow: auto;
	padding: 6px;
}
.input {
	font-size: 16px;
	left: 0;
	border: none;
	border-right: 2px solid #c3d9ff;
	resize: none;
	outline: none;
	font-family: '微软雅黑';
}
.output {
	right: 0;

	border: none;
	border-left: 2px solid #c3d9ff;
}
img {
	display: block;
}
</style>
