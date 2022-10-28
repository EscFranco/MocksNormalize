import ProductsDaoFactory from "../daos/Products/ProductsDaoFactory.js";

export default class ProductsRepo {
    dao
    constructor() {
        this.dao = ProductsDaoFactory.getDao()
    }

    async getAll() {
        const products = await this.dao.getAll()
        return products
    }
}