import { Router } from "express";
import { ApiProductosMock } from "../api/productos.js";
import logger from "../logger/logger.js";

// ------------------- PRODUCTOS ------------------- //

const routerProductos = new Router()
const ApiProductos = new ApiProductosMock()

routerProductos.get('/',(req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    try {
        res.json(ApiProductos.popular())
    } catch (error) {
        logger.error(`Hubo un error: ${error}`);
    }
})


export default routerProductos;