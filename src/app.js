import express from 'express';
import __dirname from '../utils.js';
import productsRoute from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js';


const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/src/public'))

app.use('/api/carts', cartRouter);
app.use('/api/products', productsRoute);

app.get('/ping', (req, res) => {
    console.log(__dirname);
    res.send({ status: "ok" })
})

app.listen(PORT, () => {
console.log(`Servidor Escuchando en el Puerto ${PORT}`);
});