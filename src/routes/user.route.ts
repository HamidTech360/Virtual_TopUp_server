import express from "express";
const router = express.Router()
import {createUser, AuthUser, getUser, getAllUsers} from '../controllers/user.controller'
import auth from '../middlewares/auth'

router.post('/', createUser)
router.get('/all',auth, getAllUsers)
router.get('/',auth, getUser)
router.post('/auth', AuthUser)


export default router;