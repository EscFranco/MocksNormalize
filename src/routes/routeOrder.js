import { Router } from "express";
import { isAuth } from "../auth.js";
import orders from "../controllers/orders.js";
// ------------------- ORDEN FINAL ------------------- //

const routerOrder = new Router()

routerOrder.post('/compraFinal', isAuth, orders.orderController );

export default routerOrder;