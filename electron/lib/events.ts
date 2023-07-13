export type ListenerExampleEventArgs = readonly [message: string];

export type AddListenerExample = (
  listener: (
    event: Electron.IpcRendererEvent,
    ...args: ListenerExampleEventArgs
  ) => void,
) => void;

export type RemoveListenerExample = () => void;

export const registerExampleEvent = ({
  channel,
  contents,
}: {
  channel: string;
  contents: Electron.WebContents;
}) => {
  // send to renderer example
  setInterval(() => {
    const now = new Date();
    const args: ListenerExampleEventArgs = [
      `message from main: it is ${now.toISOString()}`,
    ];
    contents.send(channel, ...args);
  }, 10 * 1000);
};
