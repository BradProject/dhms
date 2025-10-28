import { Router } from 'express'
import { listCommunity, createCommunity } from '../controllers/communityController.js'
import { protect } from '../middleware/authMiddleware.js'
const r = Router()

r.get('/', protect, listCommunity)
r.post('/', protect, createCommunity)

export default r
