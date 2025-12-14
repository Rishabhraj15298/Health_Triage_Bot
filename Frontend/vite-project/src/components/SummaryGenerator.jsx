import { useState } from "react";
import { Sparkles, Download, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function SummaryGenerator() {
  const { getToken } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleGenerateSummary = async () => {
    setGenerating(true);

    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/generate-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      } else {
        const errorData = await response.json();
        console.error("Summary generation failed:", errorData);
        alert(`Failed to generate summary: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Error generating summary. Please check console for details.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    // This would trigger PDF download
    window.open(`${import.meta.env.VITE_API_URL}/api/profile/download-summary`, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-400" />
        AI Health Summary
      </h3>

      <p className="text-gray-400 mb-6">
        Generate a comprehensive AI-powered summary of your health profile,
        medical history, and uploaded documents. Perfect for sharing with your
        healthcare provider.
      </p>

      {!summary ? (
        <button
          onClick={handleGenerateSummary}
          disabled={generating}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Summary
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Summary Display */}
          <div className="bg-[#0A0A0F] border border-gray-700 rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              <h4 className="text-lg font-semibold text-white mb-3">
                Your Health Summary
              </h4>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                {summary.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>

            <button
              onClick={handleGenerateSummary}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">What's included in the summary?</p>
            <ul className="text-blue-400 space-y-1 text-xs">
              <li>• Personal and contact information</li>
              <li>• Complete medical history</li>
              <li>• Current medications and allergies</li>
              <li>• Analysis of uploaded health documents</li>
              <li>• AI-generated health insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
