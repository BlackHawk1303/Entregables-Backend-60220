import { Router } from "express";
import cartServices from "../dao/db/cartManager.services.js";
import { productsModel } from "../dao/db/models/products.js";

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
            res.send("Producto Agregado al Carro")
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

export default cartRouter