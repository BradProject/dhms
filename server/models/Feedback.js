// import mongoose from "mongoose";

// const FeedbackSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       trim: true,
//       lowercase: true,
//     },
//     message: {
//       type: String,
//       required: [true, "Feedback message is required"],
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ["new", "reviewed", "resolved"],
//       default: "new",
//     },
//   },
//   { timestamps: true } 
// );

// export default mongoose.model("Feedback", FeedbackSchema);

import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "resolved"],
      default: "new",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    
      expires: 60 * 60 * 24 * 7,
    },
  },
  { timestamps: false } 
);

export default mongoose.model("Feedback", FeedbackSchema);

