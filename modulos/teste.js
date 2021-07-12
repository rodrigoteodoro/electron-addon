function gui_consulta(query) {
    console.log("retornaPreco " + query);
    return 50.25
}

const addon = require('./regras/build/Release/regras.node');
console.time('c++');
console.log(addon.calcularItemPreco(1, gui_consulta));
console.timeEnd('c++')