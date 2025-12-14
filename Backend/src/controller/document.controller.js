import Document from "../models/document.model.js"

/**
 * @desc Upload medical document (metadata only)
 * @route POST /api/documents/upload
 * @access Private
 */
  import { GoogleGenerativeAI } from "@google/generative-ai";

  export const uploadDocument = async (req, res) => {
    try {
      const clerkUserId = req.auth.userId;
  
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }
  
      const { originalname, mimetype, size, buffer } = req.file;
      const base64String = buffer.toString('base64');
      const fileUrl = `data:${mimetype};base64,${base64String}`;
  
      let schemaFileType = "other";
      if (mimetype.includes("pdf")) schemaFileType = "pdf";
      else if (mimetype.includes("image")) schemaFileType = "image";
  
      // 1. Create initial document record
      const document = await Document.create({
        clerkUserId,
        title: originalname,
        documentType: "other",
        fileUrl,
        fileType: schemaFileType,
        fileSize: size,
        reportDate: new Date(),
        processingStatus: "processing" // Set to processing initially
      });
  
      // 2. Process with Gemini for Text Extraction & Summary
      // run in background (don't await) or await if fast enough. 
      // For better UX, we'll await it to ensure data is ready for the summary generator immediately.
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-flash-latest as confirmed working
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  
        const prompt = "Analyze this medical document. 1. Extract the full text. 2. Provide a concise medical summary including any diagnosis, medications, or test results.";
        
        const imagePart = {
          inlineData: {
            data: base64String,
            mimeType: mimetype
          },
        };
  
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const textResponse = response.text();
  
        // Simple heuristic to split summary and extraction (Gemini often combines them)
        // For now, we'll store the full AI response in both or split if possible.
        // Let's store the full detailed response in extractedText and a truncated version in summary
        document.extractedText = textResponse; 
        document.aiSummary = textResponse.substring(0, 500) + "..."; // First 500 chars as quick summary
        document.processingStatus = "completed";
        await document.save();
        
      } catch (aiError) {
        console.error("AI Processing Error:", aiError);
        document.processingStatus = "failed";
        await document.save();
        // We continue without failing the upload, user just won't have auto-extraction
      }
  
      return res.status(201).json({
        success: true,
        message: "Document uploaded and processed successfully",
        data: document
      });
    } catch (error) {
      console.error("Upload Document Error:", error);
      return res.status(500).json({
        success: false,
        message: `Failed to upload document: ${error.message}`
      });
    }
  };

/**
 * @desc Get all documents of logged-in user
 * @route GET /api/documents
 * @access Private
 */
export const getUserDocuments = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const documents = await Document.find({ clerkUserId }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error("Get Documents Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents"
    });
  }
};

/**
 * @desc Get single document by ID
 * @route GET /api/documents/:id
 * @access Private
 */
export const getDocumentById = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      clerkUserId
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error("Get Document By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document"
    });
  }
};

/**
 * @desc Update AI processed data (OCR + Summary)
 * @route PATCH /api/documents/:id/process
 * @access Private (Internal / AI Service)
 */
export const updateProcessedDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      extractedText,
      aiSummary,
      tags,
      processingStatus
    } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    document.extractedText = extractedText || document.extractedText;
    document.aiSummary = aiSummary || document.aiSummary;
    document.tags = tags || document.tags;
    document.processingStatus =
      processingStatus || document.processingStatus;

    await document.save();

    return res.status(200).json({
      success: true,
      message: "Document processed successfully",
      data: document
    });
  } catch (error) {
    console.error("Update Processed Document Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update document"
    });
  }
};

/**
 * @desc Delete document
 * @route DELETE /api/documents/:id
 * @access Private
 */
export const deleteDocument = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { id } = req.params;

    const document = await Document.findOneAndDelete({
      _id: id,
      clerkUserId
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Delete Document Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document"
    });
  }
};
