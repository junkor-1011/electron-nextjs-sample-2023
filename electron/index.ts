// Native
import { join } from 'node:path';

// Packages
import { BrowserWindow, app, ipcMain, session, shell } from 'electron';

// Own Libraries
import {
  exampleChannel1,
  exampleChannel2,
  exampleChannel3,
} from './lib/channels';
import { invokeExampleHandler, sendExampleHandler } from './lib/handler';
import { registerExampleEvent } from './lib/events';
import { registerProtocol, protocolInfo } from './lib/custom-protocol';
import { setMenu } from './lib/menu';

// get app version
import {
  version as applicationVersion,
  name as applicationName,
} from '../package.json';

// about panel
app.setAboutPanelOptions({
  applicationName,
  applicationVersion,
  authors: ['junkor-1011'], // EDIT
  copyright: '©2023 junkor-1011', // EDIT
});

/** url of nextjs development server */
const devServerUrl = 'http://localhost:3000';

registerProtocol({
  directory: 'renderer/out',
});

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const cspContents = app.isPackaged
      ? ["default-src 'self' 'unsafe-inline'"]
      : ["default-src 'self' 'unsafe-inline' 'unsafe-eval'"];
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
      devTools: !app.isPackaged,
    },
  });

  if (app.isPackaged) {
    // production
    // await loadURL(mainWindow);
    await mainWindow.loadURL(protocolInfo.origin);
  } else {
    // development
    await mainWindow.loadURL(devServerUrl);
  }

  // set menu
  setMenu();

  const contents = mainWindow.webContents;

  registerExampleEvent({ contents, channel: exampleChannel3 });
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// Open OS browser for external url
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // allow only specific origin
    const allowedOrigins = ['https://nextjs.org', 'https://vercel.com'];

    const { origin } = new URL(url);
    if (allowedOrigins.includes(origin)) {
      setImmediate(() => {
        shell.openExternal(url);
      });
    }
    return { action: 'deny' };
  });

  // disallow unnecessary navigation
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (app.isPackaged) {
      const { protocol, hostname } = parsedUrl;
      if (
        protocol !== protocolInfo.protocol ||
        hostname !== protocolInfo.hostname
      ) {
        event.preventDefault();
      }
    } else {
      const { origin } = parsedUrl;
      const devServerOrigin = new URL(devServerUrl).origin;
      if (origin !== devServerOrigin) {
        event.preventDefault();
      }
    }
  });
});

// example of send from renderer
ipcMain.on(exampleChannel1, sendExampleHandler);

// example of invoke from renderer
ipcMain.handle(exampleChannel2, invokeExampleHandler);
