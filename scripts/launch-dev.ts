import util from 'node:util';
import childProcess from 'node:child_process';

const exec = util.promisify(childProcess.exec);

function main() {
  exec('pnpm dev:renderer')
    .then((res) => { console.log(res) })
    .catch((error) => { console.error(error) });
  exec('pnpm dev:electron')
    .then((res) => { console.log(res) })
    .catch((error) => { console.error(error) });
}

main()
