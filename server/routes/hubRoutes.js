


// import { Router } from "express";
// import {
//   listHubs,
//   createHub,
//   updateHub,
//   patchHub,
//   deleteHub,
//   listCounties,
//   listConstituencies, 
// } from "../controllers/hubController.js";
// import { protect, permit } from "../middleware/authMiddleware.js";

// const r = Router();

// // Get counties & constituencies
// r.get("/counties", listCounties);
// r.get("/constituencies", listConstituencies); // optional filter

// // CRUD endpoints
// r.get("/", listHubs);
// r.post("/", protect, permit("admin", "manager"), createHub);
// r.put("/:id", protect, permit("admin", "manager"), updateHub);
// r.patch("/:id", protect, permit("admin", "manager"), patchHub);
// r.delete("/:id", protect, permit("admin"), deleteHub);

// export default r;


import { Router } from "express";
import {
  listHubs,
  createHub,
  updateHub,
  patchHub,
  deleteHub,
  listCounties,
  listConstituencies,
} from "../controllers/hubController.js";
import { protect, permit } from "../middleware/authMiddleware.js";

const router = Router();

// 📍 Metadata endpoints
router.get("/counties", listCounties);
router.get("/constituencies", listConstituencies);

//  CRUD endpoints
router
  .route("/")
  .get(listHubs)
  .post(protect, permit("admin", "manager"), createHub);

router
  .route("/:id")
  .put(protect, permit("admin", "manager"), updateHub)
  .patch(protect, permit("admin", "manager"), patchHub)
  .delete(protect, permit("admin"), deleteHub);

export default router;
