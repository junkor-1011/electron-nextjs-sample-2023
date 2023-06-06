import { spawn } from 'node:child_process';

function main() {
  // renderer
  const rendererProc = spawn('pnpm', ['dev:renderer']);
  console.log('renderer: ', rendererProc.pid);
  rendererProc.stdout.on('data', (data) => {
    console.log(data.toString());
  })
  rendererProc.stderr.on('data', (data) => {
    console.log(data.toString());
  })

  // electron main
  const mainProc = spawn('pnpm', ['dev:electron']);
  console.log('main: ', mainProc.pid);
  mainProc.stdout.on('data', (data) => {
    console.log(data.toString());
  })
  mainProc.stderr.on('data', (data) => {
    console.log(data.toString());
  })
}

main()
