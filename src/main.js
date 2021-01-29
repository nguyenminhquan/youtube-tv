const { app, BrowserWindow, BrowserView, session } = require('electron')
const path = require('path');

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 450,
        title: "Youtube TV",
    });
    win.setMenu(null);

    const view = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
        }
    })
    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, width: win.getSize()[0], height: win.getSize()[1] });
    view.webContents.loadURL('https://youtube.com/tv');

    win.on('resize', () => {
        setTimeout(() => {
            view.setBounds({ x: 0, y: 0, width: win.getSize()[0], height: win.getSize()[1] });
        }, 10);
    });

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Linux; Tizen 2.3) AppleWebKit/538.1 (KHTML, like Gecko)Version/2.3 TV Safari/538.1';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})