// 主进程
const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

let mainWindow = null

const windows = new Set()


app.on('ready', () => {
    createWindow()
    // console.log('hello from Electron')
    // mainWindow = new BrowserWindow({
    //     height: 800,
    //     width: 1000,
    //     show: false, // 首次创建窗口时，先隐藏空白窗口，等待加载了内容之后再显示窗口
    //     webPreferences: {
    //         nodeIntegration: true,
    //         enableRemoteModule: true,
    //     }
    // })
    // mainWindow.webContents.loadFile('index.html') // 在渲染进程中使用node

    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show()
    //     // mainWindow.webContents.openDevTools() // 打开chrome调试工具
    //     getFileFromUser()
    // })

    // mainWindow.on('closed', () => {
    //     mainWindow = null
    // })
})

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [ // 限制打开文件的类型 
            {name: 'Text Files', extensions: ['txt']},
            {name: 'Markdown Files', extensions: ['md', 'markdown']},
        ]
    })
    files.then(res => {
        console.log(res)
        if(!res.filePaths || res.filePaths.length === 0){return;}
        console.log(res.filePaths)
        const file = res.filePaths[0]
        const content = fs.readFileSync(file).toString()
        console.log(content)
        targetWindow.webContents.send('file-opened',file,  content)
    })
}

const createWindow = exports.createWindow = () => {
    let x, y
    const currentWindow = BrowserWindow.getFocusedWindow()
    if(currentWindow){
        const [currentWindowX, currentWindowY] = currentWindow.getPosition()
        x = currentWindowX + 10
        y = currentWindowY + 10
    }


    let newWindow = new BrowserWindow({
        x,
        y,
        height: 800,
        width: 1000,
        show: false, // 首次创建窗口时，先隐藏空白窗口，等待加载了内容之后再显示窗口
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    newWindow.loadFile('index.html')

    newWindow.once('ready-to-show', () => {
        newWindow.show()
    })

    newWindow.on('closed', () => {
        windows.delete(newWindow)
        newWindow = null
    })

    windows.add(newWindow)
    return newWindow
}