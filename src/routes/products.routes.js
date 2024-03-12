import { Router } from "express";
import ProdServices from "../dao/db/productManager.services.js";
//import prodManager from "../../dao/db/FileSystem/productManager.js"

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
    // let validacion1 = false
    // let validacion2 = false
    
   
    const newProduct = req.body;
    newProduct.status = true
    console.log(newProduct)
    let product = await productManager.saveProducts(newProduct)
    res.json(product)

    // const {title} = newProduct
    // const {description} = newProduct
    // const { price } = newProduct
    // const { thumbnail } = newProduct
    // const { code } = newProduct
    // const { stock } = newProduct
    // const { category } = newProduct
    // console.log(code === "")
    

    // if (typeof title && typeof description && typeof price && typeof category && typeof code && typeof stock === 'undefined') {
    //     validacion1 = true;
    // }
    // if (title === "" || description === "" || price === "" || category === "" || code === "" || stock === "" || category === "") {
    //     validacion2 = true;
        
    // }

    // if (!validacion1 && !validacion2){

    // const products = await productManager.getProducts();    
    // newProduct.id = Date.now().toString(); //Genera un ID Único Basado en Tiempo     
    // newProduct.status = true  
    // products.push(newProduct);
    // await productManager.saveProducts(products);
    // res.json(newProduct);
    // }
    // else{
    //     res.status(400).send('Existen campos vacios');
    // }



} catch (error) {
    if (error.code === 11000){
        res.status(400).send("Codigo Repetido")
    }
    else{
        res.status(500).send("un error ocurrio")
    }
    
}
});

productsRouter.put('/:_id', async (req, res) => {
// const productId = req.params.pid;
// const updatedProduct = req.body;
// try {
//     const products = await productManager.getProducts();
//     const index = products.findIndex((p) => p.id == productId);
//     if (index === -1) {
//     res.status(404).send('Producto no Encontrado');
//     return;
//     }
//     products[index] = { ...products[index], ...updatedProduct, id: productId };
//     await productManager.saveProducts(products);
//     res.json(products[index]);
// } catch (error) {
//     res.status(500).send('Error Interno del Servidor [PUT]');
// }

    try{
        let id = req.params
        let modProd = req.body
        
        let sta = await productManager.updateProducts(modProd,id)

        if (sta.acknowledged === true) {
            res.send(`producto con ID ${id} modificado correctamente`)
        }
        else {
            res.send(`producto con ID ${id} no encontrado`)
        }

    }
    catch(error){
        res.status(500).send("un error ocurrio")
    }
});

productsRouter.delete('/:_id', async (req, res) => {
// const productId = req.params.pid;
// try {
//     const products = await productManager.getProducts();
//     const filteredProducts = products.filter((p) => p.id != productId);
//     await productManager.saveProducts(filteredProducts);
//     res.send(`Producto con ID ${productId} Eliminado`);
// } catch (error) {
//     res.status(500).send('Error Interno del Servidor [DELETE]');
// }

try {
    let id = req.params
    let sta = await productManager.deleteProduct(id)
    
    if (sta.acknowledged === true) {
        res.send(`producto con ID ${id} eliminado`)
    }
    else {
        res.send(`producto con ID ${id} no encontrado`)
    }
    
}
catch(error){
    if (error.path === "_id") {
        res.status(500).send(`producto con ID ${id} no encontrado`)
    }
    else {
        res.status(500).send("un error ocurrio")
    }
}

});

export default productsRouter;