// ------------- FILESYSTEM ------------- //
import fs from 'fs'
import normalizeData from '../utils/normalize.js';
import util from 'util'

// ------------- CLASS ------------- //

export default class ContMsj {
    constructor(ruta) {
        this.ruta = ruta
    }

    async getAll() {
        try {
            const load = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'))
            const normalize = normalizeData(load)
            return normalize;
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    async newMensaje(msjNuevo) {
        const archivo = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'))
        archivo.mensajes.push ({...msjNuevo})
        await fs.promises.writeFile(this.ruta, JSON.stringify(archivo, null, 2))
    }
}
