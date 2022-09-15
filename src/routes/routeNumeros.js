import { Router } from "express";
import { fork } from 'child_process'
import path from "path";

const routerNumeros = new Router()

routerNumeros.get('/',(req, res) => {
    const {cant = 100000000 } = req.query
    const forked = fork(path.resolve('src/randomNumber.js'))

    forked.on('message', (msg) => {
        if (msg == 'OK') {
            forked.send(cant)
        } else {
            res.json(msg)
        }
    })

})

export default routerNumeros;