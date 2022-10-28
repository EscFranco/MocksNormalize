import ContenedorMongoDB from '../../container/ContMongoDB.js'
import { finalOrder } from '../../models/FinalOrder.js'

let instance 

class OrdersDaoMem extends ContenedorMongoDB {
	constructor() {
		super(finalOrder);
	}

	static getInstance() { 
		if (!instance) {
			instance = new OrdersDaoMem()
		}
		return instance
	}
}

export default OrdersDaoMem;