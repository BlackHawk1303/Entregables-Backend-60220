import { Router } from "express";
import { getAllProduct,getProductByID,postProduct,putProduct,deleteProduct } from "../controllers/all.controller.js";

const productsRouter = Router();

productsRouter.get('/', getAllProduct)
productsRouter.get('/:_id', getProductByID)
productsRouter.post('/', postProduct)
productsRouter.put('/:_id', putProduct)
productsRouter.delete('/:_id', deleteProduct)

//Usuario en Sesión
productsRouter.get('/products', async (req, res) => {
    if (req.session.user) {
        res.render('products', { title: "Productos", user: req.session.user });
    } else {
        res.redirect('/login');
    }
});
//Usuario en Sesión

export default productsRouter