const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            spellcheck: true // Habilitar la corrección ortográfica
        },
        icon: path.join(__dirname, 'iconoHerramienta.ico'),
    });

    win.loadFile('index.html');

    // Cargar electron-context-menu dinámicamente
    const contextMenu = await import('electron-context-menu');
    contextMenu.default({
        showLookUpSelection: true,
        showSearchWithGoogle: true,
        showCopyImage: true,
        showSaveImageAs: true,
        showInspectElement: false,
        prepend: (defaultActions, params, browserWindow) => [
            {
                label: 'Corregir',
                visible: params.misspelledWord !== '', // Solo mostrar si hay una palabra mal escrita
                click: () => browserWindow.webContents.replaceMisspelling(params.misspelledWord)
            }
        ]
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
