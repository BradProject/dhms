import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ==============================
// POST /reset-password-direct
// ==============================
router.post("/reset-password-direct", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password; // pre-save hook will hash the password
    await user.save();

    res.json({ message: "✅ Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "⚠️ Failed to reset password" });
  }
});

// ==============================
// GET /all-emails
// ==============================
router.get("/all-emails", async (req, res) => {
  try {
    const users = await User.find({}, "email"); // fetch only emails
    const emails = users.map((u) => u.email);
    res.json({ emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});

export default router;
