import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from "mongoose";
import __dirname from './utils.js';
import handlebars from "express-handlebars"
import productsRoute from './routes/products.routes.js'
import cartRouter from './routes/cartManager.routes.js';
import chatRouter from "./routes/chat.routes.js"
import { Server } from 'socket.io'
import chatServices from "./services/message.services.js";
import indexRouter from "./routes/index.routes.js"
import session from "express-session"
import connect from "connect-mongo"
import path from 'path';
import userRouter from "./routes/user.session.view.routes.js"
import gitRoutes from "./routes/github.views.routes.js"
import passport from "passport";
import initPassport from "./config/passport.config.js";
import config from './config/env/config.js'


let chat = new chatServices();

const app = express();
// const PORT = 8080;
const PORT = config.port

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const URL_MONGO = 'mongodb+srv://miguelfarias1303:OjldW3UIjIT9GRCV@cluster0.bfgxvqz.mongodb.net/ecommerce?retryWrites=true&w=majority' 
const URL_MONGO = config.mongoUrl

app.use(session({
    store: connect.create({
        mongoUrl: URL_MONGO,
        ttl: 2000
    }),
    secret:"S0pT1",
    resave:false,
    saveUninitialized:false
}))

app.locals.year = new Date().getFullYear()

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/carts', cartRouter);
app.use('/api/products', productsRoute);
app.use('/', chatRouter);
app.use("/", indexRouter)
app.use("/", userRouter)
app.use("/github",gitRoutes)

app.get('/ping', (req, res) => {
    console.log(__dirname);
    res.send({ status: "OK" })
})

const httpServer = app.listen(PORT, () => {
console.log(`Servidor Escuchando en el Puerto ${PORT}`);
});

//MongoDB
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