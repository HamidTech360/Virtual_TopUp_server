import express from 'express'
const router = express.Router()
import { postReview, getReviews } from '../controllers/review.controller'
import auth from '../middlewares/auth'

router.post('/',auth, postReview)
router.get('/', getReviews)

export default router;