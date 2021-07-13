const regrasJS = require('./public/regras.js')

var pedido = {
    valor: 0.0,
    item: [
        { codigo: 1, preco: 209.28, quantidade: 1 },
        { codigo: 22, preco: 530.44, quantidade: 2 }
    ]
}

var valor = regrasJS.calcularTotalPedido(pedido)
console.log(valor)