import { normalize, denormalize, schema } from "normalizr";


const author = new schema.Entity('authors', {}, {idAttribute: 'id'});

const mensaje = new schema.Entity('mensaje', {
    author: author
}, {idAttribute: 'hora'})

const mensajes = new schema.Entity('mensajes', {
    mensajes: [mensaje]
}, {idAttribute: 'id'})

const normalizeData = (data) => {
    return normalize(data, mensajes);
} 

export default normalizeData