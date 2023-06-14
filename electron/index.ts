// Native
import { join } from 'node:path';

// Packages
import { BrowserWindow, app, ipcMain, session, shell } from 'electron';
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
