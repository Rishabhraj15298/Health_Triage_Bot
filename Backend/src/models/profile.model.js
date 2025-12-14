import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Clerk user reference
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Basic user details
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    dateOfBirth: {
      type: Date
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      required: true
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },

    // Physical attributes
    heightCm: {
      type: Number
    },

    weightKg: {
      type: Number
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },

    // Emergency contact
    emergencyContact: {
      name: {
        type: String
      },
      phone: {
        type: String
      }
    },

    // Medical History
    allergies: [{ type: String }],
    currentMedications: [{ type: String }],
    chronicConditions: [{ type: String }],
    pastSurgeries: [{ type: String }],
    familyHistory: { type: String },

    // Lifestyle
    smokingStatus: {
      type: String,
      enum: ["never", "former", "current"]
    },
    alcoholConsumption: {
      type: String,
      enum: ["none", "occasional", "moderate", "heavy"]
    },
    exerciseFrequency: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Profile", profileSchema);
