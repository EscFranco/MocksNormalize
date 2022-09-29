import winston from "winston"
import { format } from 'winston';
const LEVEL = Symbol.for('level');

const filterOnly = (level) => {
    return format( (info) => {
        if (info[LEVEL] === level) {
            return info;
        }
    })();
};

const buildProdLogger = () => {

    const prodLogger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: 'debug.log', level: 'debug'
            }),
            new winston.transports.File({
                filename: 'error.log', level: 'error'
            })
        ]
    })
    return prodLogger
}


const buildDevLogger = () => {

    const devLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'info'
            }),
            new winston.transports.File({
                filename: 'warn.log', level: 'warn',  format: filterOnly('warn'),
            }),
            new winston.transports.File({
                filename: 'error.log', level: 'error'
            })
        ]
    })
    return devLogger
}

let logger = null

if (process.env.NODE_ENV === 'PROD') {
    logger = buildProdLogger()
} else {
    logger = buildDevLogger()
}

export default logger


