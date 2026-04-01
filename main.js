const { app, BrowserWindow, Menu, shell, dialog, session } = require('electron');
const path = require('path');
const os = require('os');

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

  // Handle file downloads (saveProject, exportPDF, exportPage)
  win.webContents.session.on('will-download', (event, item) => {
    const filename = item.getFilename();
    const ext = path.extname(filename).slice(1).toLowerCase() || '*';
    const filterName = ext === 'pdf' ? 'PDF' : ext === 'json' ? 'JSON' : ext === 'svg' ? 'SVG' : ext === 'png' ? 'PNG' : 'Archivo';
    const savePath = dialog.showSaveDialogSync(win, {
      defaultPath: path.join(os.homedir(), filename),
      filters: [{ name: filterName, extensions: [ext] }, { name: 'Todos los archivos', extensions: ['*'] }]
    });
    if (savePath) {
      item.setSavePath(savePath);
    } else {
      item.cancel();
    }
  });
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
