import express from "express";
import multer from "multer";
import { requireAuth } from "@clerk/express";
import {
  uploadDocument,
  getUserDocuments,
  deleteDocument
} from "../controller/document.controller.js";

const router = express.Router();

/**
 * Multer Config (Memory Storage)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * @route   POST /api/documents/upload
 * @desc    Upload health document
 * @access  Private
 */
router.post(
  "/upload",
  requireAuth(),
  upload.single("document"),
  uploadDocument
);

/**
 * @route   GET /api/documents
 * @desc    Get all documents of logged-in user
 * @access  Private
 */
router.get("/", requireAuth(), getUserDocuments);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete("/:id", requireAuth(), deleteDocument);

export default router;
