import { Router } from "express";
import ProdServices from "../dao/db/productManager.services.js";
import { productsModel } from "../dao/db/models/products.js";

const productsRouter = Router();
const productManager = new ProdServices()

// const capitalizeFirstLetter = (text) => {
//     return text.charAt(0).toUpperCase() + text.slice(1);
// }

productsRouter.get('/', async (req, res) => {
try {
    const list = await ProdManager.findAll()
    res.send({ result: "Success", payload: list })
    // const products = await productManager.getProducts();    
    // res.send(products)
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const find = req.query.query;
    // const ord = req.query.sort;

    // const url = req.protocol + '://' + req.get('host') + req.originalUrl

    // const query = {};
    // const sort = ord === "asc" ? { "price": 1 } : (ord === "desc" ? { "price": -1 } : "");
    // if (find) query.category = find;
    // const options = { page, limit, lean: true };
    // if (sort) options.sort = sort;
    // const result = await productsModel.paginate(query, options);
    // result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    // result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    // result.status = "Success";
    // result.isValid = !(page < 1 || page > result.totalPages);
    
    // res.send(result);
    // res.render('products', result)
}
catch (error) {
    res.status(500).send('Error Interno del Servidor [GET]');
    console.log(error)
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
            res.status(404).send(`Producto con ID ${id} no Encontrado`)
        }

    }
    catch(error){
        res.status(500).send("Ha Ocurrido un Error")
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
        res.status(404).send(`Producto con ID ${id} no Encontrado`)
    }
    
}
catch(error){
    if (error.path === "_id") {
        res.status(404).send(`Producto con ID ${id} no Encontrado`)
    }
    else {
        res.status(500).send("Ha Ocurrido un Error")
    }
}
});

export default productsRouter