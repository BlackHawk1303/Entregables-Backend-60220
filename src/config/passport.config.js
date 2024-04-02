import passport from 'passport';
import passportLocal from 'passport-local';
import userProvider from '../dao/db/user.services.js';
import { passwordHash, validpass } from '../utils.js';
import passportGithub from 'passport-github2';

const userManager = new userProvider();
const localStrategy = passportLocal.Strategy;

const initPassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                const existingUser = await userManager.findUser({ email });
                if (existingUser) {
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: passwordHash(password),
                    loggedMethod: "local"
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
                console.log(user.password);
                console.log(password) 
                            
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
            const user = await userManager.findUser({ "_id": id });
            done(null, user);
        } catch (error) {
            console.error("Error Deserializando Usuario: " + error);
            done(error);
        }
    });

    passport.use('github', new passportGithub(
        {
            clientID: 'Iv1.9600655083dc693a',
            clientSecret: 'a51d04f0a363b67ae8939e7e3b6fc667b7aeae4c',
            callbackURL: 'http://localhost:8080/user/githubCallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await userManager.findUser({ email: profile._json.email });                    

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
                //Le coloqué un espacio en la contraseña por qué si lo dejo sin ese espacio Mongo solicita data, "algo"

                console.log(newUser)
                const result = await userManager.createUser(newUser);
                return done(null, result);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    ));
};

export default initPassport;