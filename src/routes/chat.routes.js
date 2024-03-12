import { Router } from 'express';

const router = Router()

// const router = express.Router();

router.get('/chat', (req, res) => {
    res.render('chat', { subTitle: "chat", style: "chat.css" })
})

// router.get('/', (req, res) => {
//     res.render('index', {})
// })


// router.get("/message", (req, res) => {
//     res.render("messages");
// });

export default router;