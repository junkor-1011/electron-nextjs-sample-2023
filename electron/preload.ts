import { contextBridge, ipcRenderer } from 'electron';
import {
  exampleChannel1,
  exampleChannel2,
  exampleChannel3,
} from './lib/channels';

contextBridge.exposeInMainWorld('electronAPI', {
  sendExample: (...args: readonly unknown[]): void => {
    ipcRenderer.send(exampleChannel1, ...args);
  },

  invokeExample: async (...args: readonly unknown[]): Promise<unknown> => {
    const res: unknown = await ipcRenderer.invoke(exampleChannel2, ...args);
    return res;
  },

  addListenerExample: (
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: readonly unknown[]
    ) => void,
  ): void => {
    ipcRenderer.on(exampleChannel3, listener);
  },

  removeListenerExample: (..._args: readonly unknown[]): void => {
    ipcRenderer.removeAllListeners(exampleChannel3);
  },
});
