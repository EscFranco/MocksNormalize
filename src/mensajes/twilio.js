import twilio from 'twilio'
import logger from "../logger/logger.js";

const accounID = 'AC732d959d08213c34806a9f58edd7cc7c'
const token = 'd64f3375042928088e830fa1e267925b';
const client = twilio(accounID,token);

const sendWhatsapp = async (html) => {
    const option = {
        body: html,
        from: 'whatsapp:+14155238886',
        to:'whatsapp:+5491141731077'
    }
    try{
        await client.messages.create(option);
    } catch (error) {
        logger.error(error)
    }
}

const sendSMS = async (html,phone) => {
    const option = {
        body: html,  
        messagingServiceSid: 'MGb3d6eb68c3b2b368aa19396e882fe1b9',      
        to: `+54${phone}`
    }
    try{
       await client.messages.create(option);
    } catch (error) {
        logger.error(error)
    }
}

export { sendWhatsapp, sendSMS }
 