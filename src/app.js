import express from 'express';
import mongoose from "mongoose";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import productsRoute from './routes/products.routes.js'
import cartRouter from './routes/cartManager.routes.js';
import chatRouter from "./routes/chat.routes.js"
import { Server } from 'socket.io'
import chatServices from "./dao/db/message.services.js";

let chat = new chatServices();

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/carts', cartRouter);
app.use('/api/products', productsRoute);
app.use('/', chatRouter);

app.get('/ping', (req, res) => {
    console.log(__dirname);
    res.send({ status: "OK" })
})

const httpServer = app.listen(PORT, () => {
console.log(`Servidor Escuchando en el Puerto ${PORT}`);
});


//MongoDB
const URL_MONGO = 'mongodb+srv://miguelfarias1303:OjldW3UIjIT9GRCV@cluster0.bfgxvqz.mongodb.net/ecommerce?retryWrites=true&w=majority' 

const mongoConnect = async () => {
    try {
        mongoose.connect(URL_MONGO)
        console.log("Conexión Exitosa a Base de Datos: MongoDB")
    }
    catch (e) {
        console.error("No se Puede Conectar a la Base de Datos: " + e)
        process.exit();
    }
}

mongoConnect()

const socket_Server = new Server(httpServer)
let logs = await chat.getMessage()

socket_Server.on('connection', socket => {
    console.log("Usuario Conectado")
    socket_Server.emit('log', logs)

    socket.on("message", async messagedata => {
        await chat.storeMessage(messagedata)
        logs = await chat.getMessage()
        socket_Server.emit('log', logs)

    })

})