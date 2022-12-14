// ------------------------- EXPRESS ------------------------- //

import express from 'express'
import path from 'path';
import session from 'express-session';
import passport from './passport/passport.js';
import logger from './logger/logger.js';
import cors from 'cors'

const app = express();

const corsOptions = {
    origin: ['http://localhost:8080', 'https://coderbackend-31020.herokuapp.com/'],
    credentials: true,
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

// ------------------------- YARGS ------------------------- //

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

// ------------------------- MONGODB ------------------------- //

import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import { config } from '../config.js';

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true })
    .then(logger.info(`MongoDB connect ${config.MONGO_URL}`))
    .catch(err => logger.error(err))

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// ------------------------- LOGIN ------------------------- //

import { isAuth, isLogged } from './auth.js'

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        mongoOptions: advancedOptions
    }),

    secret: 'shhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

app.use(passport.initialize());
app.use(passport.session());


app.get('/', isAuth, (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.redirect('/content');
});

app.get('/cart', isAuth, (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public', 'carrito.html'));
});

app.get('/informacion', isAuth, (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public', 'informacion.html'));
});

app.get('/login', isLogged, (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public', 'login.html'));
});

app.get('/register', isLogged, (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public', 'register.html'));
});

app.get('/failRegister', (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public/failRegister.html'));
});

app.get('/failLogin', (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.sendFile(path.resolve('public/failLogin.html'));
});

app.get('/logout', (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    req.session.destroy(err => {
        if (!err) res.redirect('/login')
        else res.send({ status: 'Logout Error', body: err })
    })
});

app.get('/username', (req, res) => {
    const { url, method } = req
    logger.info(`Metodo ${method} a la ruta ${url}`)
    res.json(
        {   usuario: req.user.name,
            direccion: req.user.address,
            phone: req.user.phone,
            email: req.user.email,
        }
    )
});

app.use('/content/*', isAuth);
app.use('/content', isAuth, express.static('public'));

// ------------------------- RUTAS  ------------------------- //

import routerProductos from './routes/routeProductos.js'
import routerAuth from './routes/routeAuth.js'
import routerOrder from './routes/routeOrder.js'

app.use('/api/productos-test', routerProductos)
app.use('/', routerAuth)
app.use('/', routerOrder)

// ------------------------- SOCKET.IO ------------------------- //

import { Server } from 'socket.io';
import http from 'http'
import { ApiMensajesFS } from './api/mensajes.js';
const server = http.createServer(app);
const io = new Server(server);
const chat = new ApiMensajesFS()

io.on('connection', async function (socket) {
    let mensajes = await chat.getAll()
    socket.emit('mensaje', mensajes)

    socket.on('new-message', async function (objeto) {
        await chat.newMensaje(objeto)
        let mensajes = await chat.getAll()
        io.sockets.emit('mensaje', mensajes); //emitir todos los mensajes a todos los clientes
    });
});


// ------------------------- CLUSTER/FORK ------------------------- //

import cluster from 'cluster';
import os from 'os'
const numCPUs = os.cpus().length

const { PORT, MODO } = yargs(hideBin(process.argv))
    .alias({ p: 'PORT', m: 'MODO' })
    .default({ PORT: process.env.PORT || 8080, MODO: 'FORK' }).argv;


if (MODO === 'FORK') {
    const srv = server.listen(PORT, () => {
        logger.info(
            `Servidor Http con Websockets escuchando en el puerto ${srv.address().port
            } -PID WORKER ${process.pid}`
        );
    });
    srv.on('error', (error) => logger.error(`Error en servidor ${error}`));
}

if (MODO === 'CLUSTER') {
    if (cluster.isPrimary) {
        logger.info(`PID MASTER ${process.pid}`)
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }
        cluster.on('exit', worker => {
            logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork()
        })
    } else {
        const srv = server.listen(PORT, () => {
            logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
        })
        srv.on("error", error => logger.error(`Error en servidor ${error}`))

    }
}

