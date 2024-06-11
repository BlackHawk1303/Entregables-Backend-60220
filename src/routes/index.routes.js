import { Router } from "express"
import { loadProduct, getCartByID } from "../controllers/all.controller.js"

const router = Router()

router.get('/products', loadProduct)
router.get('/cart/:_id', getCartByID)

router.get('/', async (req, res) => {
    res.redirect('/login')
})

export default router