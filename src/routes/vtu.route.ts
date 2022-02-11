import express from 'express'
const router = express.Router()
import Auth from '../middlewares/auth'
import {FetchNetworkID, BuyAirTime} from '../controllers/vtu.controller'

router.post('/airtime', Auth, BuyAirTime)
router.get('/',  FetchNetworkID)

export default router
