import { Router } from 'express';
// import { render_Chat } from "../controllers/all.controller.js";
import { authorization } from "../utils.js";

const router = Router()

router.get('/chat', (req, res) => {
    res.render('chat', { subTitle: "chat", style: "desing.css" })
})

export default router;