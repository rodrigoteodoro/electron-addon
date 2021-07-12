// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const express = require("express")
const fs = require('fs')
const btsqlite = require('better-sqlite3')
const regras = require('./modulos/regras/build/Release/regras.node')

var serversn7
var server
var dbpath = './dados/produtos.db'

if (fs.existsSync(dbpath)) {
    console.log('Banco existe')
} else {
    console.log('Banco não existe')
}

const template = [{
        label: 'Opções',
        submenu: [
            { role: 'quit' }
        ]
    },
    {
        label: 'Servidor',
        submenu: [
            { label: 'Iniciar', click() { iniciarservidor() } },
            { label: 'Parar', click() { pararservidor() } }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getPreco(query) {
    console.log('getPreco ' + query)
    var db = btsqlite(dbpath)
    const row = db.prepare(query).get()
    var retorno = JSON.stringify(row)
    console.log(retorno)
    return row.preco
}

function iniciarservidor() {

    if (serversn7) {
        serversn7.close()
        server = null
    }
    server = express()

    server.get('/preco', function(req, res) {
        console.log('preco')
        res.setHeader('Content-Type', 'text/plain')
        res.status(200)
        var retorno = regras.calcularItemPreco(22, getPreco)
        res.send(retorno.toString())
    })

    serversn7 = server.listen(5000, '0.0.0.0')
    serversn7.on('listening', function() {
        var host = serversn7.address().address
        var port = serversn7.address().port
        console.log("Servidor escutando em http://%s:%s", host, port)
    })
}

function pararservidor() {

    try {
        serversn7.close(() => {
            console.log('Http server closed.');
        });
        serversn7 = null;
        server = null;
        console.log('Servidor parado!');
    } catch (e) {
        console.log(e.message.toString());
    }
}