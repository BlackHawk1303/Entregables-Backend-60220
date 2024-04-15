import { Router } from "express";
import cartServices from "../dao/db/cartManager.services.js";
import { productsModel } from "../dao/db/models/products.model.js";

const cartRouter = Router()
const cartMgr = new cartServices()

cartRouter.get("/", async (req, res) => {
try{
    let carts = await cartMgr.findCarts()
    res.json(carts)
}
catch(error){
    res.status(500).send("Un Error ha Ocurrido")
}


})

cartRouter.post('/', async (req,res) => {

    try{
        let cart = await cartMgr.createCart()
        res.json(cart) 
    }
    catch(error){
        res.status(500).send("Un Error ha Ocurrido")
    }
})

cartRouter.get("/:_id", async (req, res) =>{
    try{
        let id = req.params
        let list = cartMgr.findOneCart(id)
        res.json(list)
    }
    catch(error){
        if (error.path === "_id") res.status(400).send("Carrito no Encontrado")
        else res.status(400).send("Un Error ha Ocurrido")
    }
})

cartRouter.post("/:cid/products/:pid", async (req, res) =>{
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
})

cartRouter.delete('/:_id', async (req,res) =>{
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
    cartRouter.delete('/:cid/products/:pid', async (req, res) =>{
        let cid = { _id: req.params.cid }
        let pid = { _id: req.params.pid }
    
        let status = await cartManager.deleteProductByID(cid, pid)
        res.send(status)
    })
    cartRouter.put('/:_id', async (req, res) => {
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
    
    })
    cartRouter.put('/:cid/products/:pid', async (req, res) => {
        let cid = { _id: req.params.cid }
        let pid = { _id: req.params.pid }
        let data = req.body
    
        let status = await cartManager.updateProductQuantityByID(cid, pid, data)
        if (status.acknowledged === true) {
            res.send({status : "Cantidad Actualizada"})
        }
    })
})

export default cartRouter