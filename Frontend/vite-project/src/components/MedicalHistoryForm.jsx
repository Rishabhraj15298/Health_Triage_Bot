import { useState, useEffect } from "react";
import { Heart, Activity, Pill, AlertCircle, Plus, X } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function MedicalHistoryForm({ onSave }) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    bloodType: "",
    height: "",
    weight: "",
    allergies: [],
    currentMedications: [],
    chronicConditions: [],
    pastSurgeries: [],
    familyHistory: "",
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
  });

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const profile = data.data;
            setFormData({
              bloodType: profile.bloodGroup || "",
              height: profile.heightCm || "",
              weight: profile.weightKg || "",
              allergies: profile.allergies || [],
              currentMedications: profile.currentMedications || [],
              chronicConditions: profile.chronicConditions || [],
              pastSurgeries: profile.pastSurgeries || [],
              familyHistory: profile.familyHistory || "",
              smokingStatus: profile.smokingStatus || "",
              alcoholConsumption: profile.alcoholConsumption || "",
              exerciseFrequency: profile.exerciseFrequency || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };

    fetchMedicalHistory();
  }, [user]);

  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newSurgery, setNewSurgery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter("");
    }
  };

  const removeItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/medical`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        if (onSave) onSave(formData);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving medical history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Health Info */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Basic Health Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Blood Type
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="170"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="70"
            />
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          Allergies
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("allergies", newAllergy, setNewAllergy))}
            className="flex-1 bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            placeholder="Add allergy (e.g., Penicillin)"
          />
          <button
            type="button"
            onClick={() => addItem("allergies", newAllergy, setNewAllergy)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.allergies.map((allergy, index) => (
            <span
              key={index}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeItem("allergies", index)}
                className="hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-400" />
          Current Medications
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("currentMedications", newMedication, setNewMedication))}
            className="flex-1 bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            placeholder="Add medication (e.g., Aspirin 100mg daily)"
          />
          <button
            type="button"
            onClick={() => addItem("currentMedications", newMedication, setNewMedication)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.currentMedications.map((med, index) => (
            <span
              key={index}
              className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {med}
              <button
                type="button"
                onClick={() => removeItem("currentMedications", index)}
                className="hover:text-blue-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-blue-400" />
          Chronic Conditions
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("chronicConditions", newCondition, setNewCondition))}
            className="flex-1 bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            placeholder="Add condition (e.g., Diabetes Type 2)"
          />
          <button
            type="button"
            onClick={() => addItem("chronicConditions", newCondition, setNewCondition)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.chronicConditions.map((condition, index) => (
            <span
              key={index}
              className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {condition}
              <button
                type="button"
                onClick={() => removeItem("chronicConditions", index)}
                className="hover:text-purple-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Lifestyle</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Smoking Status
            </label>
            <select
              value={formData.smokingStatus}
              onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            >
              <option value="">Select</option>
              <option value="never">Never</option>
              <option value="former">Former</option>
              <option value="current">Current</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alcohol Consumption
            </label>
            <select
              value={formData.alcoholConsumption}
              onChange={(e) => setFormData({ ...formData, alcoholConsumption: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="occasional">Occasional</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exercise Frequency
            </label>
            <select
              value={formData.exerciseFrequency}
              onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
              className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            >
              <option value="">Select</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light (1-2 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Medical History"}
        </button>

        {success && (
          <span className="text-green-400 flex items-center gap-2">
            ✓ Medical history saved successfully!
          </span>
        )}
      </div>
    </form>
  );
}
