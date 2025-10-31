
import express from "express";
import { kpis } from "../controllers/reportController.js";

const router = express.Router();

// GET KPIs and charts
router.get("/kpis", kpis);

export default router;
