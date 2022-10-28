import OrdersDaoMongoDb from "../persistencia/daos/orders/OrdersDaoMongoDB.js";
import { sendWhatsapp, sendSMS } from "../mensajes/twilio.js";
import { sendEmail } from "../mensajes/mail.js";
import logger from "../logger/logger.js";
import OrdersDaoFactory from "../persistencia/daos/Orders/OrdersDaoFactory.js";

const orderAPI = OrdersDaoFactory.getDao()

const submitOrder = async (body) => {
    try {
        const result = await orderAPI.saveOne(body);
        const {usuario,carrito} = body
        const infoMENSAJE = `Nuevo pedido de ${usuario.usuario} - ${usuario.email}.
        Su pedido es: ${JSON.stringify(carrito)}`
        // await sendWhatsapp(infoMENSAJE)
        await sendEmail ('Nuevo pedido', infoMENSAJE)
        // sendSMS('Su pedido ya esta en progreso', usuario.phone)
        return {
            status: true,
            message: `La orden con el id ${result.insertedId} ha sido completada.`
        };
    } catch (error) {
        logger.error({ message: `error al subir una orden ${error}` });
        return{ status: false, message: 'Ocurrio un error.' };
    }
}

export default { submitOrder }