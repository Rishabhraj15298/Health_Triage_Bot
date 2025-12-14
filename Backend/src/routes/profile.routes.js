import express from "express";
import { requireAuth } from "@clerk/express";
import {
  upsertProfile,
  getProfile,
  upsertMedicalHistory,
  generateSummary
} from "../controller/profile.controller.js";

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/", requireAuth(), getProfile);

/**
 * @route   POST /api/profile
 * @desc    Create or Update user profile
 * @access  Private
 */
router.post("/", requireAuth(), upsertProfile);

/**
 * @route   POST /api/profile/medical
 * @desc    Update medical history
 * @access  Private
 */
router.post("/medical", requireAuth(), upsertMedicalHistory);

/**
 * @route   POST /api/profile/generate-summary
 * @desc    Generate AI summary
 * @access  Private
 */
router.post("/generate-summary", requireAuth(), generateSummary);

export default router;
