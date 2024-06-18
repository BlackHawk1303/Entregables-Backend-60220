import { Router } from "express";
import cartServices from "../services/cartManager.services.js";
import { authToken, authorization } from "../utils.js";
import { getCart, postCart, findCartByID, addProductCart, deleteCart, deleteProductByID, putUpdateCart, putUpdateCartByproductID, postPurchase } from "../controllers/all.controller.js";

const cartRouter = Router()

cartRouter.get("/", getCart)
//cartRouter.post("/", postCart)
cartRouter.get("/:_id", findCartByID)
cartRouter.post("/:cid/products/:pid", authToken, authorization(["user", "premium"]), addProductCart)
//cartRouter.delete('/:_id', deleteCart)
cartRouter.delete('/:cid/products/:pid', deleteProductByID)
cartRouter.put('/:_id', putUpdateCart)
cartRouter.put('/:cid/products/:pid', putUpdateCartByproductID)
cartRouter.post('/:cid/purchase', postPurchase)

export default cartRouter