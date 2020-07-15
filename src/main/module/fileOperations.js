import prompt from 'electron-prompt'
import fs from 'fs'
import path from 'path'
import {
	dialog,
	// ipcMain,
} from 'electron'
// import cmd from './cmd.js';
const exec = require('child_process').exec;

// export const filePath = ''
let filePath = ''

export function createNewFile(callback) {
	// const baseUrl = 'E:/myblog'
	dialog.showSaveDialog({
		title: '选择md文件保存路径',
	}, (p) => {
		if (p) {
			filePath = p

			fs.writeFile(p, '', err => {
				if (err) {
					console.log(err)
				}
			})
			fs.mkdir(path.join(path.dirname(p), path.basename(p, '.md')), function(err) {
				if (err) {
					console.log(err);
				}
			})
			if (typeof callback === "function") {
				callback(p);
			}
		} else {
			return false
		}

	})
}
export function saveFile(text) {
	if (filePath == '') {
		createNewFile(() => {
			fs.writeFile(filePath, text, err => {
				if (err) {
					console.log(err)
				}
			})
		})
	} else {
		fs.writeFile(filePath, text, err => {
			if (err) {
				console.log(err)
			}
		})
	}

}

export function openFile(callback) {


	dialog.showOpenDialog({}, (p) => {
		if (p) {

			filePath = p[0]
			// console.log(p)
			let content = fs.readFileSync(filePath)
			if (typeof callback === "function") {
				callback({
					content,
					filePath
				});
			}
		} else {
			// dialog.showErrorBox('错误', '打开文件出错！')
			return false
		}
	})


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
	const imgPath = path.join(path.dirname(filePath), path.basename(filePath, '.md'), `post-img-${index}.png`)
	const data = imgBase64.replace(/^data:image\/\w+;base64,/, "")
	var dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
	fs.writeFileSync(imgPath, dataBuffer)
	return imgPath
}
