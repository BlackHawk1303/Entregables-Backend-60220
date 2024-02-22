import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import exphbs from 'express-handlebars';
import ProductManager from './public/js/productManager.js';
import __dirname from "./utils.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const prodMng = new ProductManager()

app.get('/', async (req, res) => {
    let list = await prodMng.getProducts()
    res.render('home', {
        list,
        style: "home.css"
    });
});


app.get('/realTimeProducts', async (req, res) => {
    let list = await prodMng.getProducts()

    res.render('realTimeProducts', {
        list,
        style: "realTimeProducts.css"
    })
})

io.on('connection', socket => {
    console.log('Cliente Conectado');

    socket.on('crearProducto', async producto => {
        let list = await prodMng.getProducts()
        producto.id = Date.now().toString()
        producto.status = true
        list.push(producto)
        await prodMng.saveProducts(list)

        io.emit('listadoFinal', list);
    })


    socket.on('eliminarProducto', async productoId => {
        let list = await prodMng.getProducts()

        let listLength = list.length
        let listUpdate = list.filter(s => s.id !== productoId)

        if (listLength === listUpdate.length) {
            io.emit('prodError', "id no encontrado")
        }
        else {
            await prodMng.saveProducts(listUpdate)
            list = await prodMng.getProducts()
            io.emit('listadoFinal', list);
        }
    })
})

io.on('disconnect', () => {
    console.log('Cliente Desconectado');
})

//Servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`)
})

