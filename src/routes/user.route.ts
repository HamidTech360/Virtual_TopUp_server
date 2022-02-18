import express from "express";
const router = express.Router()
import auth from '../middlewares/auth'
import {createUser,
        AuthUser, 
        getUser, 
        getAllUsers} from '../controllers/user.controller'


router.post('/', createUser)
router.get('/all',auth, getAllUsers)
router.get('/',auth, getUser)
router.post('/auth', AuthUser)
router.post('/verify')


export default router;