import ContMsj from '../persistencia/container/ContMsj.js';

class ApiMensajesFS extends ContMsj {
    constructor() {
        super('./src/mensajes/mensajes.json')
    }
}


export { ApiMensajesFS }