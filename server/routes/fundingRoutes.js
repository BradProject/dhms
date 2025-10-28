// import { Router } from 'express'
// import { listFunding, createFunding } from '../controllers/fundingController.js'
// import { protect, permit } from '../middleware/authMiddleware.js'
// const r = Router()

// r.get('/', protect, listFunding)
// r.post('/', protect, permit('admin','analyst'), createFunding)

// export default r



import { Router } from 'express'
import { listFunding, createFunding, updateFunding, deleteFunding } from '../controllers/fundingController.js'
import { protect, permit } from '../middleware/authMiddleware.js'
const r = Router()

r.get('/', protect, listFunding)
r.post('/', protect, permit('admin','analyst'), createFunding)
r.put('/:id', protect, permit('admin','analyst'), updateFunding)
r.delete('/:id', protect, permit('admin','analyst'), deleteFunding)

export default r
