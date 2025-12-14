import Profile from "../models/profile.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @desc Create or Update User Profile
 * @route POST /api/profile
 * @access Private
 */
export const upsertProfile = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      emergencyPhone
    } = req.body;

    // Basic validation
    if (!fullName || !email || !gender) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { clerkUserId },
      {
        clerkUserId,
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        address: {
          street: address,
          city,
          state,
          zipCode
        },
        emergencyContact: {
          name: emergencyContact,
          phone: emergencyPhone
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile
    });
  } catch (error) {
    console.error("Upsert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save profile"
    });
  }
};

/**
 * @desc Update Medical History
 * @route POST /api/profile/medical
 * @access Private
 */
export const upsertMedicalHistory = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const {
      bloodType,
      height,
      weight,
      allergies,
      currentMedications,
      chronicConditions,
      pastSurgeries,
      familyHistory,
      smokingStatus,
      alcoholConsumption,
      exerciseFrequency
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { clerkUserId },
      {
        bloodGroup: bloodType,
        heightCm: height,
        weightKg: weight,
        allergies,
        currentMedications,
        chronicConditions,
        pastSurgeries,
        familyHistory,
        smokingStatus,
        alcoholConsumption,
        exerciseFrequency
      },
      {
        new: true,
        upsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Medical history saved successfully",
      data: profile
    });
  } catch (error) {
    console.error("Medical History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save medical history"
    });
  }
};

/**
 * @desc Generate AI Summary
 * @route POST /api/profile/generate-summary
 * @access Private
 */


/**
 * @desc Generate AI Summary
 * @route POST /api/profile/generate-summary
 * @access Private
 */
import SbarReport from "../models/sbarReport.model.js";
import Document from "../models/document.model.js";

export const generateSummary = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const profile = await Profile.findOne({ clerkUserId });
    const documents = await Document.find({ clerkUserId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Prepare Documents Context
    const documentsContext = documents.map(doc => `
      - Document Type: ${doc.documentType}
      - Title: ${doc.title}
      - Date: ${doc.reportDate ? new Date(doc.reportDate).toLocaleDateString() : "N/A"}
      - Extracted Text/Summary: ${doc.aiSummary || doc.extractedText || "No text content availble"}
    `).join("\n");

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-flash-latest as confirmed working
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Construct Prompt for SBAR Format
    const prompt = `
      Act as a professional medical assistant preparing a clinical handover for a physician. 
      Analyze the patient's health profile and their uploaded medical documents to generate a "Doctor Handover" report using the SBAR (Situation, Background, Assessment, Recommendation) format.

      PATIENT PROFILE:
      Name: ${profile.fullName}
      Age: ${profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : "Unknown"}
      Gender: ${profile.gender}
      Blood Group: ${profile.bloodGroup || "Not recorded"}
      Height/Weight: ${profile.heightCm || "?"}cm / ${profile.weightKg || "?"}kg
      
      MEDICAL HISTORY:
      - Allergies: ${profile.allergies?.join(", ") || "None"}
      - Current Meds: ${profile.currentMedications?.join(", ") || "None"}
      - Conditions: ${profile.chronicConditions?.join(", ") || "None"}
      - Surgeries: ${profile.pastSurgeries?.join(", ") || "None"}
      
      RECENT MEDICAL DOCUMENTS & REPORTS:
      ${documentsContext || "No recent documents available."}

      OUTPUT FORMAT INSTRUCTIONS:
      Generate the response strictly in the following SBAR format. Do not use markdown (no **, #). Use uppercase labels followed by a colon for sections.

      SITUATION:
      [State the patient's name, age, gender, and the primary reason for this summary based on recent reports or conditions. Keep it concise.]

      BACKGROUND:
      [Summarize pertinent medical history, allergies, current medications, and significant lifestyle factors. Mention recent procedures or labs found in documents.]

      ASSESSMENT:
      [Synthesize the data from the documents and history. Identify potential issues, risk factors (like abnormal lab results if any), or stability of chronic conditions. If reports are normal, state that.]

      RECOMMENDATION:
      [Suggest specific actions for the doctor (e.g., "Review blood pressure medication," "Follow up on elevated lipids"). Include preventative care questions the patient should ask.]

      Ensure the tone is professional, clinical, and suitable for a doctor to read quickly.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // SAVE THE REPORT TO DB
    const newReport = await SbarReport.create({
      clerkUserId,
      reportContent: summary,
      includedDocumentsCount: documents.length
    });

    return res.status(200).json({
      success: true,
      summary,
      reportId: newReport._id
    });
  } catch (error) {
    console.error("Generate Summary Error:", error);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    
    return res.status(500).json({
      success: false,
      message: `Failed to generate summary: ${error.message}`
    });
  }
};

/**
 * @desc Get User's SBAR Reports
 * @route GET /api/profile/reports
 * @access Private
 */
export const getSbarReports = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Fetch reports, sorted by newest first
    const reports = await SbarReport.find({ clerkUserId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error("Get SBAR Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports"
    });
  }
};

/**
 * @desc Get logged-in user's profile
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const profile = await Profile.findOne({ clerkUserId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};
