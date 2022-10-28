import { Router } from "express";
import products from "../controllers/products.js";

// ------------------- PRODUCTOS ------------------- //

const routerProductos = new Router()

routerProductos.get('/', products.getProductsController)


export default routerProductos;