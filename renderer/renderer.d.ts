import type {
  SendExampleHandler,
  InvokeExampleHandler,
} from '@main/lib/handler';

export interface IElectronAPI {
  sendExample: SendExampleHandler;
  invokeExample: InvokeExampleHandler;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
