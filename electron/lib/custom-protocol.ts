import { stat as _stat } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { app, net, protocol, session } from 'electron';

const stat = promisify(_stat);

/**
 * @see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
 */
const FILE_NOT_FOUND = -6;

export const protocolInfo = {
  scheme: 'mpa',
  protocol: 'mpa:',
  hostname: '-',
  origin: 'mpa://-',
} as const;

const conv2FilePath = (path: string): string => {
  return pathToFileURL(path).toString();
};

const getPath = async (path_: string): Promise<string | null> => {
  try {
    const result = await stat(path_);

    if (result.isFile()) {
      return path_;
    }

    if (result.isDirectory()) {
      return getPath(path.join(path_, 'index.html'));
    }

    return null;
  } catch (_) {
    if (path.extname(path_) === '.html') {
      return null;
    }

    return getPath(`${path_}.html`);
  }
};

export interface RegisterProtocolOptions {
  directory: string;
}

export const registerProtocol = ({
  directory,
}: RegisterProtocolOptions): void => {
  /** entry point dir of renderer */
  const baseDir = path.resolve(directory);

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
        corsEnabled: true,
      },
    },
  ]);

  app.on('ready', () => {
    const session_ = session.defaultSession;

    session_.protocol.handle(protocolInfo.scheme, async (request) => {
      const requestPathname = decodeURIComponent(new URL(request.url).pathname);
      const convertedPathname = path.join(baseDir, requestPathname);
      const resolvedPathname = await getPath(convertedPathname);
      if (resolvedPathname == null) {
        return { error: FILE_NOT_FOUND };
      }
      const fileExtension = path.extname(resolvedPathname);

      if (fileExtension === '.asar') {
        return net.fetch(conv2FilePath(baseIndexPath));
      } else {
        return net.fetch(conv2FilePath(resolvedPathname));
      }
    });
  });
};
