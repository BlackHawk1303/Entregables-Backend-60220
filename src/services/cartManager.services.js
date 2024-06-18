import { cartsModel } from "../dao/db/models/cartManager.model.js";
import ProdServices from "./productManager.services.js";
import TicketProvider from "./ticket.services.js"

const prodMgr = new ProdServices()
const ticketServices = new TicketProvider()
export default class cartServices {
    constructor() { }

    findCarts = async () => {
        let carts = await cartsModel.find()
        return carts.map(carts => carts.toObject())
    }
    createCart = async () => {
        let status = await cartsModel.create({ products: [] })
        return status
    }
    addProdinCart = async (cid, pid) => {
        let cart = await this.findOneCart(cid)
        let prod = await prodMgr.getProductsById(pid)
        console.log(prod[0]._id)
        let find = false
        for (let i = 0; i < cart[0].products.length; i++) {            
            let id = cart[0].products[i].products._id.toString()
            if (id === pid._id.toString()) {
                cart[0].products[i].quantity++
                find = true
            }
        } 
        if (find) {

            let status = await cartsModel.updateOne(cid, cart[0])
            return status
        }
        else {
            cart[0].products.push({ "products": prod[0] })
            let indice = cart[0].products.length - 1
            cart[0].products[indice].quantity = 1

            let status = await cartsModel.updateOne(cid, cart[0])
            return status
        }
    }

    findOneCart = async (ID) => {
        
        let cart = await cartsModel.find(ID)
        return cart
    }

    cleanCart = async (cid) =>{
        let cart = await this.findOneCart(cid)        
        for (let i = 0; i < cart[0].products.length; i++){
            let id = cart[0].products[i]._id
            cart[0].products.pull(id)
        }
        cart[0].save()
        return cart
    } 
    justUpdate = async (cid, data) =>{
        let cart = await this.findOneCart(cid)
        for (let i = 0; i <data.products.lenght; i++){
            let prod = await prodMgr.findOne({ _id: data.products[i] })
            cart[0].products.push({ products: prod[0]._id, quantity: 1 })   
        }
        let status = cartsModel.updateOne(cid, cart[0])
        return status
    }

    deleteProductByID = async (cid, pid) => {
    const cart = await this.findOneCart(cid)
    console.log(cart)
        for (let i = 0; i < cart[0].products.length; i++) {
            if (cart[0].products[i].products._id.toString() === pid._id.toString()) {
                let id = cart[0].products[i]._id
                cart[0].products.pull(id)
            }
        }
        cart[0].save()
        return cart
}
updateProductQuantityByID = async (cid, pid, data) => {

    let cart = await this.getCartById(cid)

    for (let i = 0; i < cart[0].products.length; i++) {
        if (cart[0].products[i].products._id.toString() === pid._id.toString()) {
            cart[0].products[i].quantity = parseInt(data.quantity)
        }
    }
    let status = await cartsModel.updateOne(cid, cart[0])
    return status
}

getInfoCartById = async (_id) => {
    const query = {};
    if (_id) {
        query._id = _id;
    }
    const page = 1;
    const limit = 1;
    const options = { page, limit, lean: true };
    const cart = await cartsModel.paginate(query, options);
    cart.success = true;
    
    return cart;
}

//Metodo Purchase
cartPurchase = async (cartID, email) => {
        try {           

            const cart = await this.getCartById(cartID);            

            // if (!cart || !cart.products) return null;

            
            const purchaseResults = await this.processCartItems(cart[0].products);
            

            if (purchaseResults.purchasedItems.length > 0) {
                await this.clearPurchasedItemsFromCart(cartID, purchaseResults.purchasedItems);
                await this.createPurchaseTicket(purchaseResults.totalAmount, email);
            }

            return cart;
        } catch (e) {
            console.error("Error al Procesar la Compra del Carro:", e);
            throw e;  
        }
    }

    getCartById = async (cartID) => {
        return await this.findOneCart({ _id: cartID });
    }

    processCartItems = async (products) => {
        let purchasedItems = [];
        let totalAmount = 0;
        for (let productInfo of products) {
            const product = await prodMgr.getProductsById({ _id: productInfo.products._id.toString() });            
            
            if (parseInt(product[0].stock) >= parseInt(productInfo.quantity)) {
                console.log("hola")
                purchasedItems.push(product[0]._id.toString());
                product[0].stock -= productInfo.quantity;
                await prodMgr.updateProducts(product[0], { _id: product[0]._id.toString() });
                totalAmount += productInfo.quantity; 
            }
        }

        return { purchasedItems, totalAmount };
    }

    clearPurchasedItemsFromCart = async (cartID, purchasedItems) => {
        const cid = { _id: cartID };
        for (let productId of purchasedItems) {
            await this.deleteProductByID(cid, { _id: productId });
        }
    }

    createPurchaseTicket = async (amount, purchaserEmail) => {
        const ticketData = {
            amount: amount,
            purchaser: purchaserEmail
        };
        await ticketServices.createTicket(ticketData);
    }
}
//Metodo Purchase



