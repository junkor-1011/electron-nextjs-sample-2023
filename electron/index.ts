// Native
import { join } from 'node:path';

// Packages
import { BrowserWindow, app, ipcMain, session, shell } from 'electron';
import serve from 'electron-serve';

// Own Libraries
import { exampleChannel1, exampleChannel2 } from './lib/channels';
import { invokeExampleHandler, sendExampleHandler } from './lib/handler';

/** url of vite development server */
const devServerUrl = 'http://localhost:5173';

/** loading 'app://-/' for Single Page App. */
const loadURL = serve({
  directory: 'renderer/dist',
});

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const cspContents = app.isPackaged
      ? ["default-src 'self'"]
      : ["default-src 'self' 'unsafe-inline'"];
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

  if (app.isPackaged) {
    // production
    await loadURL(mainWindow);
  } else {
    // development
    await mainWindow.loadURL(devServerUrl);
  }
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// Open OS browser for external url
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // allow only specific urls
    if (url === 'https://vitejs.dev/' || url === 'https://react.dev/') {
      setImmediate(() => {
        shell.openExternal(url);
      });
    }
    return { action: 'deny' };
  });

  // disallow unnecessary navigation
  contents.on('will-navigate', (event, _navigationUrl) => {
    event.preventDefault();
  });
});

// example of send from renderer
ipcMain.on(exampleChannel1, sendExampleHandler);

// example of invoke from renderer
ipcMain.handle(exampleChannel2, invokeExampleHandler);
