import { Router } from "express";
import { generateRandomProd } from "../controllers/all.controller.js";

const router= Router()

router.get('/mockingproducts', generateRandomProd)

export default router