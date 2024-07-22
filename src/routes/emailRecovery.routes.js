import { Router } from "express"
import { CreateEmailRecoveryID, recoveryEmail, passwordUpdate } from "../controllers/all.controller.js"

const router = Router()

router.post('/', CreateEmailRecoveryID)
//router.get('/recovery/uuid', recoveryEmail)
router.get('/:uuid', recoveryEmail)
router.post('/passwordCheck', passwordUpdate)

export default router