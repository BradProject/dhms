

// import mongoose from "mongoose";

// const hubSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     county: String,
//     constituency: { type: String, required: true }, // ✅ NEW FIELD
//     ward: String,
//     type: {
//       type: String,
//       enum: [
//         "Innovation Hub",
//         "Jitume Center",
//         "CIH (Constituency Innovation Hub)",
//         "Community ICT Center",
//       ],
//       default: "Innovation Hub",
//     },
//     status: {
//       type: String,
//       enum: ["planning", "development", "operational"],
//       default: "planning",
//     },
//     photos: { type: [String], default: [] },
//     milestones: { type: [String], default: [] },
//     location: {
//       type: { type: String, enum: ["Point"], default: "Point" },
//       coordinates: { type: [Number], default: [0, 0] },
//     },
//     programs: { type: [String], default: [] },
//     resources: {
//       laptops: { type: Number, default: 0, min: 0 },
//       desktops: { type: Number, default: 0, min: 0 },
//       accessPoints: { type: Number, default: 0, min: 0 },
//       bandwidth: { type: Number, default: 0, min: 0 },
//     },
//     implementingPartner: { type: String },
//     populationEnrolled: { type: Number, default: 0, min: 0 },
//   },
//   { timestamps: true }
// );

// hubSchema.index({ location: "2dsphere" });
// export default mongoose.model("Hub", hubSchema);


import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    laptops: { type: Number, default: 0, min: 0 },
    desktops: { type: Number, default: 0, min: 0 },
    accessPoints: { type: Number, default: 0, min: 0 },
    bandwidth: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const hubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    county: { type: String },
    constituency: { type: String, required: true },
    ward: { type: String },

    // 🧭 Hub details
    type: {
      type: String,
      enum: [
        "Innovation Hub",
        "Jitume Center",
        "CIH (Constituency Innovation Hub)",
        "Community ICT Center",
      ],
      default: "Innovation Hub",
    },
    status: {
      type: String,
      enum: ["planning", "development", "operational"],
      default: "planning",
    },

    // 📸 Media
    photos: { type: [String], default: [] },

    // 📍 Location
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    // 🏗️ Hub programs and milestones
    milestones: { type: [String], default: [] },
    programs: { type: [String], default: [] },

    // ⚙️ Resources and partner info
    resources: { type: resourceSchema, default: () => ({}) },
    implementingPartner: { type: String },
    populationEnrolled: { type: Number, default: 0, min: 0 },

    // 👤 Contact Details
    contactPerson: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [/^\+254\d{9}$/, "Phone must be in format +254XXXXXXXXX"],
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
  },
  { timestamps: true }
);

hubSchema.index({ location: "2dsphere" });

export default mongoose.model("Hub", hubSchema);

