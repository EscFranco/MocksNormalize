import { Router } from "express";
import { isAuth } from "../auth.js";
import { finalOrder } from "../models/FinalOrder.js";
import logger from "../logger/logger.js";
import { sendWhatsapp, sendSMS } from "../mensajes/twilio.js";
import { sendEmail } from "../mensajes/mail.js";
// ------------------- ORDEN FINAL ------------------- //

const routerOrder= new Router()

routerOrder.post('/compraFinal', isAuth, async (req, res) => {

    const { body, method, url } = req;
    logger.info( `Peticion a ${method} ${url} recibida`);
    try {
        const result = await finalOrder.collection.insertOne(body);
        const {usuario,carrito} = req.body
        const infoMENSAJE = `Nuevo pedido de ${usuario.usuario} - ${usuario.email}.
        Su pedido es: ${JSON.stringify(carrito)}`
        await sendWhatsapp(infoMENSAJE)
        await sendEmail ('Nuevo pedido', infoMENSAJE)
        sendSMS('Su pedido ya esta en progreso', usuario.phone)
        res.json({
            status: true,
            message: `La orden con el id ${result.insertedId} ha sido completada.`
        });
    } catch (error) {
        logger.error({ message: `error al subir una orden ${error}` });
        res.json({ status: false, message: 'Ocurrio un error.' });
    }
});


export default routerOrder;