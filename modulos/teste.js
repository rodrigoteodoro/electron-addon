function gui_consulta(query) {
    console.log("retornaPreco " + query);
    return 50.25
}

function gui_log(texto) {
    console.log(texto);
}

const addon = require('./regras/build/Release/regras.node');
console.time('c++');

//Teste de callback
console.log(addon.calcularItemPreco(1, gui_consulta));

//Teste de passagem de objetos como parâmetro

var pedido = {
    valor: 0.0,
    item: [
        { codigo: 1, preco: 209.28, quantidade: 1 },
        { codigo: 22, preco: 530.44, quantidade: 2 }
    ]
}
var valorTotal = addon.calcularTotalPedido(pedido, gui_log)
console.log("valorTotal: " + valorTotal)

console.timeEnd('c++')