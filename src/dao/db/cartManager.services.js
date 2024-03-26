import { cartsModel } from "./models/cartManager.model.js";
import ProdServices from "./productManager.services.js";

const prodMgr = new ProdServices()

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
            let id = cart[0].products[1]._id
            cart[0].products.pull(id)
        }
        cart[0].save()
        return cart
    } 
    justUpdate = async (cid, data) =>{
        let cart = await this.findOne(cid)
        for (let i = 0; i <data.products.lenght; i++){
            let prod = await prodServices.findOne({ _id: data.products[i] })
            cart[0].products.push({ products: prod[0]._id, quantity: 1 })   
        }
        let status = cartsModel.updateOne(cid, carts[0])
        return status
    }

    deleteProductByID = async (cid, pid) => {
        cart = this.findOne(cid)
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

    let cart = await this.findOne(cid)

    for (let i = 0; i < cart[0].products.length; i++) {
        if (cart[0].products[i].products._id.toString() === pid._id.toString()) {
            cart[0].products[i].quantity = parseInt(data.quantity)
        }
    }

    let status = await cartsModel.updateOne(cid, cart[0])
    return status
}

getCartById = async (_id) => {
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
}