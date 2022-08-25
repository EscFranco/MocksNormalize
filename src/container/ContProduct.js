export default class ContProduct {
	constructor() {
		this.productos = [];
	}	

	saveProduct(objeto) {
		this.productos.push(objeto)
		return objeto
	}
}