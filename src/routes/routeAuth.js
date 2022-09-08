import { Router } from "express";
import passport from "passport";
import path from 'path';

const routerAuth = new Router()

routerAuth.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/' }))

routerAuth.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister', successRedirect: '/login' }))

export default routerAuth