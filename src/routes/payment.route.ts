import express from "express";
const router = express.Router()
import {Pay, VerifyPayment, getPayments} from '../controllers/payment.controller'
import auth from '../middlewares/auth'

router.post('/',auth, Pay)
router.post('/verify',auth, VerifyPayment)
router.get('/',auth, getPayments)
//trxref=33x97h1ut7&reference=33x97h1ut7
export default router