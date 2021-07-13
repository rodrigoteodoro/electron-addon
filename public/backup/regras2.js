module.exports = {
    calcularItemPreco(codigo, gui_consulta) {
        valor = 0.0
        var query = `SELECT pf0 as preco FROM produto WHERE id=${codigo}`;
        var valor = gui_consulta(query);
        return valor - 100

    },
    calcularTotalPedido(pedido) {
        valor = 0.0
        for (var i in pedido.item) {
            console.log(pedido.item[i].quantidade)
            valor += pedido.item[i].quantidade * pedido.item[i].preco
        }
        return valor
    }
}