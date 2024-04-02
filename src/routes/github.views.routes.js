import {Router} from 'express'


const router = Router()

router.get('/login', (req, res)=>{
    res.redirect('/user/github')
})


router.get('/error', (req, res) => {
    res.send({hola:"error"})
})

export default router