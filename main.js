const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'ZKTeco SpeedGate CAD',
    backgroundColor: '#1a2a3a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow localStorage (needed for auto-save)
      partition: 'persist:zkteco-cad'
    }
  });

  win.loadFile('zkteco_v35_optimized.html');

  // Open external links in system browser, not in the app
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove default menu bar (keeps F12 devtools via keyboard)
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
