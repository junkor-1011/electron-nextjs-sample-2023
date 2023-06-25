# electron-nextjs-sample-2023

Example or boilerplate of [electron](https://www.electronjs.org/) app project.

using:

- package-build: [electron-builder](https://github.com/electron-userland/electron-builder)
    - cross platform build(Linux, Windows)
- renderer: [nextjs](https://nextjs.org/)
    - [App Router](https://nextjs.org/docs/app)
    - (static multi-page application)
- node package manager: [pnpm](https://pnpm.io/)
    - keep each [workspace](https://pnpm.io/workspaces) loose coupling & clean by minimizing packages hoisting

## usage

### Requirements

- Linux(development environment)
- Node.js(v18.x)
    - package manager: pnpm (v8.6.x or later)
- Docker & docker-compose (building for Windows)

### CLI

development:

```bash
# use localhost:3000
pnpm dev

# to stop, Ctrl + C
```

build app-package:

```bash
# build package dir: dist/

# for Linux
pnpm dist

# for Windows(using docker container)
pnpm dist:win
```
