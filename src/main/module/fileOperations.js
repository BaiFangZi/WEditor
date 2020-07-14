import prompt from 'electron-prompt'
import fs from 'fs'
import path from 'path'
import {
	dialog,
	ipcMain,
} from 'electron'
// import cmd from './cmd.js';
const exec = require('child_process').exec;

// export const filePath = ''
let fileName = ''
const basePath = 'E:/Notes'
export function createNewFile(callback) {
	const baseUrl = 'E:/myblog'
	prompt({
			title: '创建文件',
			label: '文件名:',
			value: 'new-file',
			buttonLabels: {
				ok: '确定',
				cancel: '取消',

			},
			// inputAttrs: {
			// 	type: 'url'
			// },
			type: 'input'
		}, )
		.then((r) => {
			if (r === null) {
				console.log('user cancelled');
			} else {
				fileName = r
				// this.filePath = `E:/myblog/source/_posts/${r}.md`
				// fs.access(path.join('E:/myblog/source/_posts', `${r}.md`), (err) => {
				fs.access(`${basePath}/${r}.md`, (err) => {
					try {
						if (err.code == 'ENOENT') {
							fs.writeFile(`${basePath}/${r}.md`, '', err => {
								if (err) {
									console.log(err)
								}
							})
							fs.mkdir(`${basePath}/${r}`, function(err) {
								if (err) {
									console.log(err);
								} else {
									console.log("creat done!");
								}
							})
							if (typeof callback === "function") {
								//alert(callback);
								callback(`${basePath}/${r}.md`);
							}

						}

					} catch (err) {
						dialog.showErrorBox('错误', '检查命名重复！')
					}
				});
			}
		})
		.catch(console.error);
}


export function saveFile(text) {

	fs.writeFile(`E:/Notes/${fileName}.md`, text, err => {
		if (err) {
			console.log(err)
		}
	})
}

export function openFile() {
	const [path] = dialog.showOpenDialog({
		filters: [{
			name: '文本文件',
			extensions: ['json', 'js', 'html', 'css', 'md'],
		}, {
			name: '所有文件',
			extensions: ['*'],
		}],
		properties: ['openFile', 'createDirectory'],
	})
	if (path) {
		// return path
		const content = fs.readFileSync(path)

		return {
			content,
			path
		}
	} else {
		dialog.showErrorBox('错误', '打开文件出错！')
	}
}
export function quit(callback) {
	const result = dialog.showMessageBox({
		message: '你是否要保存当前文档?',
		type: 'question',
		buttons: ['确定', '取消'],
	})
	// console.log(result)
	if (result === 0) {
		if (typeof callback === "function") {
			//alert(callback);
			callback();
		}
	}
}
export function createImgFile(imgBase64, index) {
	// const imgPath = `E:/myblog/source/_posts/${fileName}/post-img-${index}.png`

	const imgPath = path.join(basePath, fileName, `post-img-${index}.png`)
	const data = imgBase64.replace(/^data:image\/\w+;base64,/, "")
	var dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
	fs.writeFileSync(imgPath, dataBuffer)
	return imgPath
}
//<img src="file:\\E:\myblog\source\_posts\abcddd\post-img-1.png" alt="文本">
