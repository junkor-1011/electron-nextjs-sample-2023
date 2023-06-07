import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  hello: () => {
    ipcRenderer.send('message', 'hi from vite');
  },

  greet: async (...args: readonly unknown[]): Promise<unknown> => {
    const res = await ipcRenderer.invoke('greet', ...args);
    return res;
  },
});
