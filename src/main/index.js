import {
	app,
	BrowserWindow,
	Menu,
	ipcMain,
	dialog
} from 'electron'



let mainWindow //窗体对象
let i = 1 //img图片后标，

const menuTemplate = [{
	label: '文件',
	submenu: [{
			label: '新建',
			// accelerator: 'Cmd+N',
			click() {
				console.log(1212)
				dialog.showSaveDialog({
					title: '选择文件保存路径', // 	mainWindow.webContents.send('new', p)
				}).then(result => {
					if (!result.canceled) {
						mainWindow.webContents.send('new', result.filePath)
					}

				}).catch(err => {
					console.log(err)
				})
			}
		}, {
			label: '打开',
			// accelerator: 'Cmd+O',
			click() {
				dialog.showOpenDialog().then(result => {
					// console.log(result)
					if (!result.canceled) {
						mainWindow.webContents.send('open', result.filePaths[0])
					}
				}).catch(err => {
					console.log(err)
				})

			},
		}, {
			label: '保存',
			click() {
				// console.log(mainWindow.webContents.sendSync)
				mainWindow.webContents.send('save')
			}
			// accelerator: 'Cmd+S',

		},
		{
			type: 'separator',
		}, {
			label: '退出',
			click() {
				mainWindow.webContents.send('quit')
				// console.log(mainWindow.webContents)

				// saveFile(text)
				// quit(() => {
				// 
				// })

			}
			// role: 'quit',
		}
	]
}]


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}


const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080` :
	`file://${__dirname}/index.html`

function createWindow() {
	/**
	 * Initial window options
	 */
	const menu = Menu.buildFromTemplate(menuTemplate);

	Menu.setApplicationMenu(menu);
	mainWindow = new BrowserWindow({
		// height: 563,
		// fullscreen: true,
		minHeight: 500,
		minWidth: 400,
		useContentSize: true,
		width: 1000,
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true
		},

	})

	mainWindow.loadURL(winURL)
	// mainWindow.maximize()
	//mainWindow.webContents.openDevTools()
	mainWindow.on('close', (e) => {
		e.preventDefault(); //阻止默认行为，一定要有
		mainWindow.webContents.send('quit')
	})
}

app.on('ready', createWindow)

// app.on('window-all-closed', () => {
// 	if (process.platform !== 'darwin') {
// 		app.quit()
// 	}
// })

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})




// ipcMain.on('paste', (e, action) => {
// 	// const path=createImgFile(action, i++)
// 	const path = createImgFile(action, i++)
// 	e.sender.send('render-img', path)

// })
ipcMain.on('CtrlS', (event, action) => {

	event.sender.send('CtrlS-Reply', action);
})
ipcMain.on('quit-reply', (event, action) => {
	// console.log(1212212121)
	// console.log(action)
	switch (action) {
		case 0:
			break;
		case 1: {
			mainWindow = null
			app.exit()
		}
		break;
	case 2: {
		mainWindow = null
		app.exit()
	}
	break;
	}
	// event.sender.send('CtrlS-Reply', action);
})

// CtrlS-Reply