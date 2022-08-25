import ContProduct from '../container/ContProduct.js';
import newProducto from '../utils/generarProducto.js';

class ApiProductosMock extends ContProduct {
    constructor() { super() }

    popular( cant = 5 ) {
        const productos = []
        for (let i = 0; i < cant; i++) {
            const nuevoProducto = newProducto()
            const guardado = this.saveProduct(nuevoProducto)
            productos.push(guardado)
        }
        return productos
    }
}

export {ApiProductosMock}