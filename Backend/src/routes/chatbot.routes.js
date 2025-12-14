import express from "express";
import { requireAuth } from "@clerk/express";
import { handleMessage, getChatHistory, clearChatHistory } from "../controller/chatbot.controller.js";

const router = express.Router();

/**
 * @route   POST /api/chatbot/message
 * @desc    Send message to AI chatbot
 * @access  Private
 */
router.post("/message", requireAuth(), handleMessage);

/**
 * @route   GET /api/chatbot/history
 * @desc    Get chat history for current user
 * @access  Private
 */
router.get("/history", requireAuth(), getChatHistory);

/**
 * @route   DELETE /api/chatbot/history
 * @desc    Clear chat history for current user
 * @access  Private
 */
router.delete("/history", requireAuth(), clearChatHistory);

export default router;

