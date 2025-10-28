

import Hub from "../models/Hub.js";

/* ------------------------ Helper: Validate Resources ------------------------ */
const validateResources = (resources) => {
  if (!resources) return;
  const fields = ["laptops", "desktops", "accessPoints", "bandwidth"];
  for (let field of fields) {
    const val = Number(resources[field]);
    if (!isNaN(val) && val < 0) throw new Error(`${field} cannot be negative`);
  }
};

/* ------------------------------- List All Hubs ------------------------------ */
export const listHubs = async (req, res) => {
  try {
    const hubs = await Hub.find().sort({ createdAt: -1 });
    res.json(hubs);
  } catch (err) {
    console.error(" listHubs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- Create Hub ------------------------------- */
export const createHub = async (req, res) => {
  try {
    const data = req.body;
    const { name, populationEnrolled, resources } = data;

    // Validation
    if (await Hub.findOne({ name }))
      return res.status(400).json({ message: "Hub already exists" });

    if (populationEnrolled < 0)
      return res
        .status(400)
        .json({ message: "Population Enrolled cannot be negative" });

    validateResources(resources);

    // Normalize arrays
    const parseArray = (val) =>
      Array.isArray(val)
        ? val
        : typeof val === "string"
        ? val.split(",").map((v) => v.trim())
        : [];

    // Validate contact info
    if (!data.contactPerson || !data.phone || !data.email) {
      return res.status(400).json({ message: "Contact details are required" });
    }

    const hub = await Hub.create({
      name: data.name,
      county: data.county,
      constituency: data.constituency,
      ward: data.ward,
      type: data.type,
      status: data.status,
      photos: Array.isArray(data.photos)
        ? data.photos
        : data.photo
        ? [data.photo]
        : [],
      milestones: parseArray(data.milestones),
      programs: parseArray(data.programs),
      location:
        data.lat && data.lng
          ? { type: "Point", coordinates: [Number(data.lng), Number(data.lat)] }
          : undefined,
      resources: data.resources || {},
      implementingPartner: data.implementingPartner,
      populationEnrolled: Number(data.populationEnrolled) || 0,

      // ✅ Contact details
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
    });

    res.status(201).json(hub);
  } catch (err) {
    console.error("❌ createHub:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/* -------------------------------- Update Hub ------------------------------- */
export const updateHub = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const hub = await Hub.findById(id);
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    if (data.populationEnrolled < 0)
      return res
        .status(400)
        .json({ message: "Population Enrolled cannot be negative" });

    validateResources(data.resources);

    Object.assign(hub, data);

    // Handle location
    if (data.lat && data.lng)
      hub.location = {
        type: "Point",
        coordinates: [Number(data.lng), Number(data.lat)],
      };

    const updatedHub = await hub.save();
    res.json(updatedHub);
  } catch (err) {
    console.error("❌ updateHub:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/* -------------------------------- Patch Hub -------------------------------- */
export const patchHub = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const hub = await Hub.findById(id);
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    if (data.populationEnrolled !== undefined && data.populationEnrolled < 0)
      throw new Error("Population Enrolled cannot be negative");

    if (data.resources) validateResources(data.resources);

    Object.entries(data).forEach(([key, value]) => {
      if (["milestones", "programs"].includes(key)) {
        hub[key] = Array.isArray(value)
          ? value
          : value.split(",").map((v) => v.trim());
      } else if (["lat", "lng"].includes(key)) {
        if (data.lat && data.lng) {
          hub.location = {
            type: "Point",
            coordinates: [Number(data.lng), Number(data.lat)],
          };
        }
      } else if (key === "resources") {
        hub.resources = { ...hub.resources, ...value };
      } else if (key === "populationEnrolled") {
        hub.populationEnrolled = Number(value);
      } else if (!["photo", "photos"].includes(key)) {
        hub[key] = value;
      }
    });

    const updated = await hub.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ patchHub:", err);
    res.status(400).json({ message: err.message || "Server error" });
  }
};

/* ------------------------------- Delete Hub ------------------------------- */
export const deleteHub = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id);
    if (!hub) return res.status(404).json({ message: "Hub not found" });

    await hub.deleteOne();
    res.json({ message: "Hub deleted successfully" });
  } catch (err) {
    console.error("❌ deleteHub:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------- List Counties/Constituencies -------------------------- */
export const listCounties = async (req, res) => {
  try {
    const counties = await Hub.aggregate([
      { $group: { _id: "$county", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { name: 1 } },
    ]);
    res.json(counties);
  } catch (err) {
    console.error("❌ listCounties:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listConstituencies = async (req, res) => {
  try {
    const constituencies = await Hub.aggregate([
      { $group: { _id: "$constituency", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { name: 1 } },
    ]);
    res.json(constituencies);
  } catch (err) {
    console.error("❌ listConstituencies:", err);
    res.status(500).json({ message: "Server error" });
  }
};
