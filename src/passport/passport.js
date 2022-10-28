// ------------------------- PASSPORT ------------------------- //

import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { User } from '../persistencia/models/Users.js';
import bcrypt from 'bcryptjs'
import { sendEmail } from '../mensajes/mail.js'

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    User.findOne({ email: email }, function (err, user) {
        done(err, user)
    });
});

passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, (req, email, password, done) => {
    const name = req.body.name
    const address = req.body.address
    const age = req.body.age
    const phone = req.body.phone
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const newUser = new User({ email, password, name, address, age, phone });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.log(err);
                        newUser.password = hash;
                        newUser.save()
                            .then((user) => {
                                sendEmail(
                                    'Nuevo Registro',
                                    `
                                    <p><b>Datos de nuevo usuario:</b></p>
                                    <h3>${name} [${age}]</h3>
                                    <p>Email: ${email}</p>
                                    <p>Dirección: ${address}</p>
                                    <p>Teléfono: ${phone}</p>
                                   `
                                )
                                return done(null, user);
                            })
                            .catch((err) => {
                                return done(null, false, { message: err });
                            });
                    });
                });
            } else {
                return done(null, false, { message: 'El usuario ya existe' })
            }
        })
        .catch((err) => {
            return done(null, false, { message: err });
        });
}
)
);

passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, (req, email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "El usuario no existe" })
                } else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Wrong password" })
                        }
                    })
                }
            })
            .catch(err => { return done(null, false, { message: err }) })
    }
)
)

export default passport;