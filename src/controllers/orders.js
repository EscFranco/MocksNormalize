import logger from "../logger/logger.js";
import orders from "../negocio/orders.js";

const orderController = async (req, res) => {
        const { body, method, url } = req;
        logger.info(`Peticion a ${method} ${url} recibida`);
        res.json (await orders.submitOrder(body))
    }

export default { orderController }