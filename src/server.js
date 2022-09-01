// ------------------------- EXPRESS ------------------------- //

import express from 'express'
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
const app = express();

// ------------------------- SOCKET.IO ------------------------- //

import { Server } from 'socket.io';
import http from 'http'
const server = http.createServer(app);
const io = new Server(server);

// ------------------------- MONGODB ------------------------- //

import MongoStore from 'connect-mongo'
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}


// ------------------------- LOGIN ------------------------- //


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://francocoder:dbcoder@cluster0.yaxc0y5.mongodb.net/test',
        mongoOptions: advancedOptions
    }),

    secret : 'shhhh',
    resave : false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

const checkAuth = function (req, res, next) {
    const usuario = req.session.usuario
    if (usuario !== undefined) {
        return next();
    } else {
        res.redirect('/login')
    }
}

const isLogged = function (req, res, next) {
    if (req.session.usuario === undefined) {
        return next();
    } else {
        res.redirect('/')
    }
}

app.get('/login', isLogged, (req, res) => {
    res.sendFile(path.resolve('public', 'login.html'));
});

app.post('/login', (req, res) => {
    req.session.usuario = req.body.username
    res.redirect('/')
});

app.get('/logout', (req, res) => {
    const usuario = req.session.usuario
    req.session.destroy( err => {
        if(!err) res.json(`Hasta luego ${usuario}`)
        else res.send({status: 'Logout Error', body: err})
    })
});

app.get('/username', (req, res) => {
    res.json(`Bienvenido a la pagina ${req.session.usuario}`)
});

app.use(checkAuth)
app.use(express.static("public"));

// ------------------------- RUTAS  ------------------------- //

import routerProductos from './routes/routeProductos.js'

app.use('/api/productos-test', routerProductos)


// ------------------------- SERVER ------------------------- //

import { ApiMensajesFS } from './api/mensajes.js';

const chat = new ApiMensajesFS()

io.on('connection', async function (socket) {
    let mensajes = await chat.getAll()
    socket.emit('mensaje', mensajes)

    socket.on('new-message', async function (objeto) {
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
