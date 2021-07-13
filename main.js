// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const express = require("express")
const fs = require('fs')
const btsqlite = require('better-sqlite3')
const isDev = require('electron-is-dev')
var fw = require('firewall')
const osmod = require('os')

var serversn7
var server

var dbpath = null

if (isDev) {
    dbpath = './dados/produtos.db'
} else {
    dbpath = path.join(path.dirname(process.resourcesPath), 'dados/produtos.db')
}

//Firewall - https://www.npmjs.com/package/firewall
var pgPath = path.join(path.dirname(process.resourcesPath), 'ElectronAddon.exe')
console.log("PgPath: " + pgPath)
var opts = { bin: pgPath, desc: 'Electron Addon' }
fw.add_rule(opts, function(err, out) {
    if (!err) console.log('Successfully added.');
})


//regras
console.log("SO Arch: " + osmod.arch())

var pathRegras = null
var pathRegrasAtu = null
if (isDev) {
    pathRegras = './public/regras' + osmod.arch() + '.node'
    pathRegrasAtu = './public/regras' + osmod.arch() + '.node2'
} else {
    pathRegras = path.join(path.dirname(process.resourcesPath), 'public/regras' + osmod.arch() + '.node')
    pathRegrasAtu = path.join(path.dirname(process.resourcesPath), 'public/regras' + osmod.arch() + '.node2')
}
console.log("Regras: " + pathRegras)


//verificar se tem atualizacao das regras
if (fs.existsSync(pathRegrasAtu)) {
    console.log('Nova atalizacao das regras' + pathRegrasAtu)
    try {
        fs.unlinkSync(pathRegras)
        fs.rename(pathRegrasAtu, pathRegras, function(err) {
            if (err) console.log('ERROR: ' + err)
        })
    } catch (e) {
        console.log(e.message.toString());
    }
} else {
    console.log('Nenhum atualizacao de regras disponivel')
}
var regras = null
setTimeout(function() {
    regras = require(pathRegras)
    console.log('Regras carregadas!')
}, 3000)

if (fs.existsSync(dbpath)) {
    console.log('Banco existe')
} else {
    console.log('Banco não existe')
}

const template = [{
        label: 'Opções',
        submenu: [
            { label: 'Reiniciar', click() { reiniciarApp() } },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'Servidor',
        submenu: [
            { label: 'Iniciar', click() { iniciarservidor() } },
            { label: 'Parar', click() { pararservidor() } }
        ]
    },
    {
        label: 'Regras',
        submenu: [
            { label: 'Atualizar', click() { atualizarRegras() } }
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

    server.get('/teste', function(req, res) {
        console.log('teste')
        try {
            res.setHeader('Content-Type', 'text/plain')
            res.status(200)
            res.send("Teste")
        } catch (e) {
            console.log(e.message.toString());
            res.setHeader('Content-Type', 'text/plain')
            res.status(500)
            res.send(e.message.toString())
        }
    })

    server.get('/preco', function(req, res) {
        console.log('preco')
        try {
            res.setHeader('Content-Type', 'text/plain')
            res.status(200)
            var retorno = regras.calcularItemPreco(22, getPreco)
            res.send(retorno.toString())
        } catch (e) {
            console.log(e.message.toString());
            res.setHeader('Content-Type', 'text/plain')
            res.status(500)
            res.send(e.message.toString())
        }
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
            console.log('Http server closed.')
        });
        serversn7 = null
        server = null
        console.log('Servidor parado!')
    } catch (e) {
        console.log(e.message.toString())
    }
}

function reiniciarApp() {

    try {
        pararservidor()
        app.relaunch()
        app.exit(0)
    } catch (e) {
        console.log(e.message.toString())
    }
}

function atualizarRegras() {

    try {
        if (fs.existsSync(pathRegrasAtu)) {
            console.log('Atalizacao das regras' + pathRegrasAtu)
            reiniciarApp()
        } else {
            console.log('Nenhum atualizacao de regras disponivel')
        }
    } catch (e) {
        console.log(e.message.toString());
    }

}