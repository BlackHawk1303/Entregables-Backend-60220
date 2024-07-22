import { Router } from "express"
import { authToken, authorization } from "../utils.js"
import { getCart, findCartByID, addProductCart, deleteProductByID, putUpdateCart, putUpdateCartByproductID, postPurchase } from "../controllers/all.controller.js"

const cartRouter = Router()

cartRouter.get("/", getCart)
cartRouter.get("/:_id", findCartByID)
cartRouter.post("/:cid/products/:pid", authToken, authorization(["user", "premium"]), addProductCart)
cartRouter.delete('/:cid/products/:pid', deleteProductByID)
cartRouter.put('/:_id', putUpdateCart)
cartRouter.put('/:cid/products/:pid', putUpdateCartByproductID)
cartRouter.post('/:cid/purchase', postPurchase)

export default cartRouter