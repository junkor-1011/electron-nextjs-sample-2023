// Native
import { join } from 'node:path';

// Packages
import { BrowserWindow, app, ipcMain, session, type IpcMainEvent } from 'electron';
import serve from 'electron-serve';
import isDev from 'electron-is-dev';

const loadURL = serve({
  directory: 'renderer/dist',
});

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const cspContents = isDev
      ? ["default-src 'self' 'unsafe-inline'"]
      : ["default-src 'self'"];
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': cspContents,
      }
    });
  });

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
  } else { // production
    await loadURL(mainWindow);
  }
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => {
    event.sender.send('message', 'hi from electron');
  }, 500);
});

ipcMain.handle('greet', (): string => {
  return 'greet';
})
