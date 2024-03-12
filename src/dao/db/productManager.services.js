import { productsModel } from "./models/products.js";

export default class ProdServices {
    constructor() { }

    getProducts = async () => {
        let products = await productsModel.find()
        return products.map(prod => prod.toObject())
    }

    saveProducts = async (product) => {
        let status = await productsModel.create(product)
        return status
    }

    getProductsById = async (ID) => {
        let product = await productsModel.find(ID)
        return product
    }

    deleteProduct = async (ID) => {
        let status = await productsModel.deleteOne(ID)
        return status
    }

    updateProducts = async (newData, ID) => {
        let productUpdated = productsModel.updateOne(ID, newData)
        return productUpdated
    }
}