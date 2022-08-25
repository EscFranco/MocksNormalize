import { Router } from "express";
import { ApiProductosMock } from "../api/productos.js";

// ------------------- PRODUCTOS ------------------- //

const routerProductos = new Router()
const ApiProductos = new ApiProductosMock()

routerProductos.get('/',(req, res) => {
    try {
        res.json(ApiProductos.popular())
    } catch (error) {
        console.log(`Hubo un error: ${error}`);
    }
})


export default routerProductos;