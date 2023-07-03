export type ListenerExampleEventArgs = readonly [message: string];

export type AddListenerExample = (
  listener: (
    event: Electron.IpcRendererEvent,
    ...args: ListenerExampleEventArgs
  ) => void
) => void;

export type RemoveListenerExample = () => void;
