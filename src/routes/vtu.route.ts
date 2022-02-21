import express from 'express'
const router = express.Router()
import Auth from '../middlewares/auth'
import {FetchNetworkID, BuyAirTime, GetDataPlans, BuyData, GetTransactions, Statistics} from '../controllers/vtu.controller'

router.post('/airtime',Auth,  BuyAirTime)
router.post('/data',Auth, BuyData)
router.get('/',  FetchNetworkID)
router.get('/history',  Auth, GetTransactions)
router.get('/stats', Auth, Statistics )
router.get('/data',GetDataPlans )

export default router
