import logger from "../logger/logger.js";
import products from "../negocio/products.js";

const getProductsController = async (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.json(await products.getProductos())
	
}

export default { getProductsController }