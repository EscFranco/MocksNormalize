import ContenedorMongoDB from '../../container/ContMongoDB.js'
import { Productos } from '../../models/Products.js'

let instance

class ProductsDaoMem extends ContenedorMongoDB {
    constructor() {
        super(Productos)
    }

    static getInstance() { 
		if (!instance) {
			instance = new ProductsDaoMem()
		}
		return instance
	}
}

export default ProductsDaoMem