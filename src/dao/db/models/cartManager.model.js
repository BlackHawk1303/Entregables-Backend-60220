import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

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

cartSchema.pre('find', function(){
    this.populate("products.products")
}
)

cartSchema.plugin(paginate)

export const cartsModel = mongoose.model(cartsCollection, cartSchema)