import { Router } from "express";
import CartManager from "../public/cartManager.js";
import ProductManager from "../public/productManager.js";

const cartRouter = Router()
const cartMgr = new CartManager()
const prodManager = new ProductManager()

cartRouter.post("/", async (req, res) => {
try{ 
    const id = Date.now().toString();
    const productos = []

    let newCart = {id, productos}
    const cart = await cartMgr.getCarts()
    cart.push(newCart)

    await cartMgr.saveCarts(cart)

    res.json(cart)
} catch (error){
    console.log(error)
    res.status(500).send('Error Interno del Servidor [POST]')
}
})


cartRouter.get("/:cid", async (req, res) =>{

    let {cid} = req.params

    const cart = await cartMgr.getCarts()
    const searchCart = cart.find(search => search.id === cid) 

    if (!searchCart){
        res.status(400).send("Carrito no encontrado")
    }
    
    res.send(searchCart)


})

cartRouter.post("/:cid/products/:pid", async (req, res) =>{

    let {cid} = req.params
    let {pid} = req.params

    const cartList = await cartMgr.getCarts()
    const productList = await prodManager.getProducts()

    const searchCart = cartList.find(search => search.id === cid) 
    const searchProduct = productList.find((p) => p.id == pid);

    const index = cartList.findIndex(search => search.id === cid)

    let status = false
    
    if (!searchCart) res.status(400).send("Carrito no encontrado"); status = true
    if (!searchProduct) res.status(404).send('Producto no Encontrado'); status = true

    if (!status){
        let quantity = 1

        let list = {pid, quantity}

        let change = false

        for (let i = 0; i < searchCart.productos.length; i++){
            
            if (searchCart.productos[i].pid === pid){
                searchCart.productos[i].quantity = searchCart.productos[i].quantity + 1 
                change = true            
            }
        }
        
        if (change){
            cartList[index] = {...cartList[index], ...searchCart}
            await cartMgr.saveCarts(cartList)
            res.send(cartList[index])
        }
        else{     
            if (index !== -1){
                searchCart.productos.push(list)
                cartList[index] = {...cartList[index], ...searchCart}
                await cartMgr.saveCarts(cartList)
                res.send(cartList[index])
            }
        }
    }
    
})

export default cartRouter