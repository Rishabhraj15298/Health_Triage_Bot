import mongoose from "mongoose";

const sbarReportSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true
    },
    // The generated SBAR text
    reportContent: {
      type: String,
      required: true
    },
    // Optional: we can store structured fields if we parse them out later, 
    // but for now storing the full text is sufficient.
    
    // Metadata about what data was used
    includedDocumentsCount: {
      type: Number,
      default: 0
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SbarReport", sbarReportSchema);
