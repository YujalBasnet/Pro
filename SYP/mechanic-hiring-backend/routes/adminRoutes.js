import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getUsers,
  deleteUser,
  getMechanics,
  approveMechanic,
  getRequests,
  deleteRequest
} from "../controllers/adminController.js";

const router = express.Router();

// All routes protected, admin only
router.use(protect, authorize("Admin"));

// Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Mechanics
router.get("/mechanics", getMechanics);
router.put("/mechanics/:id/approve", approveMechanic);

// Service Requests
router.get("/requests", getRequests);
router.delete("/requests/:id", deleteRequest);

export default router;