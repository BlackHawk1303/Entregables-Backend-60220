import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
//import { title } from 'process'
import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'

import multer from "multer"
import fs from "fs"
import path from "path"

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

//Un Archivo
const determinarRutaDeCarga = (mimetype, userId) => {
    let rutaDirectorio = ''
    let tipoArchivo = ''

    switch (mimetype) {
        case "image/png":
            rutaDirectorio = path.join(__dirname, `/upload/profiles/${userId}/`)
            tipoArchivo = 'profile'
            break
        case "application/pdf":
            rutaDirectorio = path.join(__dirname, `/upload/documents/${userId}/`)
            tipoArchivo = 'documents'
            break
        case "image/jpg":
            rutaDirectorio = path.join(__dirname, `/upload/products/${userId}/`)
            tipoArchivo = 'image'
            break
    }
    return { rutaDirectorio, tipoArchivo }
}

//Config Almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { _id: userId } = req.params

        const { rutaDirectorio, tipoArchivo } = determinarRutaDeCarga(file.mimetype, userId)

        if (rutaDirectorio) {
            if (!fs.existsSync(rutaDirectorio)) {
                fs.mkdirSync(rutaDirectorio, { recursive: true })
            }
            req.rutaDirectorio = rutaDirectorio
            req.tipoArchivo = tipoArchivo
            cb(null, rutaDirectorio)
        } 

        else
        {
            cb(new Error("Tipo de Archivo no Válido. Solo se Aceptan Archivos .PDF, .JPG y .PNG"))
        }
        // else {
        //     // cb(new Error("Tipo de Archivo no Válido. Solo se Aceptan Archivos .PDF, .JPG y .PNG"))
        //     cb(null, false)
        // }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({
    storage,
    onError: (err, next) => {
        console.error(err)
        next(err)
    }
})

//Config Almacenamiento Array
const almacenamientoArray = multer.diskStorage({
    destination: (req, file, cb) => {
        const { _id: userId } = req.params
        const rutaDirectorio = path.join(__dirname, `/upload/documents/${userId}/`)
        if (!fs.existsSync(rutaDirectorio)) {
            fs.mkdirSync(rutaDirectorio, { recursive: true })
        }
        console.log("AQUI")
        cb(null, rutaDirectorio)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const archivosValidos = (req, file, cb) => {
    // const esPdf = file.mimetype === "application/pdf"
    // req.noValido = !esPdf
    // cb(null, esPdf)
    let fileCorrect = false
    if (file.mimetype === "application/pdf") fileCorrect = true
    req.noValid = fileCorrect;
    if (!fileCorrect) cb(null, false)
    else cb(null, true);
}

export const uploaderArray = multer({
    storage: almacenamientoArray,
    fileFilter: archivosValidos,
    onError: (err, next) => {
        console.error(err)
        next(err)
    }
})
//
export const HTTP_STATUS = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
}