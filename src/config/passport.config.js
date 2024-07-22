import passport from 'passport'
import passportLocal from 'passport-local'
import userProvider from '../services/user.services.js'
import cartProvider from '../services/cartManager.services.js'
import { passwordHash, validpass, KEY } from '../utils.js'
import passportGithub from 'passport-github2'
import jwtStrategy from 'passport-jwt'
import config from './env/config.js'
import { hostname } from "../utils.js"
import CustomError from '../services/errors/customError.js'
import { createUserError } from '../services/errors/messages/user.errors.js'

const userManager = new userProvider()
const cartManager = new cartProvider()
const localStrategy = passportLocal.Strategy
const JWTStrategy = jwtStrategy.Strategy
const jwtExtract = jwtStrategy.ExtractJwt

const call = `${hostname.protocol}://${hostname.host}/user/githubCallback`

const initPassport = () => {

    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: jwtExtract.fromExtractors([getCookie]),
            secretOrKey: KEY
        },
        async (jwtPayload, done) => {
            try {
                return (done(null, jwtPayload.user))
            }
            catch (e) {
                return (e)
            }
        }
    ))

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                const existingUser = await userManager.findUser({ email });
                if (existingUser) {
                    return done(null, false);
                }          
                if (!first_name || !last_name || !email || !age || !password) {
                    CustomError.createError({
                        name: "UserCreationError",
                        cause: createUserError({ first_name, last_name, email, age, password }),
                        message: "Error al Crear Usuario: Faltan Uno o Más Campos Obligatorios"
                    })
                    return done(null, false)
                }
                const cart_id = await cartManager.createCart()
                
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: passwordHash(password),
                    loggedMethod: "local",
                    cart: cart_id._id
                };
                const result = await userManager.createUser(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al Registrar: " + error);
            }
        }
    ));

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const user = await userManager.findUser({ email });
                

                if (!validpass(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userManager.findUser({ "_id": id })
            done(null, user);
        } catch (error) {
            console.error("Error Deserializando Usuario: " + error)
            done(error);
        }
    });

    passport.use('github', new passportGithub(
        {
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: call
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await userManager.findUser({ email: profile._json.email })

                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: ' ',
                    loggedMethod: "github"
                };
                //Le coloqué un espacio en la contraseña por qué si lo dejo sin ese espacio Mongo solicita data, "Algo"
                
                const result = await userManager.createUser(newUser)
                return done(null, result)
            } catch (error) {
                console.error(error)
                return done(error)
            }
        }
    ))
}
const getCookie = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken']
    }
    return token
}

export default initPassport;