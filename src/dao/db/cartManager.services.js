import { cartsModel } from "./models/cartManager.js";
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

    deleteCart = async (ID) => {
        let cart = await cartsModel.deleteOne(ID)
        return cart
    }

}