import { Menu, type MenuItemConstructorOptions } from 'electron';

const isMac = process.platform === 'darwin';

const template: MenuItemConstructorOptions[] = [
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  { role: 'help', submenu: [{ role: 'about' }] },
];

if (isMac) template.unshift({ role: 'appMenu' });

const menu = Menu.buildFromTemplate(template);

export const setMenu = (): void => {
  Menu.setApplicationMenu(menu);
};
