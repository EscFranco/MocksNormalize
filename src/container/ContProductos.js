import { Productos } from "../models/Products.js"

class ContenedorMongoDB {
    constructor() {
    }

    async getAll() {
        try {
            const docs = await Productos.find({})
            return docs
        } catch (error) {
            console.log(`Hubo un error : ${error}`)
        }
    } 
}

export default ContenedorMongoDB