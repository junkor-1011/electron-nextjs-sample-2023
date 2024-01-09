import type {
  AddListenerExample,
  RemoveListenerExample,
} from '@main/lib/events';
import type {
  InvokeExampleHandler,
  SendExampleHandler,
} from '@main/lib/handler';

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
