// ------------------------- EXPRESS ------------------------- //

import express from 'express'
import path from 'path';
import session from 'express-session';
import passport from './passport/passport.js';
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ------------------------- YARGS ------------------------- //

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
const { PORT }  = yargs(hideBin(process.argv)).alias({p: 'PORT'}).default({PORT: 8080}).argv;

// ------------------------- SOCKET.IO ------------------------- //

import { Server } from 'socket.io';
import http from 'http'
const server = http.createServer(app);
const io = new Server(server);

// ------------------------- MONGODB ------------------------- //

import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import { config } from '../config.js';

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true })
    .then(console.log(`MongoDB connect ${config.MONGO_URL}`))
    .catch(err => console.log(err))

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// ------------------------- AUTH  ------------------------- //

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isLogged = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/content');
    }
};

// ------------------------- LOGIN ------------------------- //

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
    res.redirect('/content');
});

app.get('/login', isLogged, (req, res) => {
    res.sendFile(path.resolve('public', 'login.html'));
});

app.get('/register', isLogged, (req, res) => {
    res.sendFile(path.resolve('public', 'register.html'));
});

app.get('/failRegister', (req, res) => {
    res.sendFile(path.resolve('public/failRegister.html'));
});

app.get('/failLogin', (req, res) => {
    res.sendFile(path.resolve('public/failLogin.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.redirect('/login')
        else res.send({ status: 'Logout Error', body: err })
    })
});

app.get('/username', (req, res) => {
    res.json(`Bienvenido a la pagina ${req.session.passport.user}`)
});

app.use('/content/*', isAuth);
app.use('/content', express.static('public'));

// ------------------------- RUTAS  ------------------------- //

import routerProductos from './routes/routeProductos.js'
import routerAuth from './routes/routeAuth.js'
import routerNumeros from './routes/routeNumeros.js'

app.use('/api/productos-test', routerProductos)
app.use('/api/randoms', routerNumeros)
app.use('/', routerAuth)

// ------------------------- PROCESS  ------------------------- //

app.get('/info', (req, res) => {

    res.json({
        Argumentos: process.argv.slice(2),
        Sistema: process.platform,
        NodeVersion : process.version,
        MemoriaReservada : process.memoryUsage().rss,
        ExecPath : process.execPath,
        ProcessID : process.pid,
        ProyectFolder : process.cwd()
    })
});

// ------------------------- CHAT ------------------------- //

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

// ------------------------- SERVER ------------------------- //

const srv = server.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
srv.on("error", error => console.log(`Error en servidor ${error}`))
