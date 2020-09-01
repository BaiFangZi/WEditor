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

//创建文件
export function createNewFile(filePath, callback) {
	fs.writeFileSync(filePath, '')
	// fs.mkdirSync(path.join(path.dirname(filePath), path.basename(filePath, '.md')))
	if (typeof callback === "function") {
		//alert(callback);
		callback();
	}
	store.commit('setPath', filePath)
}


export function saveFile(text, quitFlag, event) {
	try {
		if (store.state.filePath == '') {
			dialog.showSaveDialog({
				title: '选择文件保存路径',
			}).then(result => {
				const {
					filePath
				} = result
				if (!result.canceled) {
					createNewFile(filePath, () => {
						fs.writeFileSync(filePath, text)
					})
					store.commit('setSaveFlag', true)
					if (quitFlag) {
						event.sender.send("quit-reply", 1);
					}
				}
			}).catch(err => {
				console.log(err)
			})
		} else {
			fs.writeFileSync(store.state.filePath, text)
			store.commit('setSaveFlag', true)
			if (quitFlag) {
				event.sender.send("quit-reply", 1);
			}
		}
		// return true
	} catch (err) {
		console.log(err)
	}
}

export function openFile(filePath) {
	const value = fs.readFileSync(filePath)
	store.commit('setPath', filePath)
	return value.toString()
	// store.commit('setValue', value.toString())
}
export function quit(value, event) {
	let result;
	try {
		if (store.state.saveFlag) { //已经保存
			if (value) { //有文本
				event.sender.send("quit-reply", 1);
				// result = 1
			} else { //没文本
				event.sender.send("quit-reply", 2);
				// result = 2
			}
		} else { //未保存
			dialog.showMessageBox({
				message: '文档未保存，是否退出?',
				type: 'question',
				buttons: ['取消', '保存', '直接退出'],
				defaultId: 1,
			}).then(res => {
				switch (res.response) {
					case 0: {
						event.sender.send("quit-reply", 0);
					}
					break;
				case 1: {
					saveFile(value, true, event)
				}
				break;
				case 2: {
					event.sender.send("quit-reply", 2);
				}
				break
				}

			}).catch(err => {
				console.log(err)
			})
		}
	} catch (err) {
		console.log(err)
	}
}

export function createImgFile(imgBase64, filePath, ID) {
	let imgPath, imgFolderPath
	if (filePath) {
		imgFolderPath = path.join(path.dirname(filePath), path.basename(filePath, '.md'))
	} else {
		imgFolderPath = path.join(path.dirname(remote.app.getPath('exe')), 'user-img-file')
	}
	if (!fs.existsSync(imgFolderPath)) {
		fs.mkdirSync(imgFolderPath)
	}
	imgPath = path.join(imgFolderPath, `post-img-${ID}.png`)
	const data = imgBase64.replace(/^data:image\/\w+;base64,/, "")
	const dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
	fs.writeFileSync(imgPath, dataBuffer)
	return imgPath
}

//新建文件
ipcRenderer.on('new', (e, filePath) => {
	createNewFile(filePath)
})


// ipcRenderer.on('quit', (e, filePath) => {
// 	const result = quit()
// 	console.log(result)
// 	if (result != 1) {
// 		e.sender.send('quit-reply', result)
// 	} else {
// 		if (store.state.filePath == '') {
// 			dialog.showSaveDialog({
// 				title: '选择文件保存路径',
// 			}, (p) => {
// 				// console.log(p)
// 				if (p) {
// 					createNewFile(p, () => {
// 						fs.writeFileSync(p, store.state.textValue)
// 					})
// 					store.commit('setSaveFlag', true)
// 					e.sender.send('quit-reply', 1)
// 				}
// 			})
// 		} else {
// 			fs.writeFileSync(store.state.filePath, store.state.textValue)
// 			store.commit('setSaveFlag', true)
// 			e.sender.send('quit-reply', 1)
// 		}
// 	}

// })


ipcRenderer.on('read', (e, mainEvent) => {


})

ipcRenderer.on('CtrlS-Reply', (e, text) => {
	// saveFile(store.state.textValue)
})