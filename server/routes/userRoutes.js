import { Router } from 'express'
import { login, register, profile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
const r = Router()

r.post('/register', register)
r.post('/login', login)
r.get('/me', protect, profile)

export default r
