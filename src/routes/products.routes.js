import { Router } from "express";
import ProdServices from "../dao/db/productManager.services.js";


const productsRouter = Router();
const productManager = new ProdServices()

productsRouter.get('/', async (req, res) => {
try {
    const products = await productManager.getProducts();    
    res.send(products)

} catch (error) {
    res.status(500).send('Error Interno del Servidor [GET]');
}
});

productsRouter.get('/:_id', async (req, res) => {

try {
    let id = req.params
    const products = await productManager.getProductsById(id);    
    res.json(products);

} catch (error) {
    res.status(500).send('Error Interno del Servidor [GET]');
}
});

productsRouter.post('/', async (req, res) => {
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
});
productsRouter.put('/:_id', async (req, res) => {
    try{
        let id = req.params
        let modProd = req.body
        
        let sta = await productManager.updateProducts(modProd,id)

        if (sta.acknowledged === true) {
            res.send(`Producto con ID ${id} Modificado Correctamente`)
        }
        else {
            res.send(`Producto con ID ${id} no Encontrado`)
        }

    }
    catch(error){
        res.status(500).send("Un Error ha Ocurrido")
    }
});

productsRouter.delete('/:_id', async (req, res) => {
try {
    let id = req.params
    let sta = await productManager.deleteProduct(id)
    
    if (sta.acknowledged === true) {
        res.send(`Producto con ID ${id} Eliminado`)
    }
    else {
        res.send(`Producto con ID ${id} no Encontrado`)
    }
    
}
catch(error){
    if (error.path === "_id") {
        res.status(500).send(`Producto con ID ${id} no Encontrado`)
    }
    else {
        res.status(500).send("Un Error ha Ocurrido")
    }
}
});

export default productsRouter;