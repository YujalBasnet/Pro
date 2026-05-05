import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createRequest, getUserRequests, updateRequestStatus } from "../controllers/requestController.js";

const router = express.Router();

// Customer routes
router.post("/", protect, authorize("Customer"), createRequest);
router.get("/user", protect, authorize("Customer"), getUserRequests);

// Mechanic/Admin routes to update request status
router.put("/:id/status", protect, authorize("Mechanic", "Admin"), updateRequestStatus);

export default router;