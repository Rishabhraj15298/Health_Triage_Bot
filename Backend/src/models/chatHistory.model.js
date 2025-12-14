import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    default: "default_session"
  },
  messages: [messageSchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastActive on save
chatHistorySchema.pre("save", function(next) {
  this.lastActive = new Date();
  next();
});

// Index for efficient queries
chatHistorySchema.index({ userId: 1, sessionId: 1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
