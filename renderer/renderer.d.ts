export interface IElectronAPI {
  hello: () => void;
  greet: () => string;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
