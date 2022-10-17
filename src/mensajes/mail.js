import { createTransport } from 'nodemailer';
import logger from "../logger/logger.js";

const sendEmail = async (subject, html) => {
    const trasporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'edgardo20@ethereal.email',
            pass: '115DD22BS8KvGCK31t'
        }
    })

    const mailOptions = {
        from: "Servidor Node",
        to: "edgardo20@ethereal.email",
        subject: subject,
        html: html
    }

    try {
        await trasporter.sendMail(mailOptions)
    } catch (error) {
        logger.error(error)
    }
}

export {
    sendEmail
}