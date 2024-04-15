import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname

export const KEY = 'M3g4.1370'

export const tokenGenerator = (user) => { return jwt.sign({ user }, KEY, { expiresIn: '48h' }) }

export const authToken = (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
        return res.status(401).send({error: 'No estás Autorizado para estar Aquí. Por favor, Vuelve a Autenticarte.' })
    }

    const token = header.split(' ')[1];
    jwt.verify(token, KEY, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: 'El Token no es Válido. Por favor, Vuelve a Autenticarte.' })
        }
        req.user = credentials.user
        next()
    })
}

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
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Usuario no encontrado en el JWT" })
            }
            if (req.user.role !== role) {
                return res.status(403).json({ error: "No Tienes Permisos para Ver este Contenido" })
            }
            next()
        } catch (error) {

            console.error("Error de Autorización:", error)
            return res.status(500).json({ error: "Error de Servidor al Verificar la Autorización" })
        }
    }
}

export const HTTP_STATUS = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
}