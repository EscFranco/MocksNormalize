// ------------------------- EXPRESS ------------------------- //

import express from 'express'
const app = express();

// ------------------------- SOCKET.IO ------------------------- //

import { Server } from 'socket.io';
import http from 'http'
const server = http.createServer(app);
const io = new Server(server);


// ------------------------- RUTAS ------------------------- //

import routerProductos from './routes/routeProductos.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use('/api/productos-test', routerProductos)

// ------------------------- SERVER ------------------------- //

import { ApiMensajesFS } from './api/mensajes.js';

const chat = new ApiMensajesFS()

io.on('connection', async function(socket) {
    let mensajes = await chat.getAll()
    socket.emit('mensaje', mensajes)

    socket.on('new-message', async function(objeto) {
        console.log(objeto)
        await chat.newMensaje(objeto)
        let mensajes = await chat.getAll()
        io.sockets.emit('mensaje', mensajes); //emitir todos los mensajes a todos los clientes
    }); 
});

const PORT = process.env.PORT || 8080
const srv = server.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
srv.on("error", error => console.log(`Error en servidor ${error}`))
