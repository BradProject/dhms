// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

// ✅ Get all feedback (admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const { status, search } = req.query;

    // Build filter object dynamically
    let filter = {};
    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const feedbackList = await Feedback.find(filter).sort({ createdAt: -1 }); // newest first
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to retrieve feedback" });
  }
};

// ✅ Get a single feedback by ID (optional)
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};
