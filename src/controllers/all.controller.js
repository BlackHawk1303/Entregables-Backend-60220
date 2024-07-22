import UserProvider from '../services/user.services.js'
import ProdServices from '../services/productManager.services.js'
import CartServices from '../services/cartManager.services.js'
import { validpass, tokenGenerator, HTTP_STATUS } from "../utils.js"
import { v4 as uuid } from 'uuid'
import ChatServices from "../services/message.services.js"
import CustomError from '../services/errors/customError.js'
import { createProdError, deleteProdError } from '../services/errors/messages/products.errors.js'
import { generaterProduct, passwordHash, formattedMonth } from '../utils.js'
import EmailRecoveryProvider from '../services/emailRecovery.services.js'
import EmailSender from '../services/email.services.js'
import { format } from "date-fns"


const userManager = new UserProvider()
const productManager = new ProdServices()
const cartMgr = new CartServices()
const recoveryManager = new EmailRecoveryProvider()
const emailProvider = new EmailSender()

//User
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userManager.findUser({ email })
        if (!user || user.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ error: "Usuario no Encontrado", message: "Usuario o Contraseña Incorrectos" })
        }
        if (!validpass(user, password)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: "Acceso no Autorizado", message: "Usuario o Contraseña Incorrectos" })
        }
        const tokenData = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        user.last_connection = `${currentDateTime} LOG IN`
        const statuss = await userManager.updateUser({_id : user._id}, user)        
        const token = tokenGenerator(tokenData)
        res.send({ message: "Inicio de Sesión Satisfactorio", token, id: user._id, role: user.role })
    } catch (error) {
        console.error("Error al Iniciar Sesión:", error)
        res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." })
    }
}

export const get_User = async (req, res) => {
    const id = req.params.id
    
    const findUser = await userManager.findUser({ _id: id })
    
    res.send({ status: "success", payload: findUser })
}

export const current_user = async (req, res) => {
    const id = req.params.userId
    const user = await userManager.findUser({ _id: id })
    req.user.cart = user.cart._id
    res.send(req.user)
}
export const premium_change = async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) return res.status(400).send('No Subió Ningún Archivo')
        if (!req.noValid) return res.status(400).send("Tipo de Archivo no Permitido, Sólo Archivos PDF")

        
        const _id = { _id: req.params._id }
        
        let user = await userManager.findUser(_id)
        if (user.length === 0) {
            return res.status(401).send("usuario no encontrado")
        }
        user.role = "premium"
        const result = await userManager.updateUser(_id, user)
        if (result.acknowledged) res.send("Rol aplicado correctamente")
        else res.send("Error al Cambiar el Rol")
    }
    catch (error) {
    }
}

export const subirDocumentoUsuario = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No hay Información que Subir. Por Favor, Valide.")
        } else {
            return res.send(`Archivo Subido Correctamente: ${req.file.path}`)
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("Ocurrió un Error al Subir el Archivo. Por Favor, Inténtelo de Nuevo.")
    }
}

export const userLogout = async (req, res)=>{
    const {_id} = req.body    
    let user = await userManager.findUser({"_id":_id})
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    user.last_connection = `${currentDateTime} LOG OUT`
    const status = await userManager.updateUser({_id : user._id}, user)    
    res.redirect('/login')

}

export const findAllUser = async (req, res) => {
    try {
        const users = await userManager.findAll()
        const userArray = users.map(user => ({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }))
        res.send(userArray)
    } catch (e) {
        console.error(e)
        res.status(500).send("Ocurrió un Error en el Servidor.")
    }
}

export const isAdminOK = (req, res) => {
    res.send({ response: "OK" })
}

export const userEditAdmin = async (req, res) => {
    res.render("adminUserEditor")
}

export const adminRole = async (req, res) => {
    try {
        const { _id } = req.params
        const { role } = req.body

        if (!['user', 'admin', 'premium'].includes(role)) {
            return res.status(400).send({ error: "Rol no Válido" })
        }

        const user = await userManager.findUser({ _id })
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ error: "Usuario no Encontrado" })
        }
        user.role = role
        await userManager.updateUser({ _id }, user)
        res.send({ message: "Rol del Usuario Actualizado Exitosamente" })
    } catch (error) {
        console.error("Error al Actualizar el Rol:", error)
        res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." })
    }
}

export const userDelete = async (req, res) => {
    try {
        const { _id } = req.params
        const user = await userManager.findUser({ _id })

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ error: "Usuario no Encontrado" })
        }
        await userManager.deleteUser({ _id })
        res.send({ message: "Usuario Eliminado Exitosamente" })
    } catch (error) {
        console.error("Error al Eliminar Usuario:", error)
        res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." })
    }
}

export const userValidation = async (req,res) =>{
    try{
        const {_id} = req.params
        const user = await userManager.findUser({ "_id" : _id })        
        res.send({ payload: user.email })

    }
    catch(e){
        console.error("Error al Validar Tipo de Usuario:", error)
        res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." })   
    }
}

//User

//Product
export const getAllProduct = async (req, res) => {
    try {
        const list = await productManager.getAllProducts()
        res.send({ result: "Success", payload: list })
    }
    catch (error) {
        res.status(500).send('Error Interno del Servidor [GET]')
        console.log(error)
    }
}

export const getProductByID = async (req, res) => {
    try {
        let id = req.params
        const products = await productManager.getProductsById(id)
        res.json(products)
    } catch (error) {
        res.status(500).send('Error Interno del Servidor [GET]')
    }
}

export const postProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.thumbnail) {
            CustomError.createError({
                name: "ProductCreationError",
                cause: createProdError({
                    title: newProduct.title,
                    description: newProduct.description,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    category: newProduct.category,
                    thumbnail: newProduct.thumbnail
                }),
                message: "Error al Crear un Producto: Falta Uno o Más Campos Obligatorios"
            })
        }
        newProduct.status = true
        newProduct.code = uuid()
        if (req.user.role === "premium") newProduct.owner = req.user.email
        let product = await productManager.saveProducts(newProduct)
        res.json(product)
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send("Codigo Repetido")
        }
        else {

            if (error.name === "ProductCreationError") {
                console.log(error)
                res.status(400).send("Existen Campos Vacios, Favor Ingresa TODOS los Datos")
            }
            else {
                res.status(500).send("Un Error ha Ocurrido")
                console.log(error)
            }
        }
    }
}

export const putProduct = async (req, res) => {
    try {
        let id = req.params
        let modProd = req.body

        if (!modProd.title || !modProd.description || !modProd.price || !modProd.stock || !modProd.category || !modProd.thumbnail) {

            CustomError.createError({
                name: "ProductUpdateError",
                cause: createProdError({
                    title: modProd.title,
                    description: modProd.description,
                    price: modProd.price,
                    stock: modProd.stock,
                    category: modProd.category,
                    thumbnail: modProd.thumbnail
                }),
                message: "Error al Actualizar un Producto: Falta Uno o Más Campos Obligatorios"
            })
            res.status(400).send({ response: "Existen Campos Vacios, Favor Ingresa TODOS los Datos" })
        }

        let isValid = false

        const product = await productManager.getProductsById({ _id: id })

        if (product[0].owner === req.user.email) isValid = true
        if (req.user.role === "admin") isValid = true

        if (isValid) {

            let sta = await productManager.updateProducts(modProd, id)
            if (sta.acknowledged === true) {
                res.send({ response: `Producto con ID ${id} Modificado Correctamente` })
            }
            else {

                res.status(404).send({ response: `Producto con ID ${id} no Encontrado` })
            }
        }
        else {
            res.status(401).send({ response: `No Puedes Agregar Productos que no te Pertencen` })
        }
    }
    catch (error) {
        if (error.name === "ProductUpdateError") {
            console.log(error)
            res.status(400).send({ response: "Existen Campos Vacios, Favor Ingresa TODOS los Datos" })
        }
        else {
            res.status(500).send({ response: "Un Error ha Ocurrido" })
            console.log(error)
        }
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let id = req.params

        if (!id) {
            CustomError.createError({
                name: "ProductDeleteError",
                cause: deleteProdError(id),
                message: "Error al Borrar un Producto: Faltan Uno o Más Campos Obligatorios",
            })
        }

        let isValid = false

        const product = await productManager.getProductsById({ _id: id })

        if (product[0].owner === req.user.email) isValid = true
        if (req.user.role === "admin") isValid = true

        if (isValid) {
            let sta = await productManager.deleteProduct(id)

            if (sta.acknowledged === true) {
                res.send(`Producto con ID ${id} Eliminado`)
            }
            else {

                res.status(404).send(`Producto con ID ${id} no Encontrado`)
            }
        }
        else {
            res.status(401).send({ response: `No Puedes Eliminar Productos que no te Pertencen` })
        }
    }
    catch (error) {
        if (error.path === "_id") {
            res.status(404).send(`Producto con ID ${id} no Encontrado`)
        }
        else if (error.name === "ProductUpdateError") {
            console.log(error)
            res.status(404).send("Existen Campos Vacios, Favor Ingresa TODOS los Datos")
        }
        else {
            console.log(error)
            res.status(500).send("Ha Ocurrido un Error")
        }
    }
}

export const loadProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const find = req.query.query
        const ord = req.query.sort
        const url = req.protocol + '://' + req.get('host') + req.originalUrl
        const status = await productManager.getProducts(page, limit, find, url, ord)
        status.user = req.session.user      

        res.render("products", status)
    }
    catch (e) {
        console.log("Ha Ocurrido un Error: " + e)
    }
}

export const postPurchase = async (req, res) => {
    try {
        const cid = req.params.cid
        const userID = req.body.user
        const user = await userManager.findUser({ _id: userID })
        const cartStatus = await cartMgr.cartPurchase(cid, user.email)
        res.send({ status: "success", payload: cartStatus })
    }
    catch (e) {
        console.log("Ha Ocurrido un Error Durante la Compra: " + e)
    }
}
//Product

//Cart
export const getCart = async (req, res) => {
    try {
        const carts = await cartMgr.findCarts()
        res.json(carts)
    }
    catch (error) {
        res.status(500).send("Un Error ha Ocurrido")
    }
}

export const postCart = async (req, res) => {
    try {
        const cart = await cartMgr.createCart()
        res.json(cart)
    }
    catch (error) {
        res.status(500).send("Un Error ha Ocurrido")
    }
}

export const findCartByID = async (req, res) => {
    try {
        const id = req.params
        const list = await cartMgr.findOneCart(id)
        res.json(list)
    }
    catch (error) {
        if (error.path === "_id") res.status(400).send("Carrito no Encontrado")
        else res.status(400).send("Un Error ha Ocurrido")
    }
}

export const addProductCart = async (req, res) => {
    const cID = { _id: req.params.cid }
    const pID = { _id: req.params.pid }
    try {
        let isValid = false
        const product = await productManager.getProductsById(pID)
        if (product[0].owner !== req.user.email) isValid = true
        if (req.user.role === "user") isValid = true
        if (isValid) {
            let sta = await cartMgr.addProdinCart(cID, pID)

            if (sta.acknowledged === true) {
                res.send({ status: "Producto Agregado al Carro" })
            }
            else {
                res.send("Codigo no Encontrado")
            }
        }
        else res.send({ status: "No Puedes Agregar este Producto" })
    }
    catch (error) {
        res.status(500).send("Un Error ha Ocurrido")
        console.log(error)
    }
}
export const deleteCart = async (req, res) => {
    let _id = req.params
    try {
        let status = await cartMgr.cleanCart(_id)
        res.send(status)
    }
    catch (e) {
        if (e.value === _id._id) {
            res.status(500).send(`Carrito con ID ${e.value} no Encontrado`)
        } else {
            res.status(500).send("Un Error ha Ocurrido")
            console.log(e)
        }
    }
}

export const deleteProductByID = async (req, res) => {
    const cid = { _id: req.params.cid }
    const pid = { _id: req.params.pid }
    const status = await cartMgr.deleteProductByID(cid, pid)
    res.send(status)
}

export const putUpdateCart = async (req, res) => {
    const _id = req.params
    const data = req.body
    try {
        await cartMgr.cleanCart(_id)
        const status = await cartMgr.justUpdate(_id, data)
        if (status.acknowledged === true) {
            res.send("Carrito Actualizado")
        }
    }
    catch (e) {
        if (e.value === _id._id) {
            res.status(500).send(`Carrito con ID ${e.value} no Encontrado`)
        } else if (e.kind === 'ObjectId') {
            res.status(500).send(`Producto con ID ${e.value} no Encontrado`)
        }
        else {
            res.status(500).send("Un Error ha Ocurrido")
            console.log(e)
        }
    }

}

export const putUpdateCartByproductID = async (req, res) => {
    const cid = { _id: req.params.cid }
    const pid = { _id: req.params.pid }
    const data = req.body
    const status = await cartMgr.updateProductQuantityByID(cid, pid, data)
    if (status.acknowledged === true) {
        res.send({ status: "Cantidad Actualizada" })
    }
}

export const getCartByID = async (req, res) => {
    const id = req.params    
    const cart = await cartMgr.getInfoCartById(id)
    res.render("cart", cart)
}
//Cart

//Chat
const chatServices = new ChatServices()

export const renderChat = (req, res) => {
    res.render('chat', { subTitle: "Chat", style: "desing.css" })
}

export const storeMessage = async (message) => {
    try {
        await chatServices.saveMessage(message)
    } catch (error) {
        console.error('Error al Guardar Mensaje:', error)
        throw error
    }
}

export const getMessage = async () => {
    try {
        return await chatServices.loadMessage()
    } catch (error) {
        console.error('Error al Cargar Mensaje:', error)
        throw error
    }
}
//Chat

//Mock
const ProdManager = new ProdServices()

export const generateRandomProd = async (req, res) => {
    try {
        for (let i = 0; i < 100; i++) {
            ProdManager.saveProducts(generaterProduct())
        }
        res.send("Productos Creados con Exito")
    }
    catch (e) {
        console.log(e)
    }
}
//Mock

//Recovery
export const CreateEmailRecoveryID = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(401).send("Email no Encontrado")
        }

        const validEmail = await userManager.findUser({ email })
        if (!validEmail || validEmail.length === 0) {
            return res.status(401).send({ error: "No Encontrado", message: "Email no Encontrado" })
        }
        const date = new Date();
        const yr = date.getFullYear();
        const month = formattedMonth(date);
        const day = date.getDate().toString().padStart(2, '0')
        const hrs = (date.getHours() + 1).toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        const Emailrecovery = {
            recoverID: uuid(),
            email,
            expiration_date: `${yr}-${month}-${day}T${hrs}:${min}:00Z`,
        }
        const protocol = req.protocol
        const host = req.get('host')
        const enlace = `${protocol}://${host}`    
        const status = await recoveryManager.createRecovery(Emailrecovery)
        await emailProvider.sendRecoverEmail(status,enlace , Emailrecovery.email);
        return res.send({ message: "Correo de Recuperación Enviado" })
    } catch (e) {
        console.error(e);
        return res.status(500).send("Error Interno del Servidor")
    }
}

export const recoveryEmail = async (req, res) => {
    try {
        const { uuid } = req.params;
        const find = await recoveryManager.findOne(uuid)
        if (!find || find.length === 0) {
            return res.redirect("/user/recovery")
        }
        const actualDate = new Date();
        const dbDate = new Date(find.date)
        if (dbDate > actualDate) {
            return res.redirect("/user/recovery")
        }
        res.render("passwordUpdate")
    } catch (e) {
        console.error(e)
        return res.status(500).send("Error Interno del Servidor")
    }
};

export const passwordUpdate = async (req, res) => {
    try {
        const { uuid, password } = req.params
        const find = await recoveryManager.findOne(uuid)
        if (!find || find.length === 0) {
            return res.redirect("/user/recovery")
        }

        const user = await userManager.findUser({ email: find[0].email })
        if (!user || user.length === 0) {
            return res.redirect("/user/recovery")
        }

        if (validpass(user, password)) {
            return res.status(400).send("No Debes Utilizar la Misma Contraseña")
        }

        user.password = passwordHash(password);
        const status = await userManager.update(user, user._id);
        if (!status) {
            return res.status(401).send("No se Logró Actualizar la Contraseña")
        }

        return res.send({ success: "Contraseña Actualizada Correctamente" })
    } catch (e) {
        console.error(e)
        return res.status(500).send("Error Interno del Servidor")
    }
}
//Recovery