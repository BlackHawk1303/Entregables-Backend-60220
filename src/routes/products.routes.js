import { Router } from "express";
// import ProdServices from "../dao/db/productManager.services.js";
// import { productsModel } from "../dao/db/models/products.model.js";
import { getAllProduct,getProductByID,postProduct,putProduct,deleteProduct } from "../controllers/all.controller.js";

const productsRouter = Router();
// const productManager = new ProdServices()

// productsRouter.get('/', async (req, res) => {
// try {
//     const list = await productManager.findAll()
//     res.send({ result: "Success", payload: list })
// }
// catch (error) {
//     res.status(500).send('Error Interno del Servidor [GET]');
//     console.log(error)
// }
// });

productsRouter.get('/', getAllProduct)
productsRouter.get('/:_id', getProductByID)
productsRouter.post('/', postProduct)
productsRouter.put('/:_id', putProduct)
productsRouter.delete('/:_id', deleteProduct)

// productsRouter.get('/:_id', async (req, res) => {
// try {
//     let id = req.params
//     const products = await productManager.getProductsById(id);    
//     res.json(products);

// } catch (error) {
//     res.status(500).send('Error Interno del Servidor [GET]');
// }
// });

// productsRouter.post('/', async (req, res) => {
// try {
//     const newProduct = req.body;
//     newProduct.status = true
//     console.log(newProduct)
//     let product = await productManager.saveProducts(newProduct)
//     res.json(product)
// } catch (error) {
//     if (error.code === 11000){
//         res.status(400).send("Codigo Repetido")
//     }
//     else{
//         res.status(500).send("Un Error ha Ocurrido")
//     }
    
// }
// });

// productsRouter.put('/:_id', async (req, res) => {
//     try{
//         let id = req.params
//         let modProd = req.body
        
//         let sta = await productManager.updateProducts(modProd,id)

//         if (sta.acknowledged === true) {
//             res.send(`Producto con ID ${id} Modificado Correctamente`)
//         }
//         else {
//             res.status(404).send(`Producto con ID ${id} no Encontrado`)
//         }

//     }
//     catch(error){
//         res.status(500).send("Ha Ocurrido un Error")
//     }
// });

// productsRouter.delete('/:_id', async (req, res) => {
// try {
//     let id = req.params
//     let sta = await productManager.deleteProduct(id)
    
//     if (sta.acknowledged === true) {
//         res.send(`Producto con ID ${id} Eliminado`)
//     }
//     else {
//         res.status(404).send(`Producto con ID ${id} no Encontrado`)
//     }
    
// }
// catch(error){
//     if (error.path === "_id") {
//         res.status(404).send(`Producto con ID ${id} no Encontrado`)
//     }
//     else {
//         res.status(500).send("Ha Ocurrido un Error")
//     }
// }
// });

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