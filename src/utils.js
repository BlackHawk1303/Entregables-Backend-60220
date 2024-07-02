import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
//import { title } from 'process'
import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname
export const KEY = 'M3g4.1370'
export const tokenGenerator = (user) => { return jwt.sign({ user }, KEY, { expiresIn: '365d' }) } //48h 
export const authToken = (req, res, next) => {


//Con Token
    const header = req.headers.authorization
    if (!header) return res.status(401).send({ error: 'No estás Autorizado para estar Aquí. Por favor, Vuelve a Autenticarte.' })

    const token = header.split(' ')[1]
    jwt.verify(token, KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "El Token no es Válido. Por favor, Vuelve a Autenticarte." })
        req.user = credentials.user
        next()
    })
}
//Con Token

//Sin Token
//     const header = req.headers.authorization
//     console.log(header)
//     if (!header) {
//         return res.status(401).send({error: 'No estás Autorizado para estar Aquí. Por favor, Vuelve a Autenticarte.' })
//     }
//     const token = header.split(' ')[1];
//     jwt.verify(token, KEY, (error, credentials) => {
//         if (error) {
//             return res.status(403).send({ error: 'El Token no es Válido. Por favor, Vuelve a Autenticarte.' })
//         }
//         req.user = credentials.user
//         next()
//     })
// }
//Sin Token

export const passCall = (strategy) => {
    return async (req, res, next) => {
        console.log(strategy)
        passport.authenticate(strategy, (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("user not found in JWT")

        let valid = false

        for (let i = 0; i < role.length; i++) {
            if (req.user.role === role[i]) valid = true
        }

        if (valid) return next()
        else return res.status(403).send("No tienes permisos para ver este contenido")       
    }
}

//Middleware Actual

export const check = (role) => {
    return async (req, res, next) => {
        if (!req.user || !req.user[0]) {
            return res.status(401).send("Su Sesión Cerró, Por Favor Vuelva a Logearse.");
        }
        if (req.user[0].role !== role) {
            return res.status(403).send("No estás Autorizado para Ver este Contenido.");
        }
        next();
    }
}


export const generaterProduct = () =>{
return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()), 
    stock: faker.number.int({ min: 0, max: 500 }), 
    category: faker.commerce.department(),
    thumbanail: `Imagen/${faker.number.int({ max: 500 })}`, 
    status: true,
    code: uuid()
}
}

//NEW
export const formattedMonth = (date) => {
    return (date.getMonth() + 1).toString().padStart(2, '0');
}

export const formattedHours = (date) => {
    const hours = date.getHours() + 1
    return hours < 10 ? '0' + hours : hours.toString();
}

export const formattedDay = (date) => {
    const day = date.getDate()
    return day < 10 ? '0' + day : day.toString();
}
//NEW
export const HTTP_STATUS = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
}