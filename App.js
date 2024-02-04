import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const port = 8080
const productManager = new ProductManager('productos.json');

app.get('/products', async (req, res) => {
    let totalProd = await productManager.getProducts()
    let dataLimit = req.query

    if (dataLimit.limit === undefined) res.send(totalProd)
    else{
        let newList = []
        //for(let i = 0; i <= dataLimit.limit - 1; i++){
            for(let i = 0; i <= dataLimit.limit - 1 && i < totalProd.length; i++) {
            newList.push(totalProd[i])
        }
        //res.send(newList)
        if(newList.length > 0){
            res.send(newList)
        } else {
            res.send("Productos no encontrados")
        }
    }
})

app.get('/products/:pid', async (req, res) => {
    let { pid } = req.params
    const onlyProduct = await productManager.getProductById(parseInt(pid))    
    if  (onlyProduct !== undefined) res.send(onlyProduct)
    else  res.send("ID no se encuentra")
})

app.listen(port,() => {
    console.log(`Ejecutando en puerto ${port}`)
})