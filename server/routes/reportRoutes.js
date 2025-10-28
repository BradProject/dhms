// import { Router } from 'express'
// import { kpis } from '../controllers/reportController.js'
// import { protect } from '../middleware/authMiddleware.js'
// const r = Router()

// // r.get('/kpis', protect, kpis)
// r.get('/kpis/public', kpis)

// export default r


// import { Router } from 'express' 
// import { kpis } from '../controllers/reportController.js'
// // import { protect } from '../middleware/authMiddleware.js'

// const r = Router()

// // Public route for dashboard
// r.get('/kpis', kpis)

// // If you want private version too:
// // r.get('/kpis/private', protect, kpis)

// export default r


import express from "express";
import { kpis } from "../controllers/reportController.js";

const router = express.Router();

// GET KPIs and charts
router.get("/kpis", kpis);

export default router;
