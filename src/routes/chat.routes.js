import { Router } from 'express';

const router = Router()

router.get('/chat', (req, res) => {
    res.render('chat', { subTitle: "chat", style: "desing.css" })
})

export default router;