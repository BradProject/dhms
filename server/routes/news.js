import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import News from "../models/News.js";

const router = express.Router();

// ================================
// IMAGE UPLOAD SETUP (Multer)
// ================================
const uploadDir = "uploads";

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================================
// GET ALL NEWS
// ================================
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error });
  }
});

// ================================
// POST NEW NEWS
// ================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Generate full image URL accessible by frontend
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newNews = new News({
      title,
      description,
      imageUrl,
    });

    await newNews.save();
    res.status(201).json({ message: "News added successfully", news: newNews });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json({ message: "Failed to add news", error });
  }
});

export default router;
