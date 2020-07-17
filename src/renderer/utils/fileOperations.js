// import prompt from 'electron-prompt'
import fs from 'fs'
import path from 'path'
import {
	remote,
	ipcRenderer,
	// ipcMain,
} from 'electron'
// import {ipcMain} from 'electron'
import store from '../store/'
const dialog = remote.dialog
// import cmd from './cmd.js';
// const exec = require('child_process').exec;
//  const filePath = ''
// let filePath = ''
// ipcMain.on('CtrlS', (e, action) => {
// 	saveFile(store.state.textValue)
// })

// console.dir(ipcMain)

export function createNewFile(filePath, callback) {
	fs.writeFileSync(filePath, '')
	// fs.mkdirSync(path.join(path.dirname(filePath), path.basename(filePath, '.md')))
	if (typeof callback === "function") {
		//alert(callback);
		callback();
	}
	store.commit('setPath', filePath)
}



export function saveFile(text, callback) {
	try {
		if (store.state.filePath == '') {
			dialog.showSaveDialog({
				title: '选择文件保存路径',
			}, (p) => {
				// console.log(p)
				if (p) {
					createNewFile(p, () => {
						fs.writeFileSync(p, text)
					})

					store.commit('setSaveFlag', true)
				}
			})
			// if (typeof callback == "function") {
			// 	callback()
			// }
		} else {
			fs.writeFileSync(store.state.filePath, text)

			store.commit('setSaveFlag', true)
		}

		// return true
	} catch (err) {
		console.log(err)
	}

}

export function openFile(filePath) {

	const value = fs.readFileSync(filePath)
	store.commit('setPath', filePath)
	store.commit('setValue', value.toString())

}
export function quit(callback) {
	if (store.state.saveFlag) {
		if (store.state.textValue) {
			return 1
		} else {
			return 2
		}
	} else {
		const result = dialog.showMessageBox({
			message: '你是否要保存当前文档?',
			type: 'question',
			buttons: ['取消', '保存', '直接退出'],
			defaultId: 1,
		})

		if (typeof callback == 'function') {
			callback()
		}
		return result
	}
}

export function createImgFile(imgBase64, filePath, ID) {

	// console.log(path.dirname(remote.app.getPath('exe')))//C:\Users\wb158\AppData\Local\Programs\weditor
	let imgPath, imgFolderPath

	if (filePath) {
		imgFolderPath = path.join(path.dirname(filePath), path.basename(filePath, '.md'))
	} else {
		imgFolderPath = path.join(path.dirname(remote.app.getPath('exe')), 'user-img-file')
	}
	if (!fs.existsSync(imgFolderPath)) {
		fs.mkdirSync(imgFolderPath)
	}
	// const imgPath = path.join(path.dirname(filePath), path.basename(filePath, '.md'), `post-img-${ID}.png`)
	imgPath = path.join(imgFolderPath, `post-img-${ID}.png`)
	const data = imgBase64.replace(/^data:image\/\w+;base64,/, "")
	const dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
	fs.writeFileSync(imgPath, dataBuffer)
	return imgPath

}


ipcRenderer.on('new', (e, filePath) => {
	createNewFile(filePath)
})

ipcRenderer.on('open', (e, filePath) => {
	openFile(filePath[0])
})

ipcRenderer.on('save', (e, filePath) => {
	saveFile(store.state.textValue)
})

ipcRenderer.on('quit', (e, filePath) => {
	const result = quit()
	console.log(result)
	if (result != 1) {
		e.sender.send('quit-reply', result)
	} else {
		if (store.state.filePath == '') {
			dialog.showSaveDialog({
				title: '选择文件保存路径',
			}, (p) => {
				// console.log(p)
				if (p) {
					createNewFile(p, () => {
						fs.writeFileSync(p, store.state.textValue)
					})
					store.commit('setSaveFlag', true)
					e.sender.send('quit-reply', 1)
				}
			})
			// if (typeof callback == "function") {
			// 	callback()
			// }
		} else {
			fs.writeFileSync(store.state.filePath, store.state.textValue)
			store.commit('setSaveFlag', true)
			e.sender.send('quit-reply', 1)
		}
	}

})

ipcRenderer.on('read', (e, mainEvent) => {


})

ipcRenderer.on('CtrlS-Reply', (e, text) => {
	saveFile(store.state.textValue)
})
