import { Router } from "express";
import ContenedorMongoDB from "../container/ContProductos.js";


// ------------------- PRODUCTOS ------------------- //

const routerProductos = new Router()
const ApiProductos = new ContenedorMongoDB

routerProductos.get('/', async (req, res) => {
    let answer = await ApiProductos.getAll()
    res.json(answer)
})


export default routerProductos;