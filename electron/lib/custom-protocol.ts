import { stat as _stat } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import electron from 'electron';

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

const getPath = async (path_: string): Promise<string | null> => {
  try {
    const result = await stat(path_);

    if (result.isFile()) {
      return path_
    }

    if (result.isDirectory()) {
      return getPath(path.join(path_, 'index.html'))
    }

    return null
  } catch (_) {
    if (path.extname(path_) === '.html') {
      return null
    }

    return getPath(`${path_}.html`);
  }
}

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

  /** handler of registerFileProtocol */
  const handler: (
    request: Electron.ProtocolRequest,
    callback: (response: Electron.ProtocolResponse) => void
  ) => Promise<void> = async (request, callback) => {
    const requestPathname = decodeURIComponent(new URL(request.url).pathname);
    const convertedPathname = path.join(baseDir, requestPathname);
    const resolvedPathname = await getPath(convertedPathname);
    if (resolvedPathname == null) {
      callback({ error: FILE_NOT_FOUND });
      return;
    }
    const fileExtension = path.extname(resolvedPathname);

    if (fileExtension === '.asar') {
      callback({ path: baseIndexPath })
    } else {
      callback({ path: resolvedPathname })
    }
  };

  electron.protocol.registerSchemesAsPrivileged([
    {
      scheme: protocolInfo.scheme,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    }
  ])

  electron.app.on('ready', () => {
    const session = electron.session.defaultSession;

    session.protocol.registerFileProtocol(protocolInfo.scheme, handler)
  })
};
