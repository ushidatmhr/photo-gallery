import electron from 'electron';
import url from 'url';
import path from 'path';

const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;
const app: Electron.App = electron.app;

class MyApplication {

    mainWindow: Electron.BrowserWindow;

    constructor(app: Electron.App) {
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('ready', this.onReady);
    }


    onWindowAllClosed() {
        if (process.platform != 'darwin') {
            app.quit();
        }
    }


    onReady() {
        this.mainWindow = new BrowserWindow({
            width: 1800,
            height: 1400,
            minWidth: 500,
            minHeight: 200,
            acceptFirstMouse: true,
            titleBarStyle: 'hidden'
        });

        this.mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}

const myapp = new MyApplication(app);
