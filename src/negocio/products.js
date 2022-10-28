import ProductsDaoMongoDB from "../persistencia/daos/Products/ProductsDaoMongoDB.js";
import ProductsRepo from "../persistencia/repository/ProductsRepo.js";

const productApi = new ProductsRepo()

const getProductos = async() => { 
    return productApi.getAll()
}

export default { getProductos }