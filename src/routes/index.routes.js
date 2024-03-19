import { Router } from "express";
import ProdServices from "../dao/db/productManager.services.js";
import cartServices from "../dao/db/cartManager.services.js";


const router = Router()
const prodManager = new ProdServices();
const cartManager = new cartServices()

router.get('/products', async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let find = req.query.query
        let ord = req.query.sort
        let url = req.protocol + '://' + req.get('host') + req.originalUrl

        let status = await prodManager.getProducts(page, limit, find, url, ord)        
        res.render("products", status)

        console.log(status)
    }
    catch (e) {
        console.log("Ha Ocurrido un Error: " + e);
    }
})

router.get('/cart/:_id', async (req, res) => {

    let id = req.params

    let cart = await cartManager.getCartById(id)

    console.log(cart.docs[0].products)
    res.render("cart", cart)

})

export default router