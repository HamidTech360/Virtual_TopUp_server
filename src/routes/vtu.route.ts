import express from 'express'
const router = express.Router()
import Auth from '../middlewares/auth'
import {FetchNetworkID, BuyAirTime, GetDataPlans, BuyData} from '../controllers/vtu.controller'

router.post('/airtime',Auth,  BuyAirTime)
router.post('/data',Auth, BuyData)
router.get('/',  FetchNetworkID)
router.get('/data',GetDataPlans )

export default router
