function getPreco(codigo) {
    console.log("retornaPreco " + codigo);
    return 50.25
}

const addon = require('./regras/build/Release/regras.node');
console.time('c++');
console.log(addon.desconto(50, 22, getPreco));
console.timeEnd('c++')