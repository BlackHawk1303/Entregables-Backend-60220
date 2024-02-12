import { Router } from "express";
import prodManager from "../public/productManager.js"

const productsRouter = Router();
const productManager = new prodManager()

productsRouter.get('/', async (req, res) => {
try {
    
    const products = await productManager.getProducts();
    
    res.json(products);

} catch (error) {
    res.status(500).send('Error Interno del Servidor [GET]');
}
});

productsRouter.get('/:pid', async (req, res) => {
const productId = req.params.pid;
try {
    const products = await productManager.getProducts();
    const product = products.find((p) => p.id == productId);
    if (!product) {
    res.status(404).send('Producto no Encontrado');
    
    }
    res.json(product);
} catch (error) {
    res.status(500).send('Error Interno del Servidor [GET]');
}
});

productsRouter.post('/', async (req, res) => {
try {
    let validacion1 = false
    let validacion2 = false
    

    const newProduct = req.body;

    const {title} = newProduct
    const {description} = newProduct
    const { price } = newProduct
    const { thumbnail } = newProduct
    const { code } = newProduct
    const { stock } = newProduct
    const { category } = newProduct
    console.log(code === "")
    

    if (typeof title && typeof description && typeof price && typeof category && typeof code && typeof stock === 'undefined') {
        validacion1 = true;
    }
    if (title === "" || description === "" || price === "" || category === "" || code === "" || stock === "" || category === "") {
        validacion2 = true;
        
    }

    if (!validacion1 && !validacion2){

    const products = await productManager.getProducts();    
    newProduct.id = Date.now().toString(); //Genera un ID Único Basado en Tiempo     
    newProduct.status = true  
    products.push(newProduct);
    await productManager.saveProducts(products);
    res.json(newProduct);
    }
    else{
        res.status(400).send('Existen campos vacios');
    }
} catch (error) {
    console.log(error)
    res.status(500).send('Error Interno del Servidor [POST] '+ error);
    
}
});

productsRouter.put('/:pid', async (req, res) => {
const productId = req.params.pid;
const updatedProduct = req.body;
try {
    const products = await productManager.getProducts();
    const index = products.findIndex((p) => p.id == productId);
    if (index === -1) {
    res.status(404).send('Producto no Encontrado');
    return;
    }
    products[index] = { ...products[index], ...updatedProduct, id: productId };
    await productManager.saveProducts(products);
    res.json(products[index]);
} catch (error) {
    res.status(500).send('Error Interno del Servidor [PUT]');
}
});

productsRouter.delete('/:pid', async (req, res) => {
const productId = req.params.pid;
try {
    const products = await productManager.getProducts();
    const filteredProducts = products.filter((p) => p.id != productId);
    await productManager.saveProducts(filteredProducts);
    res.send(`Producto con ID ${productId} Eliminado`);
} catch (error) {
    res.status(500).send('Error Interno del Servidor [DELETE]');
}
});

export default productsRouter;