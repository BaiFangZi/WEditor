<template>
	<div class="wrapper">
		<div><textarea class="content input" name="" id="" v-model="textValue" @paste="onPaste" @keyup.ctrl.83="onSave"></textarea></div>
		<div ref="outputText" class="content output" @paste="onPaste"></div>
	</div>
</template>

<script>
import marked from 'marked';
// import {
// 	createNewFile,
// 	saveFile,
// 	openFile,
// 	createImgFile,
// 	quit,
// } from '@/utils/fileOperations.js'
// import File from '@/utils/communicate.js';
import { createImgFile } from '@/utils/fileOperations.js';
import { ipcRenderer } from 'electron';
export default {
	name: 'home',
	data() {
		return {
			textValue: '',
			imgData: '',
			imgID: 0
			// title: ''
		};
	},
	mounted() {
		this.$store.commit('setPath', '');
		this.$store.commit('setValue', '');
		this.$store.commit('setSaveFlag', true);
		setInterval(() => {
			if (this.$store.state.filePath) {
				this.onSave();
			}
		}, 1000 * 30);
		// document.title = `WEditor ${this.$store.state.filePath} 已保存`;
		// console.log(this.$store.state.saveFlag);
		// console.log(this.$store.state.filePath);
		// console.log(this.$store.state.textValue);
	},

	methods: {
		onPaste(e) {
			//图片复制的相关操作，
			let _this = this;
			if (!(e.clipboardData && e.clipboardData.items)) {
				return;
			}
			const item = e.clipboardData.items[0];
			if (item.kind === 'file') {
				var pasteFile = item.getAsFile();
				var reader = new FileReader();
				reader.readAsDataURL(pasteFile);
				reader.onload = function(e) {
					const path = createImgFile(this.result, _this.$store.state.filePath, _this.imgID++);
					_this.textValue += `![文本](${path})`;
					// _this.$store.commit('setImgBuffer', this.result);

					// _this.imgData = this.result;

					// ipcRenderer.send('paste-img', this.result);

					// ipcRenderer.once('render-img', (e, path) => {
					// 	path = path.toString();

					// 	// console.log(action)
					// 	// _this.$refs.outputText.innerHTML += `<img src="${action}" alt="">`;
					// });
					// _this.onChange();
					// console.log(this.result);
				};
			}
		},
		onSave() {
			//快捷键 ctrl+s保存事件
			// document.title = this.title + '   已保存   ';

			ipcRenderer.send('CtrlS', this.textValue);
			// document.title = `WEditor ${this.$store.state.filePath} 正在编辑`;
		}
	},
	watch: {
		'$store.state.textValue': function(newValue, oldValue) {
			this.textValue = this.$store.state.textValue;
		},

		'$store.state.saveFlag': function(newValue, oldValue) {
			if (newValue) {
				document.title = `WEditor ${this.$store.state.filePath}  `;
			} else {
				if (this.$store.state.filePath == '') {
					document.title = `WEditor new-file 正在编辑...`;
				} else {
					document.title = `WEditor ${this.$store.state.filePath} 正在编辑...`;
				}
			}
			// console.log(111);
		},
		// '$store.state.filePath':function(newValue, oldValue){
		// 	if(newValue){
		// 		this.onSave()
		// 	}
		// },
		textValue(newValue, oldValue) {
			// console.log('change');
			// document.title = `WEditor ${this.$store.state.filePath} 正在编辑`;
			this.$store.commit('setValue', newValue);
			this.$store.commit('setSaveFlag', false);
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
