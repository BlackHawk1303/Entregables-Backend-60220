import { Router } from "express";
import cartServices from "../dao/db/cartManager.services.js";
import { productsModel } from "../dao/db/models/products.js";
//import CartManager from "../../dao/db/FileSystem/cartManager.js";
//import ProductManager from "../../dao/db/FileSystem/productManager.js";

const cartRouter = Router()
const cartMgr = new cartServices()
// const prodManager = new ProductManager()

cartRouter.get("/", async (req, res) => {
// try{ 
//     const id = Date.now().toString();
//     const productos = []

//     let newCart = {id, productos}
//     const cart = await cartMgr.getCarts()
//     cart.push(newCart)

//     await cartMgr.saveCarts(cart)

//     res.json(cart)
// } catch (error){
//     console.log(error)
//     res.status(500).send('Error Interno del Servidor [POST]')
// }

try{
    let carts = await cartMgr.findCarts()
    res.json(carts)
}
catch(error){
    res.status(500).send("un error sucedido")
}


})

cartRouter.post('/', async (req,res) => {

    try{
        let cart = await cartMgr.createCart()
        res.json(cart) 
    }
    catch(error){
        res.status(500).send("un error sucedio")
    }
})


cartRouter.get("/:_id", async (req, res) =>{

    // let {cid} = req.params

    // const cart = await cartMgr.getCarts()
    // const searchCart = cart.find(search => search.id === cid) 

    // if (!searchCart){
    //     res.status(400).send("Carrito no encontrado")
    // }
    
    // res.send(searchCart)

    try{
        let id = req.params
        let list = cartMgr.findOneCart(id)
        res.json(list)
    }
    catch(error){
        if (error.path === "_id") res.status(400).send("carrito no encontrado")
        else res.status(400).send("un error ha sucedido")
    }
})

cartRouter.post("/:cid/products/:pid", async (req, res) =>{
    let cID = {_id: req.params.cid}
    let pID = {_id: req.params.pid}
    try{       
        
        let sta = await cartMgr.addProdinCart(cID, pID)

        if (sta.acknowledged === true) {
            res.send("se ha agregado el producto al carro")
        }
        else {
            res.send("codigo no encontrado")
        }
    }
    catch(error){
        res.status(500).send("un error ha sucedido")
        console.log(error)
       
    }

    // let {cid} = req.params
    // let {pid} = req.params

    // const cartList = await cartMgr.getCarts()
    // const productList = await prodManager.getProducts()

    // const searchCart = cartList.find(search => search.id === cid) 
    // const searchProduct = productList.find((p) => p.id == pid);

    // const index = cartList.findIndex(search => search.id === cid)

    // let status = false
    
    // if (!searchCart) res.status(400).send("Carrito no encontrado"); status = true
    // if (!searchProduct) res.status(404).send('Producto no Encontrado'); status = true

    // if (!status){
    //     let quantity = 1

    //     let list = {pid, quantity}

    //     let change = false

    //     for (let i = 0; i < searchCart.productos.length; i++){
            
    //         if (searchCart.productos[i].pid === pid){
    //             searchCart.productos[i].quantity = searchCart.productos[i].quantity + 1 
    //             change = true            
    //         }
    //     }
        
    //     if (change){
    //         cartList[index] = {...cartList[index], ...searchCart}
    //         await cartMgr.saveCarts(cartList)
    //         res.send(cartList[index])
    //     }
    //     else{     
    //         if (index !== -1){
    //             searchCart.productos.push(list)
    //             cartList[index] = {...cartList[index], ...searchCart}
    //             await cartMgr.saveCarts(cartList)
    //             res.send(cartList[index])
    //         }
    //     }
    // }
    
})

export default cartRouter