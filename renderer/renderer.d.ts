import type {
  SendExampleHandler,
  InvokeExampleHandler,
} from '@main/lib/handler';
import type {
  AddListenerExample,
  RemoveListenerExample,
} from '@main/lib/events';

export interface IElectronAPI {
  readonly sendExample: SendExampleHandler;
  readonly invokeExample: InvokeExampleHandler;
  readonly addListenerExample: AddListenerExample;
  readonly removeListenerExample: RemoveListenerExample;
}

declare global {
  interface Window {
    readonly electronAPI: IElectronAPI;
  }
}
