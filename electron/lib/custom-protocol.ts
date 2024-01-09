import { statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { net, app, protocol, session } from 'electron';

export const protocolInfo = {
  scheme: 'mpa',
  protocol: 'mpa:',
  hostname: '-',
  origin: 'mpa://-',
} as const;

const conv2FilePath = (path: string): string => {
  return pathToFileURL(path).toString();
};

const getPath = (path_: string): string => {
  try {
    const result = statSync(path_);

    if (result.isFile()) {
      return path_;
    }

    if (result.isDirectory()) {
      return getPath(path.join(path_, 'index.html'));
    }

    throw new Error();
  } catch (_) {
    if (path.extname(path_) === '') {
      // if path do not have extention, add '.html'
      return getPath(`${path_}.html`);
    }

    // net.fetch(path_) will throw 404
    return path_;
  }
};

export interface RegisterProtocolOptions {
  directory: string;
}

export const registerProtocol = ({
  directory,
}: RegisterProtocolOptions): void => {
  /** entry point dir of renderer */
  const baseDir = path.resolve(app.getAppPath(), directory);

  /** path of entry point index.html at renderer */
  const baseIndexPath = path.join(baseDir, 'index.html');

  protocol.registerSchemesAsPrivileged([
    {
      scheme: protocolInfo.scheme,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: false,
      },
    },
  ]);

  app.on('ready', () => {
    const session_ = session.defaultSession;

    session_.protocol.handle(protocolInfo.scheme, (request) => {
      const requestPathname = decodeURIComponent(new URL(request.url).pathname);
      const convertedPathname = path.join(baseDir, requestPathname);
      const resolvedPathname = getPath(convertedPathname);
      const fileExtension = path.extname(resolvedPathname);

      if (fileExtension === '.asar') {
        return net.fetch(conv2FilePath(baseIndexPath));
      }
      return net.fetch(conv2FilePath(resolvedPathname));
    });
  });
};
