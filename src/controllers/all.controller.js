//Imports
import UserProvider from '../services/user.services.js'
import ProdServices from '../services/productManager.services.js'
import CartServices from '../services/cartManager.services.js'
import MessageServices from '../services/message.services.js';
import bcrypt from "bcrypt"
import {validationResult} from "express-validator"
import userModel from "../dao/db/models/user.model.js";
import passport from 'passport';
import passportLocal from 'passport-local';
import { authToken , validpass, tokenGenerator, HTTP_STATUS} from "../utils.js";
import { v4 as uuid } from 'uuid'
import ChatServices from "../services/message.services.js";
//Imports

const userManager = new UserProvider();
const productManager = new ProdServices();
const cartMgr = new CartServices()


//User
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.findUser({ email });

        if (user.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ error: "Usuario no Encontrado", message: "Usuario o Contraseña Incorrectos" });
        }
        if (!validpass(user, password)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: "Acceso no Autorizado", message: "Usuario o Contraseña Incorrectos" });
        }
        const tokenData = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };

        const token = tokenGenerator(tokenData);
        console.log(token)
        res.send({ message: "Inicio de Sesión Satisfactorio", token, id: user._id });
    } catch (error) {
        console.error("Error al Iniciar Sesión:", error);
        res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." });
    }

    
}

export const get_User = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const findUser = await userManager.findUser({ _id: id })
    console.log(findUser.cart)
    res.send({ status: "success", payload: findUser.cart._id })


}

export const current_user = async (req, res)=>{
    const id = req.params.userId
    const user = await userManager.findUser({ _id: id })
    req.user.cart = user.cart._id
    res.send(req.user)


}
//User

//Product
export const getAllProduct = async (req, res) => {
    try {
        const list = await productManager.findAll()
        res.send({ result: "Success", payload: list })
    }
    catch (error) {
        res.status(500).send('Error Interno del Servidor [GET]');
        console.log(error)
    }
    }

export const getProductByID = async (req, res) => {

    try {
        let id = req.params
        const products = await productManager.getProductsById(id);    
        res.json(products);
    
    } catch (error) {
        res.status(500).send('Error Interno del Servidor [GET]');
    }
    }

export const postProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        newProduct.status = true
        console.log(newProduct)
        let product = await productManager.saveProducts(newProduct)
        res.json(product)
    } catch (error) {
        if (error.code === 11000){
            res.status(400).send("Codigo Repetido")
        }
        else{
            res.status(500).send("Un Error ha Ocurrido")
        }
        
    }
    }

export const putProduct = async (req, res) => {
    try{
        let id = req.params
        let modProd = req.body
        
        let sta = await productManager.updateProducts(modProd,id)

        if (sta.acknowledged === true) {
            res.send(`Producto con ID ${id} Modificado Correctamente`)
        }
        else {
            res.status(404).send(`Producto con ID ${id} no Encontrado`)
        }

    }
    catch(error){
        res.status(500).send("Ha Ocurrido un Error")
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let id = req.params
        let sta = await productManager.deleteProduct(id)
        
        if (sta.acknowledged === true) {
            res.send(`Producto con ID ${id} Eliminado`)
        }
        else {
            res.status(404).send(`Producto con ID ${id} no Encontrado`)
        }
        
    }
    catch(error){
        if (error.path === "_id") {
            res.status(404).send(`Producto con ID ${id} no Encontrado`)
        }
        else {
            res.status(500).send("Ha Ocurrido un Error")
        }
    }
    }

export const loadProduct = async (req, res) => {
    try {


        // if (!req.session.user) return res.redirect("/login")


        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let find = req.query.query
        let ord = req.query.sort
        let url = req.protocol + '://' + req.get('host') + req.originalUrl

        let status = await productManager.getProducts(page, limit, find, url, ord)
        
        status.user = req.session.user
        res.render("products", status)

        
    }
    catch (e) {
        console.log("Ha Ocurrido un Error: " + e);
    }
}

export const postPurchase = async (req, res) =>{
    try{
        let cid = req.params.cid
        let userID = req.body.user
        

        let user = await userManager.findUser({ _id: userID })
        
        let cartStatus = await cartMgr.cartPurchase(cid, user.email)
        
        res.send({ status: "success", payload: cartStatus })
    }
    catch (e){
        console.log("Ha Ocurrido un Error Durante la Compra: " + e);
    }
}
//Product

//Cart
export const getCart = async (req, res) => {
    try{
        let carts = await cartMgr.findCarts()
        res.json(carts)
    }
    catch(error){
        res.status(500).send("Un Error ha Ocurrido")
    }
}

export const postCart = async (req,res) => {
        try{
            let cart = await cartMgr.createCart()
            res.json(cart) 
        }
        catch(error){
            res.status(500).send("Un Error ha Ocurrido")
        }
}

export const findCartByID = async (req, res) =>{
    try{
        let id = req.params

        console.log(id)

        let list = cartMgr.findOneCart(id)
        res.json(list)
    }
    catch(error){
        if (error.path === "_id") res.status(400).send("Carrito no Encontrado")
        else res.status(400).send("Un Error ha Ocurrido")
    }
}

export const addProductCart = async (req, res) =>{
        let cID = {_id: req.params.cid}
        let pID = {_id: req.params.pid}

        try{       
            
            let sta = await cartMgr.addProdinCart(cID, pID)
    
            if (sta.acknowledged === true) {
                res.send({status:"Producto Agregado al Carro"})
            }
            else {
                res.send("Codigo no Encontrado")
            }
        }
        catch(error){
            res.status(500).send("Un Error ha Ocurrido")
            console.log(error)
        } 
    }

export const deleteCart = async (req,res) =>{
    let _id = req.params
    try {

        let status = await cartManager.cleanCart(_id)
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

export const deleteProductByID = async (req, res) =>{
    let cid = { _id: req.params.cid }
    let pid = { _id: req.params.pid }

    let status = await cartManager.deleteProductByID(cid, pid)
    res.send(status)
}

export const putUpdateCart = async (req, res) => {
    let _id = req.params
    let data = req.body
    try {
        await cartManager.cleanCart(_id)
        let status = await cartManager.justUpdate(_id, data)
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
    let cid = { _id: req.params.cid }
    let pid = { _id: req.params.pid }
    let data = req.body

    let status = await cartManager.updateProductQuantityByID(cid, pid, data)
    if (status.acknowledged === true) {
        res.send({status : "Cantidad Actualizada"})
    }
}

export const getCartByID = async (req, res) => {

    let id = req.params  

    let cart = await cartMgr.getInfoCartById(id)
    
    res.render("cart", cart)
}
//Cart

//Chat
const chatServices = new ChatServices();

export const renderChat = (req, res) => {
    res.render('chat', { subTitle: "Chat", style: "desing.css" });
}

export const storeMessage = async (message) => {
    try {
        await chatServices.saveMessage(message);
    } catch (error) {
        console.error('Error al Guardar Mensaje:', error);
        throw error; 
    }
}

export const getMessage = async () => {
    try {
        return await chatServices.loadMessage();
    } catch (error) {
        console.error('Error al Cargar Mensaje:', error);
        throw error; 
    }
}
//Chat