import { type IpcMainEvent, type IpcMainInvokeEvent } from 'electron';

type HandlerWithEvent<
  F extends (...args: never[]) => unknown,
  Event extends IpcMainEvent | IpcMainInvokeEvent,
> = (event: Event, ...args: Parameters<F>) => ReturnType<F>;

export type SendExampleHandler = (message: string) => void;

type SendExampleHandlerWithEvent = HandlerWithEvent<
  SendExampleHandler,
  IpcMainEvent
>;

export const sendExampleHandler: SendExampleHandlerWithEvent = (
  _event,
  message,
) => {
  console.log(message);
};

export type InvokeExampleHandler = (arg: {
  readonly message: string;
}) => Promise<string>;

type InvokeExampleHandlerWithEvent = HandlerWithEvent<
  InvokeExampleHandler,
  IpcMainInvokeEvent
>;

export const invokeExampleHandler: InvokeExampleHandlerWithEvent = async (
  _event,
  { message },
) => {
  console.log(`message from renderer: ${message}`);

  await new Promise((resolve) => setTimeout(resolve, 100)); // sleep 0.1 sec

  const now = new Date();
  const res = `message from main: ${now.toISOString()}`;
  return res;
};
