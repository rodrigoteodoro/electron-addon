# Modulos

* Instalar o node-gyp
    npm install -g node-gyp

* Compilar o addon
    node-gyp.cmd configure build
    Para electron
    node-gyp.cmd configure build --target=13.1.4 --arch=x64 --dist-url=https://electronjs.org/headers

* Referências

- https://www.youtube.com/watch?v=VPhPOEpZ3cI
- https://nodejs.org/dist/latest-v14.x/docs/api/addons.html
- https://github.com/nodejs/node-addon-api/issues/520
- https://github.com/nodejs/node-addon-examples
- https://nodeaddons.com/
- https://github.com/freezer333/nodecpp-demo/tree/master/quickstart
- https://stackoverflow.com/questions/48113427/convert-stdstring-to-v8string-and-viceversa

C++ Addons as AWS Lambda functions
- https://nodeaddons.com/c-addons-as-aws-lambda-functions/
- https://nodejs.medium.com/building-modern-native-add-ons-for-node-js-in-2020-cd3992c68e0

```
App threw an error during load
Error: The module '\\?\D:\Rodrigo\Desenvolvimento\Electron\electron-quick-start\modulos\regras.node'
was compiled against a different Node.js version using
Electron - Usando Módulos Nativos do Node
https://www.electronjs.org/docs/tutorial/using-native-node-modules
Módulos Node,js nativos são suportados pelo Electron. 
```

# Versão do Electron.
```
set npm_config_target=13.1.4
set npm_config_arch=x64
set npm_config_target_arch=x64
set npm_config_disturl=https://electronjs.org/headers 
set npm_config_runtime=electron 
set npm_config_build_from_source=true
HOME=~/.electron-gyp npm install

https://pspdfkit.com/blog/2018/running-native-code-in-electron-and-the-case-for-webassembly/
node-gyp.cmd configure rebuild --target=13.1.4 --arch=x64 --dist-url=https://electronjs.org/headers
```

