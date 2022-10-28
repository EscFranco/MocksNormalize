import ContenedorMongoDB from '../../container/ContMongoDB.js'
import { Productos } from '../../models/Products.js'

let instance

class ProductsDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super(Productos)
    }

    static getInstance() { 
		if (!instance) {
			instance = new ProductsDaoMongoDB()
		}
		return instance
	}
}

export default ProductsDaoMongoDB