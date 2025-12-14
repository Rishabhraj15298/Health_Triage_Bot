import Document from "../models/document.model.js"

/**
 * @desc Upload medical document (metadata only)
 * @route POST /api/documents/upload
 * @access Private
 */
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
    
    // Convert buffer to base64 data URI for storage
    // In production, upload to S3/Cloudinary and get URL
    const base64String = buffer.toString('base64');
    const fileUrl = `data:${mimetype};base64,${base64String}`;

    // Map mimetype to schema enum
    let schemaFileType = "other";
    if (mimetype.includes("pdf")) schemaFileType = "pdf";
    else if (mimetype.includes("image")) schemaFileType = "image";

    const document = await Document.create({
      clerkUserId,
      title: originalname,
      documentType: "other", // Default to 'other' to match enum
      fileUrl,
      fileType: schemaFileType, // Use mapped type
      fileSize: size,
      reportDate: new Date(),
      processingStatus: "uploaded"
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
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
