import { contextBridge, ipcRenderer } from 'electron';
import { exampleChannel1, exampleChannel2 } from './lib/channels';

contextBridge.exposeInMainWorld('electronAPI', {
  sendExample: (...args: readonly unknown[]): void => {
    ipcRenderer.send(exampleChannel1, ...args);
  },

  invokeExample: async (...args: readonly unknown[]): Promise<unknown> => {
    const res = await ipcRenderer.invoke(exampleChannel2, ...args);
    return res;
  },
});
