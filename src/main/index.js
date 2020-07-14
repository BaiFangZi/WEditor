import {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} from 'electron'
import {
	createNewFile,
	saveFile,
	openFile,
	createImgFile,
	quit,
} from './module/fileOperations.js'


let mainWindow
let i = 1
const menuTemplate = [{
	label: '文件',
	submenu: [{
			label: '新建',
			// accelerator: 'Cmd+N',
			click() {
				createNewFile((e) => {
					mainWindow.webContents.send('new', e)
				})

			}
		}, {
			label: '打开',
			// accelerator: 'Cmd+O',
			click() {
				const file = openFile()
				mainWindow.webContents.send('open', file)
			},
		}, {
			label: '保存',
			click() {
				// console.log(mainWindow.webContents.sendSync)
				mainWindow.webContents.send('menuItemSave')
			}
			// accelerator: 'Cmd+S',

		},
		{
			type: 'separator',
		}, {
			label: '退出',
			click() {
				// console.log(mainWindow.webContents)

				// saveFile(text)
				quit(() => {
					mainWindow.webContents.send('quit')
				})

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
		height: 563,
		useContentSize: true,
		width: 1000,
		webPreferences: {
			webSecurity: false
		},

	})

	mainWindow.loadURL(winURL)
	// mainWindow.webContents.openDevTools()
	mainWindow.on('closed', () => {
		mainWindow = null
	})

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})




ipcMain.on('paste', (e, action) => {
	// const path=createImgFile(action, i++)
	const path = createImgFile(action, i++)
	e.sender.send('render-img', path)

})
ipcMain.on('save', (e, action) => {
	saveFile(action)
})
