import ContenedorMongoDB from '../../container/ContMongoDB.js'
import { finalOrder } from '../../models/FinalOrder.js'

let instance 

class OrdersDaoMongoDb extends ContenedorMongoDB {
	constructor() {
		super(finalOrder);
	}

	static getInstance() { 
		if (!instance) {
			instance = new OrdersDaoMongoDb()
		}
		return instance
	}
}

export default OrdersDaoMongoDb;