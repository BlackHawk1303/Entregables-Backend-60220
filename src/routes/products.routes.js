import { Router } from "express"
import { getAllProduct, getProductByID, postProduct, putProduct, deleteProduct } from "../controllers/all.controller.js"
import { authToken, authorization } from "../utils.js"

const productsRouter = Router()

productsRouter.get('/', getAllProduct)
productsRouter.get('/:_id', getProductByID)
productsRouter.post('/', authToken, authorization(["admin", "premium"]), postProduct)
productsRouter.put('/:_id', authToken, authorization(["admin", "premium"]), putProduct)
productsRouter.delete('/:_id', authToken, authorization(["admin", "premium"]), deleteProduct)

//Usuario en Sesión
productsRouter.get('/products', async (req, res) => {
    if (req.session.user) {
        res.render('products', { title: "Productos", user: req.session.user });
    } else {
        res.redirect('/login')
    }
});
//Usuario en Sesión

export default productsRouter