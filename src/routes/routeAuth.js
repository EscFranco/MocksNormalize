import { Router } from "express";
import passport from "passport";

const routerAuth = new Router()

routerAuth.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/' }))

routerAuth.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister', successRedirect: '/login' }))

export default routerAuth