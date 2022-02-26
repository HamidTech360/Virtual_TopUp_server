import express from "express";
const router = express.Router()
import auth from '../middlewares/auth'
import {createUser,
        AuthUser, 
        getUser, 
        getAllUsers,
        deleteUser,
        ResetUser
} from '../controllers/user.controller'


router.post('/', createUser)
router.delete('/',auth, deleteUser)
router.get('/all',auth, getAllUsers)
router.get('/',auth, getUser)
router.post('/auth', AuthUser)
router.post('/verify')
router.put('/', ResetUser )


export default router;