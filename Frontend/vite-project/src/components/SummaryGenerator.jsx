import { useState, useEffect } from "react";
import { Sparkles, Download, FileText, Loader2, History, ChevronRight, Activity, AlertCircle, Stethoscope, ClipboardCheck } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function SummaryGenerator() {
  const { getToken } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Fetch past reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoadingReports(false);
    }
  };

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
        // Refresh reports list
        fetchReports();
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
    if (!summary) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Please allow popups to download the report.");

    const sbar = parseSBAR(summary);
    
    // Fallback if parsing fails
    const content = sbar ? `
      <div class="section situation">
        <div class="label">SITUATION</div>
        <p>${sbar.S}</p>
      </div>
      <div class="section background">
        <div class="label">BACKGROUND</div>
        <p>${sbar.B}</p>
      </div>
      <div class="section assessment">
        <div class="label">ASSESSMENT</div>
        <p>${sbar.A}</p>
      </div>
      <div class="section recommendation">
        <div class="label">RECOMMENDATION</div>
        <p>${sbar.R}</p>
      </div>
    ` : `<p>${summary}</p>`;

    printWindow.document.write(`
      <html>
        <head>
          <title>SBAR Doctor Handover Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .brand { font-size: 24px; font-weight: bold; color: #2563eb; }
            .date { color: #666; font-size: 14px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
            .label { background: #f8fafc; color: #1e40af; font-weight: bold; padding: 10px 15px; border-bottom: 1px solid #eee; font-size: 14px; letter-spacing: 0.5px; }
            p { margin: 0; padding: 15px; background: #fff; }
            @media print {
              body { padding: 0; }
              .section { border: none; margin-bottom: 20px; }
              .label { background: none; color: #000; border-bottom: 1px solid #000; padding-left: 0; }
              p { padding: 10px 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">Vaidya - Clinical Handover Report</div>
            <div class="date">${new Date().toLocaleDateString()}</div>
          </div>
          <h1>SBAR Report</h1>
          ${content}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Helper to parse SBAR text into sections
  const parseSBAR = (text) => {
    if (!text) return { S: "", B: "", A: "", R: "" };
    
    // Simple parsing based on keywords
    const sIndex = text.indexOf("SITUATION:");
    const bIndex = text.indexOf("BACKGROUND:");
    const aIndex = text.indexOf("ASSESSMENT:");
    const rIndex = text.indexOf("RECOMMENDATION:");

    if (sIndex === -1 || bIndex === -1) return null; // Fallback for old format

    return {
      S: text.substring(sIndex + 10, bIndex).trim(),
      B: text.substring(bIndex + 11, aIndex).trim(),
      A: text.substring(aIndex + 11, rIndex).trim(),
      R: text.substring(rIndex + 15).trim()
    };
  };

  const sbarContent = summary ? parseSBAR(summary) : null;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-400" />
          SBAR Doctor Handover Report
        </h3>

        <p className="text-gray-400 mb-8 max-w-2xl">
          Generate a professional clinical handover report synthesizing your profile 
          and recent medical documents. Designed for seamless doctor communication.
        </p>

        {!summary ? (
          <button
            onClick={handleGenerateSummary}
            disabled={generating}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Medical Data...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Generate Clinical Report
              </>
            )}
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SBAR Display */}
            {sbarContent ? (
              <div className="grid gap-4">
                {/* SITUATION */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-24 h-24 text-blue-400" />
                  </div>
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    SITUATION
                  </h4>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">{sbarContent.S}</p>
                </div>

                {/* BACKGROUND */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <History className="w-24 h-24 text-emerald-400" />
                  </div>
                  <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                      <History className="w-4 h-4" />
                    </div>
                    BACKGROUND
                  </h4>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">{sbarContent.B}</p>
                </div>

                 {/* ASSESSMENT */}
                 <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Stethoscope className="w-24 h-24 text-amber-400" />
                  </div>
                  <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                     <div className="p-1.5 bg-amber-500/20 rounded-lg">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    ASSESSMENT
                  </h4>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">{sbarContent.A}</p>
                </div>

                 {/* RECOMMENDATION */}
                 <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ClipboardCheck className="w-24 h-24 text-purple-400" />
                  </div>
                  <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    RECOMMENDATION
                  </h4>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">{sbarContent.R}</p>
                </div>
              </div>
            ) : (
              // Fallback for non-SBAR text
              <div className="bg-[#0A0A0F] border border-gray-700 rounded-lg p-6">
                 <div className="text-gray-300 space-y-3 text-sm leading-relaxed whitespace-pre-line">
                    {summary}
                 </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={handleDownloadPDF}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 border border-gray-700"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>

              <button
                onClick={handleGenerateSummary}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 ml-auto shadow-lg shadow-blue-900/20"
              >
                <Sparkles className="w-5 h-5" />
                Regenerate New Report
              </button>
              
              <button
                onClick={() => setSummary(null)}
                className="text-gray-400 hover:text-white px-4 py-3 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Past Reports List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          Past Reports History
        </h3>

        {loadingReports ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500/50" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-xl">
            <ClipboardCheck className="w-12 h-12 text-gray-800 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No clinical reports generated yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div 
                key={report._id} 
                className="group relative bg-black/40 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-900/10 hover:to-transparent cursor-pointer overflow-hidden"
                onClick={() => setSummary(report.reportContent)}
              >
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors text-blue-400 group-hover:text-blue-300 group-hover:scale-110 duration-300">
                      <FileText className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-mono text-gray-500 group-hover:text-blue-300/70 transition-colors bg-gray-900/50 px-2 py-1 rounded-md border border-gray-800">
                      {new Date(report.createdAt).toLocaleDateString()}
                   </span>
                </div>
                
                <h4 className="text-gray-200 font-semibold text-sm mb-1 group-hover:text-white transition-colors">
                  Clinical Handover Report
                </h4>
                
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-800/50 text-gray-500">
                   <span className="text-xs flex items-center gap-1.5 group-hover:text-gray-400 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                      {report.includedDocumentsCount} Docs Analyzed
                   </span>
                   <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 text-gray-600 group-hover:text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
