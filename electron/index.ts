// Native
import { join } from 'node:path';

// Packages
import {
  BrowserWindow,
  app,
  ipcMain,
  session,
  type IpcMainEvent,
} from 'electron';
import serve from 'electron-serve';
import isDev from 'electron-is-dev';

// Own Libraries
import { exampleChannel1, exampleChannel2 } from './lib/channels';
import { invokeExampleHandler, sendExampleHandler } from './lib/handler';

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
      },
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
  } else {
    // production
    await loadURL(mainWindow);
  }
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// example of send from renderer
ipcMain.on(exampleChannel1, sendExampleHandler);

// example of invoke from renderer
ipcMain.handle(exampleChannel2, invokeExampleHandler);
