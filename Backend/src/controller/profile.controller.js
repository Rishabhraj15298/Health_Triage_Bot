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
export const generateSummary = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const profile = await Profile.findOne({ clerkUserId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct Prompt
    const prompt = `
      Act as a professional medical assistant. Analyze the following patient health profile and generate a comprehensive, easy-to-read health summary.
      
      Patient Name: ${profile.fullName}
      Age: ${new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}
      Gender: ${profile.gender}
      Blood Group: ${profile.bloodGroup || "Not recorded"}
      Height: ${profile.heightCm || "N/A"} cm
      Weight: ${profile.weightKg || "N/A"} kg
      
      Medical History:
      - Allergies: ${profile.allergies?.join(", ") || "None"}
      - Current Medications: ${profile.currentMedications?.join(", ") || "None"}
      - Chronic Conditions: ${profile.chronicConditions?.join(", ") || "None"}
      - Past Surgeries: ${profile.pastSurgeries?.join(", ") || "None"}
      - Family History: ${profile.familyHistory || "None"}
      
      Lifestyle:
      - Smoking: ${profile.smokingStatus || "Unknown"}
      - Alcohol: ${profile.alcoholConsumption || "Unknown"}
      - Exercise: ${profile.exerciseFrequency || "Unknown"}
      
      Please provide:
      1. A brief health overview.
      2. Key risk factors based on lifestyle and history.
      3. Specific recommendations for preventative care.
      4. Questions they should ask their doctor.
      
      Format the output in clean, readable text with clear headings. Do not use markdown symbols like ** or #, just use plain text formatting with newlines.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Generate Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate summary. Please ensure GEMINI_API_KEY is set."
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
