// // routes/feedback.js
// import express from "express";
// import Feedback from "../models/Feedback.js";
// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { name, email, message } = req.body;
//     if (!name || !email || !message) {
//       return res.status(400).json({ error: "All fields required" });
//     }

//     const feedback = new Feedback({ name, email, message });
//     await feedback.save();

//     res.status(201).json({ success: true });
//   } catch (error) {
//     console.error("Error saving feedback:", error);
//     res.status(500).json({ error: "Failed to save feedback" });
//   }
// });

// export default router;


// routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

/* 
---------------------------------------------------------
 POST /api/feedback
 - Public: Allow users to submit feedback
---------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }

    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

/* 
---------------------------------------------------------
 GET /api/feedback
 - Admin: Retrieve all feedback (with optional search & status)
---------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

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

    const feedbackList = await Feedback.find(filter).sort({ createdAt: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
});

/* 
---------------------------------------------------------
 GET /api/feedback/:id
 - Admin: Retrieve a single feedback item by ID
---------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

export default router;
