import express from "express";
import Log from "../models/Log.js"; // Mongoose model
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

router.get("/", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.json(logs);
});

export default router;

