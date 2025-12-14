import { useState } from "react";
import ProfileForm from "../components/ProfileForm";
import MedicalHistoryForm from "../components/MedicalHistoryForm";
import SummaryGenerator from "../components/SummaryGenerator";
import { User, Heart, Sparkles } from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "medical", label: "Medical History", icon: Heart },
    { id: "summary", label: "AI Summary", icon: Sparkles },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your personal information and medical history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === "personal" && <ProfileForm />}
        {activeTab === "medical" && <MedicalHistoryForm />}
        {activeTab === "summary" && <SummaryGenerator />}
      </div>


    </div>
  );
}
