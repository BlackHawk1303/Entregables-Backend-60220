import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                products: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 0
                },
            }
        ],
        default: [],

    },


})


export const cartsModel = mongoose.model(cartsCollection, cartSchema)